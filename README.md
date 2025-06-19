
# Deal Insight AI

A full-stack AI-powered deal intelligence platform for private credit investors and bankers.

## Features
- Upload teaser PDFs
- Extract and compare key deal metrics
- Generate personalized investment memos with LLMs
- Extend with public data enrichment

## Tech Stack
- Frontend: React + Tailwind (ShadCN UI)
- Backend: FastAPI + LangChain + OpenAI
- Database: PostgreSQL

## Setup

1. Create a `.env` with your OpenAI key and database URL
2. Run the backend:
```bash
uvicorn app.main:app --reload
```
3. Install frontend dependencies and run the dev server:
```bash
cd frontend
npm install
npm run dev
```

