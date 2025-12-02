import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export class GeminiService {
  private apiKey: string;
  private genAI: GoogleGenerativeAI;
  private chatSession: any = null;

  constructor() {
    this.apiKey = GEMINI_API_KEY || '';
    if (!this.apiKey) {
      console.warn('Gemini API key not configured');
    }
    this.genAI = new GoogleGenerativeAI(this.apiKey);
  }

  initChat() {
    const model = this.genAI.getGenerativeModel({
      model: "gemini-2.5-pro",
    });

    this.chatSession = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: `You are Dr. Swaasthmitra, a professional medical AI assistant. 

CRITICAL RULES:
1. ALWAYS respond in clear, professional medical English
2. FORMAT YOUR RESPONSES using markdown:
   - Use **bold** for KEY POINTS and important information
   - Use bullet points (•) for lists
   - Use proper paragraphs for readability
   - Keep responses CONCISE - match length to question complexity
   - For simple questions: 2-3 sentences
   - For complex symptoms: Structured but brief response

3. DETECT EMERGENCIES: If patient mentions chest pain, difficulty breathing, severe bleeding, stroke symptoms, unconsciousness:
   **🚨 MEDICAL EMERGENCY DETECTED**
   Call 108 immediately

4. STRUCTURE YOUR RESPONSES:
   **Assessment:** Brief analysis
   **Recommendations:** Bullet points
   **Warning Signs:** When to see a doctor
   **Disclaimer:** Brief reminder

5. NEVER PRESCRIBE: Do not recommend specific medicines or dosages
6. NEVER DIAGNOSE: Use "This could indicate...", "Symptoms suggest..."
7. Be empathetic, professional, and BRIEF

Ready to assist patients professionally?` }],
        },
        {
          role: "model",
          parts: [{ text: `Good day. I am **Dr. Swaasthmitra**, an AI medical assistant.

I provide professional medical guidance while emphasizing that I am an AI system, not a replacement for licensed physicians.

**For emergencies, call 108 immediately.**

How may I assist you today? Please describe your symptoms.` }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    });

    return this.chatSession;
  }

  async generateSummary(conversationHistory: string): Promise<string> {
    if (!this.chatSession) {
      throw new Error('No active chat session');
    }

    try {
      const summaryPrompt = `Please provide a concise SOAP note summary of this consultation:

${conversationHistory}

Format as:
**SUBJECTIVE:**
• Patient's main complaints
• Relevant history

**OBJECTIVE:**
• Key findings from conversation

**ASSESSMENT:**
• Possible conditions (non-definitive)
• Risk level: Low/Medium/High

**PLAN:**
• Recommended actions
• When to seek medical care
• Follow-up advice

Keep it professional and brief.`;

      const result = await this.chatSession.sendMessage(summaryPrompt);
      return result.response.text();
    } catch (error) {
      console.error('Summary generation error:', error);
      throw error;
    }
  }

  async sendMessage(message: string): Promise<string> {
    if (!this.chatSession) {
      this.initChat();
    }

    if (!this.apiKey) {
      throw new Error('Gemini API key not configured. Please check your .env file.');
    }

    try {
      const result = await this.chatSession.sendMessage(message);
      const text = result.response.text();
      
      if (!text) {
        throw new Error('Empty response from Gemini API');
      }
      
      return text;
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      
      if (error.message?.includes('API key')) {
        throw new Error('Invalid API key. Please check your VITE_GEMINI_API_KEY in .env file.');
      }
      
      if (error.message?.includes('quota')) {
        throw new Error('API quota exceeded. Please try again later or check your Google Cloud quota.');
      }
      
      throw new Error(`Gemini API Error: ${error.message || 'Unknown error'}`);
    }
  }

  resetChat() {
    this.chatSession = null;
  }
}

export const geminiService = new GeminiService();
