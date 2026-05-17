# Resume Job Assistant

A simple Flask MVP to upload a resume, extract skills and sections, recommend roles, and build safe job search queries.

## Features

- Upload PDF or DOCX resumes
- Extract skills from resume text
- Detect education, experience, and projects sections
- Recommend suitable job roles with role scoring
- Save parsed profiles for later review
- Query direct job APIs and build safe search links

## Setup

1. Create a virtual environment:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

2. Install dependencies:

```powershell
pip install -r requirements.txt
```

3. Install the spaCy English model (optional, for stronger parsing):

```powershell
python -m spacy download en_core_web_sm
```

4. If you want AI cover letters with OpenAI, set the environment variable:

```powershell
$env:OPENAI_API_KEY = 'your-api-key'
```

5. Run the app:

```powershell
python app.py
```

4. Open `http://127.0.0.1:5000` in your browser.

## Notes

- This MVP does not scrape job sites.
- It builds search queries and opens safe public search pages.
- You can extend it later with better NLP, role matching, and API-based job search.
