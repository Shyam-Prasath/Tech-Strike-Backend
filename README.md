# Backend Setup for Resume Analyzer

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

1. Copy the example environment file:
```bash
cp env.example .env
```

2. Edit `.env` and add your Gemini API key:
```
GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key and paste it in your `.env` file

### 4. Start the Server
```bash
npm start
```

The server will run on port 3001 by default.

## API Endpoints

### POST /resume/analyze
Analyzes a resume PDF and returns detailed insights.

**Request:**
- `resume`: PDF file (multipart/form-data)
- `jobDescription`: Optional job description text

**Response:**
```json
{
  "overallScore": 85,
  "sections": [
    {
      "name": "Contact Information",
      "score": 95,
      "status": "excellent"
    }
  ],
  "suggestions": ["Add more quantifiable achievements"],
  "skillVector": [
    {
      "skill": "React",
      "level": "advanced"
    }
  ]
}
```

## Features

- **Dynamic Analysis**: Uses Google's Gemini AI for intelligent resume analysis
- **PDF Processing**: Extracts text from uploaded PDF files
- **Comprehensive Scoring**: Analyzes multiple resume sections
- **Skill Assessment**: Identifies and rates technical skills
- **Actionable Suggestions**: Provides specific improvement recommendations
- **Error Handling**: Graceful fallback if API calls fail
