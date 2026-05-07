# AI Receipt Parser

A full-stack web application that allows users to upload receipt images, extract structured receipt data using AI, review/edit the extracted fields, and save corrected receipts.

## Tech Stack

### Frontend

* Next.js 14
* TypeScript
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js
* TypeScript
* SQLite
* Multer
* Google Gemini API

---

# Features

* Upload receipt images (JPG/PNG)
* AI-powered receipt parsing
* Extract merchant, date, line items, and total
* Editable correction flow
* Save corrected receipts
* View saved receipts
* Local SQLite persistence

---

# Setup Instructions

## Backend

```bash
cd backend
npm install
npm run dev
```

Create `.env` file:

```env
PORT=5000
GEMINI_API_KEY=your_api_key
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# API Endpoints

## Upload Receipt

```http
POST /api/receipts/upload
```

## Save Receipt

```http
POST /api/receipts/save
```

## Get Saved Receipts

```http
GET /api/receipts
```

---

# What I Built

I built a full-stack AI-powered receipt parser application that allows users to upload receipt images, extract structured data using Google Gemini, manually correct extraction errors, and save the corrected receipt data locally using SQLite.

The focus of the project was building a practical human-in-the-loop correction workflow rather than relying entirely on AI accuracy.

---

# Biggest Tradeoffs

## 1. SQLite Instead of PostgreSQL

I chose SQLite to keep the setup lightweight and allow the application to run locally with minimal configuration.

## 2. Simpler Confidence Handling

Instead of implementing a full confidence scoring system, I added a user-facing warning and editable correction flow to handle uncertain extractions within the project time constraints.

## 3. Prompt-Based Extraction

I relied on structured prompting with Gemini rather than implementing OCR preprocessing pipelines to optimize for development speed and simplicity.

---

# Where I Used LLMs

* Used Google Gemini API for receipt data extraction
* Used AI-assisted tooling for prompt iteration and debugging
* Implemented response cleanup and JSON validation manually

---

# What I Would Do With Another Week

* Add OCR preprocessing for improved extraction accuracy
* Add confidence scoring per field
* Add receipt image previews
* Add authentication and cloud storage
* Improve responsive UI and accessibility
* Add automated testing

---

# One Thing I Would Push Back On

I would push back on relying entirely on a single LLM response for structured extraction. In production systems, I would likely combine OCR, validation rules, and confidence scoring to improve reliability and reduce hallucinated outputs.
