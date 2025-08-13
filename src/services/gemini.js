require('dotenv').config();

const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // Secure usage

async function analyzeResumeWithGemini(resumeText, jobDescription = null) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `
You are a professional resume analyst AI. Evaluate the resume below.

${jobDescription ? `Also consider this job description:\n${jobDescription}` : ''}

Resume Text:
${resumeText}

Respond strictly in JSON format:

{
  "overallScore": number (0-100),
  "sections": [
    {
      "name": "string",
      "score": number,
      "status": "excellent|good|fair|poor"
    }
  ],
  "suggestions": ["string"],
  "skillVector": [
    {
      "skill": "string",
      "level": "beginner|intermediate|advanced|expert"
    }
  ],
  "recommendedCourses": [
    {
      "topic": "string",
      "level": "beginner|intermediate|advanced",
      "reason": "string",
      "platform": "Coursera|Udemy|edX|LinkedIn Learning",
      "link": "string (optional)"
    }
  ],
  "reportSummary": "string"
}

Instructions:
- Focus course recommendations on skills rated 'beginner' or 'intermediate'.
- Ensure the reason justifies the recommendation based on resume gaps.
- Be concise but informative.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    let analysis;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else throw new Error("No valid JSON found");
    } catch (parseError) {
      console.error('Parsing error:', parseError);
      console.log('Raw Gemini output:', text);

      // Fallback structure
      analysis = {
        overallScore: 70,
        sections: [],
        suggestions: ['Parsing failed. Resume may be unclear.'],
        skillVector: [],
        recommendedCourses: [
          {
            topic: "Improve Resume Writing",
            level: "beginner",
            reason: "Fallback due to parsing error.",
            platform: "LinkedIn Learning"
          }
        ],
        reportSummary: "Summary not available due to parsing issues."
      };
    }

    return analysis;

  } catch (error) {
    console.error('Gemini analysis failed:', error);
    return {
      overallScore: 60,
      sections: [],
      suggestions: ['Unable to analyze resume. Please try again later.'],
      skillVector: [],
      recommendedCourses: [
        {
          topic: "Resume Optimization",
          level: "beginner",
          reason: "Gemini API failure.",
          platform: "Coursera"
        }
      ],
      reportSummary: "AI could not process the resume due to technical error."
    };
  }
}

module.exports = { analyzeResumeWithGemini };
