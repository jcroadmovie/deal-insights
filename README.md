
# Deal Insight AI

A full-stack AI-powered deal intelligence platform for private credit investors and bankers.

## Example screenshot
![ChatGPT Image Jun 19, 2025, 11_43_55 AM](https://github.com/user-attachments/assets/2bee63e0-8c61-425c-8b54-8d78c0e5b115)


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
2. From the project root, run the backend (the `backend` directory is a Python package):
```bash
uvicorn backend.app.main:app --reload
```
3. Install frontend dependencies and run the dev server:
```bash
cd frontend
npm install
npm run dev
```

