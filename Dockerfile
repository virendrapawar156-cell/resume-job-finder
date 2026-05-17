FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies required by some Python packages (pdf processing, build deps)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    poppler-utils \
    libpoppler-cpp-dev \
 && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt && pip install --no-cache-dir gunicorn

# Optional: download spaCy small model if spaCy is in requirements
RUN python -m spacy download en_core_web_sm || true

# Copy app source
COPY . /app

# Create uploads directory
RUN mkdir -p /app/uploads

EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "app:app"]
