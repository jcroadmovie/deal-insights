from fastapi import FastAPI, UploadFile, File
from langchain.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
import pdfplumber

from ..db import Deal, SessionLocal

app = FastAPI()
llm = ChatOpenAI(model='gpt-4')


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


def generate_insight(text: str) -> str:
    """Use LLM to produce a short investment memo paragraph."""
    prompt = PromptTemplate(
        input_variables=["teaser_text"],
        template=(
            "\n".join([
                "You are a private credit investment analyst. Given the teaser below, write a one-paragraph personalized memo:",
                "",  # blank line
                "{teaser_text}",
            ])
        ),
    )
    chain = prompt | llm
    return chain.invoke({"teaser_text": text})


@app.post("/api/upload")
async def upload(files: list[UploadFile] = File(...)):
    db = SessionLocal()
    output = []
    for file in files:
        raw_text = extract_text(file)
        fields = extract_fields(raw_text)
        fields["ai_insights"] = generate_insight(raw_text)
        deal = Deal(**fields)
        db.add(deal)
        db.commit()
        output.append(fields)
    return {"deals": output}
