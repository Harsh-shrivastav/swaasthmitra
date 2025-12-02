import axios from 'axios';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

interface GeminiRequest {
  contents: Array<{
    parts: Array<{
      text: string;
    }>;
  }>;
  generationConfig?: {
    temperature?: number;
    topK?: number;
    topP?: number;
    maxOutputTokens?: number;
  };
}

export class GeminiService {
  private apiKey: string;

  constructor() {
    this.apiKey = GEMINI_API_KEY || '';
    if (!this.apiKey) {
      console.warn('Gemini API key not configured');
    }
  }

  async generateContent(prompt: string, config?: GeminiRequest['generationConfig']): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Gemini API key not configured');
    }

    try {
      const response = await axios.post(
        `${GEMINI_API_URL}?key=${this.apiKey}`,
        {
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: config || {
            temperature: 0.3,
            topK: 40,
            topP: 0.8,
            maxOutputTokens: 2048,
          }
        } as GeminiRequest
      );

      if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        return response.data.candidates[0].content.parts[0].text;
      }

      throw new Error('Invalid API response format');
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  }

  async generateMedicalQuestion(context: string, patientData: any): Promise<string> {
    const prompt = `
You are Dr. Swaasthya, an experienced physician conducting a medical consultation.
Current stage: History of Present Illness & Review of Systems.

Patient Demographics: Age ${patientData.demographics.age}, Gender ${patientData.demographics.gender}
Chief Complaint: ${patientData.chiefComplaint}

Conversation History:
${context}

Your task: Generate the NEXT SINGLE most important medical question to ask the patient.
- Use the SOCRATES method (Site, Onset, Character, Radiation, Associations, Time course, Exacerbating/relieving factors, Severity)
- Be conversational but professional
- Ask ONE clear question at a time
- If you have enough information, output "ENOUGH_INFO"

Format: Just the question text, or "ENOUGH_INFO".
    `;

    return this.generateContent(prompt, { temperature: 0.3, maxOutputTokens: 200 });
  }

  async generateSOAPNote(patientSummary: string): Promise<string> {
    const prompt = `
You are an experienced physician providing a medical consultation.
Based on the following patient information, provide a comprehensive SOAP note assessment:

${patientSummary}

IMPORTANT: This is a telemedicine consultation. No physical examination was performed.

Provide the assessment in SOAP note format with:
1. SUBJECTIVE - Patient's reported symptoms and history
2. OBJECTIVE - Analysis of provided information
3. ASSESSMENT - Differential diagnosis with top 3 likely conditions
4. PLAN - Recommendations for care, follow-up, and when to seek immediate attention

Include:
- Risk stratification (Low/Medium/High/Critical)
- Red flags if any
- Specific recommendations
- When to seek emergency care

Format in clear, professional medical language accessible to patients.
    `;

    return this.generateContent(prompt);
  }
}

export const geminiService = new GeminiService();
