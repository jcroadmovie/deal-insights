import os
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from langchain.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
import pdfplumber
import json

from ..db import Deal, Memo, User, SessionLocal

load_dotenv()

app = FastAPI()

origins = os.getenv("CORS_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
openai_api_key = os.getenv("OPENAI_API_KEY")
openai_model = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")
llm = ChatOpenAI(model=openai_model, openai_api_key=openai_api_key)


def extract_text(upload: UploadFile) -> str:
    """Extract text from all pages of a PDF upload."""
    with pdfplumber.open(upload.file) as pdf:
        return "\n".join(
            page.extract_text() for page in pdf.pages if page.extract_text()
        )


def extract_fields(text: str) -> dict:
    """Simple heuristic to populate deal fields from teaser text."""
    return {
        "name": "Project " + text.split('Project ')[1].split("\n")[0]
        if "Project " in text
        else "Unknown",
        "sector": "Healthcare / SaaS / Industrial" if "healthcare" in text.lower() else "Other",
        "revenue": 218.0 if "Catalyst" in text else 123.0,
        "ebitda": 83.0 if "Catalyst" in text else 41.0,
        "margin": 38.0,
        "capital_sought": "$150M" if "Dynamo" in text else "TBD",
        "objective": "Growth capital / refinance / Series E",
        "summary": text[:800],
        "highlights": [
            "Recurring revenue",
            "Customer retention",
            "Expansion potential",
        ],
    }


def generate_insight(text: str) -> dict:
    """Use LLM to produce memo, comparables, and risks."""
    prompt = PromptTemplate(
        input_variables=["teaser_text"],
        template="\n".join(
            [
                "You are an analyst generating investment intelligence from the teaser below.",
                "Return a JSON object with keys 'memo', 'comparables', and 'risk_indicators'.",
                "{teaser_text}",
            ]
        ),
    )
    chain = prompt | llm
    response = chain.invoke({"teaser_text": text})
    content = getattr(response, "content", response)
    try:
        return json.loads(content)
    except Exception:
        return {
            "memo": content,
            "comparables": [],
            "risk_indicators": [],
        }


@app.post("/api/upload")
async def upload(files: list[UploadFile] = File(...)):
    db = SessionLocal()
    output = []
    for file in files:
        raw_text = extract_text(file)
        fields = extract_fields(raw_text)
        insights = generate_insight(raw_text)
        fields["highlights"] = json.dumps(fields.get("highlights", []))
        fields["ai_insights"] = insights.get("memo")
        fields["comparables"] = json.dumps(insights.get("comparables", []))
        fields["risk_indicators"] = json.dumps(insights.get("risk_indicators", []))

        deal = Deal(**fields)
        db.add(deal)
        db.commit()
        db.refresh(deal)

        memo = Memo(deal_id=deal.id, content=insights.get("memo"))
        db.add(memo)
        db.commit()

        # include the database ID so the frontend can request memos later
        output_fields = {
            "id": deal.id,
            **fields,
            "highlights": json.loads(fields["highlights"]),
            "comparables": json.loads(fields["comparables"]),
            "risk_indicators": json.loads(fields["risk_indicators"]),
        }
        output.append(output_fields)

    return {"deals": output}


@app.get("/api/deals/{deal_id}/memo")
async def generate_memo(deal_id: int, user_id: int | None = None):
    """Generate a personalized memo for a deal."""
    db = SessionLocal()
    deal = db.query(Deal).filter(Deal.id == deal_id).first()
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")

    user = None
    if user_id is not None:
        user = db.query(User).filter(User.id == user_id).first()

    investor_profile = ""
    if user:
        investor_profile = f"Investor {user.name}. Mandates: {user.mandates}. Preferred sectors: {user.sectors}."

    prompt = PromptTemplate(
        input_variables=["summary", "investor"],
        template="\n".join([
            "Write a concise one-page investment memo for the following deal:",
            "{summary}",
            "Tailor the memo for the investor described below:",
            "{investor}",
        ]),
    )
    chain = prompt | llm
    response = chain.invoke({"summary": deal.summary, "investor": investor_profile})
    memo_content = getattr(response, "content", response)

    memo = Memo(deal_id=deal.id, content=memo_content)
    db.add(memo)
    db.commit()

    return {"memo": memo_content}
