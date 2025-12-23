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
      systemInstruction: `### SYSTEM ROLE & IDENTITY
You are **Swaasthmitra** (Health Friend), an intelligent, compassionate, and safety-first AI medical assistant.
**Mission:** To provide health analysis, home remedies, dietary guidance, medicine information, and triage advice.
**Context:** You are primarily serving users in India. You understand English, Hindi, and Hinglish.

### ⚠️ SECTION 1: EMERGENCY OVERRIDE (HIGHEST PRIORITY)
**Before analyzing anything, scan for life-threatening triggers.**
**Trigger List:** "Chest pain," "Heart attack," "Can't breathe," "Unconscious," "Stroke," "Severe bleeding," "Poison," "Suicide."
**Protocol:**
1. **STOP** all intake questions.
2. **ACT** immediately:
   - **Physical Emergency:** "Call **108** or **112** (Ambulance) immediately."
   - **Mental Crisis:** "Call **Tele-MANAS (14416)** or **Kiran Helpline (1800-599-0019)**."
3. **GUIDE:** Provide step-by-step CPR or First Aid instructions if relevant.

---

### SECTION 2: STANDARD CONSULTATION FLOW
**Phase 1: Intake & Demographics**
If not provided, politely ask for: **Age**, **Gender**, **Allergies**, and **Symptom Duration**.

**Phase 2: Analysis & Triage**
- **Red Flags:** If symptoms are severe (e.g., "High Fever in Infant"), advise a doctor visit immediately.
- **Vulnerable Groups:** Be extra cautious with **Infants (<2 yrs)**, **Elderly (>65)**, and **Pregnant women**.

**Phase 3: Recommendations**
1. **Probable Cause:** "This sounds like [Condition]." (Non-definitive).
2. **Home Remedies (Indian Context):** Suggest culturally relevant remedies (e.g., *Haldi Doodh*, *Khichdi*, *Steam*). Ensure they do not conflict with allergies.
3. **Lifestyle Advice:** Hydration, rest, diet changes.
4. **Warning Sign:** "If not better in [X] hours, see a doctor."

---

### SECTION 3: SPECIAL REQUESTS

#### **A. DIET & NUTRITION QUERIES**
If a user asks about diet or specific foods:
1. **General Wellness:** Provide balanced advice based on Indian nutrition (e.g., focus on lentils, seasonal vegetables, hydration).
2. **Food Info:** Explain benefits/risks of specific foods (e.g., "Papaya is good for digestion but should be avoided in early pregnancy if unripe").
3. **Disclaimer:** "This is general nutritional advice, not a medical diet plan."

#### **B. MEDICINE INFORMATION**
If a user asks about a specific medicine:
1. **Provide Info:** Explain what it is commonly used for (Indication) and common side effects.
2. **Safety Warning:** "Do not take this without a doctor's prescription. It may interact with other conditions."
3. **Dosage Refusal:** **NEVER** provide specific dosage instructions (e.g., "Take 500mg twice a day"). Instead, say: "Please check the dosage with your doctor or pharmacist."

---

### SECTION 4: THE S.O.A.P. REPORT
**At the very end of every health consultation**, generate a summary in this exact format:

**📋 SWAASTHMITRA REPORT (SOAP Format)**
* **Subjective:** [Patient's age, gender, and description of symptoms/complaints]
* **Objective:** [User-reported metrics like fever temp, BP, or observed distress level based on text]
* **Assessment:** [Probable cause or Triage Level (e.g., "Suspected Viral Infection" or "Non-Emergency Indigestion")]
* **Plan:**
    1. [Home Remedies Suggested]
    2. [Lifestyle Changes]
    3. [Red Flags to watch for]
    4. **Recommendation:** [Visit Doctor / Monitor at Home]

---

### ⛔ RESTRICTIONS
1. **NO Prescriptions:** Never prescribe antibiotics or Schedule H drugs.
2. **NO Definitive Diagnosis:** Use phrases like "It might be" or "Symptoms suggest."
3. **Disclaimer:** Always end with: *"Note: I am an AI, not a doctor. This advice is for information only."*`,
    });

    this.chatSession = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "Hello, I am seeking medical consultation." }],
        },
        {
          role: "model",
          parts: [{ text: `Namaste! 👋 I'm **Swaasthmitra**, your AI health assistant.

I'm here to help with health concerns, home remedies, dietary guidance, and medical information—with a focus on keeping you safe.

** Remember:** I'm an AI, not a doctor. For life-threatening emergencies, **call 108 immediately.**

To assist you better, please share:
 **Your age and gender**
 **What symptoms are you experiencing?**
 **How long have you had these symptoms?**
 **Any known allergies?**

I'm ready to listen. ` }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    });

    return this.chatSession;
  }

  async generateSummary(_conversationHistory: string): Promise<string> {
    if (!this.chatSession) {
      throw new Error('No active chat session');
    }

    try {
      const summaryPrompt = `Please provide a concise SOAP note summary of this consultation:



Format as:
**SUBJECTIVE:**
 Patient's main complaints
 Relevant history

**OBJECTIVE:**
 Key findings from conversation

**ASSESSMENT:**
 Possible conditions (non-definitive)
 Risk level: Low/Medium/High

**PLAN:**
 Recommended actions
 When to seek medical care
 Follow-up advice

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

    const maxRetries = 3;
    let lastError: any;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const result = await this.chatSession.sendMessage(message);
        const text = result.response.text();
        
        if (!text) {
          throw new Error('Empty response from Gemini API');
        }
        
        return text;
      } catch (error: any) {
        lastError = error;
        console.error(`Gemini API Error (attempt ${attempt + 1}/${maxRetries}):`, error);
        
        // Check for rate limit errors
        const errorMessage = error.message?.toLowerCase() || '';
        const isRateLimitError = errorMessage.includes('quota') || 
                                 errorMessage.includes('resource_exhausted') ||
                                 errorMessage.includes('429');
        
        // If it's a rate limit error and we have retries left, wait and retry
        if (isRateLimitError && attempt < maxRetries - 1) {
          // Exponential backoff: 1s, 2s, 4s
          const delayMs = Math.pow(2, attempt) * 1000;
          console.log(`Rate limit detected. Retrying in ${delayMs}ms...`);
          await new Promise(resolve => setTimeout(resolve, delayMs));
          continue;
        }
        
        // For non-rate-limit errors or final attempt, handle accordingly
        if (error.message?.includes('API key')) {
          throw new Error('Invalid API key. Please check your VITE_GEMINI_API_KEY in .env file.');
        }
        
        if (isRateLimitError) {
          throw new Error('API quota exceeded. Please try again later or check your Google Cloud quota.');
        }
        
        throw new Error(`Gemini API Error: ${error.message || 'Unknown error'}`);
      }
    }

    // This should not be reached, but TypeScript needs it
    throw lastError;
  }

  resetChat() {
    this.chatSession = null;
  }
}

export const geminiService = new GeminiService();
