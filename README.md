
# Deal Insight AI

A full-stack AI-powered deal intelligence platform for private credit investors and bankers.

## Example screenshot
![example-screenshot](./asset/image.png)


## Features
- Upload teaser PDFs
- Extract and compare key deal metrics
- Generate personalized investment memos with LLMs
- Identify basic comparables and risk indicators
- Extend with public data enrichment

## Tech Stack
- Frontend: React + Tailwind (ShadCN UI)
- Backend: FastAPI + LangChain + OpenAI
- Database: PostgreSQL

### Database Schema
- **deals**: extracted fields, AI insights, comparables and risks
- **users**: name, mandates and preferred sectors
- **memos**: AI generated memos linked to deals

## Setup

1. Create a `.env` file with your `OPENAI_API_KEY` and optional `DATABASE_URL`.
   You can also set `OPENAI_MODEL` to specify which OpenAI chat model to use
   (defaults to `gpt-3.5-turbo`). The backend automatically loads this file
   using `python-dotenv`.
2. Install Python dependencies:
```bash
pip install -r backend/requirements.txt
```
3. From the project root, run the backend (the `backend` directory is a Python package):
```bash
uvicorn backend.app.main:app --reload
```

Running the backend will create a local SQLite database (`deals.db`). This file is generated automatically and should **not** be committed to version control.

### Updating the Database Schema

If you modify the SQLAlchemy models after `deals.db` has already been created, the
existing database will not get the new columns. An error such as

```
sqlalchemy.exc.OperationalError: (sqlite3.OperationalError) table deals has no column named comparables
```

means the database was created before the `comparables` field was added. To reset
the development database, delete `deals.db` and restart the backend:

```bash
rm deals.db
```

The backend will recreate the file with the current schema on startup. For more
controlled upgrades, consider integrating a migration tool like Alembic.

4. Install frontend dependencies and run the dev server:
```bash
cd frontend
npm install
npm run dev
```
The frontend looks for the API at `VITE_API_URL` (defaults to `/api`). You can
create a `frontend/.env` file to override it:
```bash
echo "VITE_API_URL=http://localhost:8000/api" > frontend/.env
```

