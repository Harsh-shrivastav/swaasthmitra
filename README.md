# Swaasthmitra Medical Consultation Setup

## 🚀 Quick Setup Guide

### 1. Get Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key" 
4. Copy your API key

### 2. Configure the Application

1. Open `config.js` file
2. Replace the empty API key with your actual key:
   ```javascript
   GEMINI_API_KEY: 'your-actual-api-key-here'
   ```
3. Save the file

### 3. Test the Setup

1. Open `chat.html` in your browser
2. You should see the welcome message from Dr. Swaasthya
3. Click "Start Medical Consultation" to begin

## 🩺 How It Works

### Medical Consultation Flow
1. **Demographics** - Age, gender, basic info
2. **Chief Complaint** - Main health concern
3. **Present Illness** - Duration, severity, progression
4. **Review of Systems** - Associated symptoms
5. **Medical History** - Past conditions, medications, allergies
6. **Social History** - Lifestyle factors
7. **AI Assessment** - Gemini analyzes and generates SOAP note

### SOAP Note Format
- **S (Subjective)** - Patient's reported symptoms and history
- **O (Objective)** - Analysis of provided information
- **A (Assessment)** - Differential diagnosis and clinical impression  
- **P (Plan)** - Recommendations for care and follow-up

## 🔧 Configuration Options

Edit `config.js` to customize:
- `MAX_CONSULTATION_TIME`: Maximum consultation duration
- `EMERGENCY_NUMBER`: Local emergency number
- `TYPING_DELAY`: AI response delay simulation
- `REQUEST_TIMEOUT`: API request timeout

## 🛡️ Privacy & Safety

- All data processed through Google's Gemini API
- No personal health information stored locally
- Appropriate medical disclaimers included
- Emergency protocols for critical symptoms

## 📱 Features

- **Offline-First Architecture** - Basic consultation works without internet
- **Professional Medical Format** - Structured like real doctor visits
- **SOAP Note Generation** - Comprehensive medical documentation
- **Emergency Detection** - Immediate action for critical symptoms
- **Bilingual Support** - Hindi and English (expandable)
- **Mobile Responsive** - Works on all devices

## 🆘 Troubleshooting

### API Key Issues
- Ensure API key is correctly entered in `config.js`
- Check for extra spaces or quotes
- Verify API key is active in Google AI Studio

### No Response from AI
- Check browser console for errors
- Verify internet connection
- Ensure API quota isn't exceeded

### Emergency Mode
- Emergency mode bypasses AI and provides immediate action steps
- Direct call integration to emergency services
- Works even without API configuration

## 📋 Example Consultation

1. **Start**: "I have been having chest pain for 2 days"
2. **Questions**: Age, gender, pain details, associated symptoms
3. **Analysis**: Gemini processes all responses
4. **SOAP Note**: Complete medical assessment with recommendations

## 🔮 Future Enhancements

- Voice input/output
- Multi-language support
- Integration with local health databases
- Appointment scheduling
- Health record management
- Offline AI models

## 📞 Emergency Contacts

- **India Emergency**: 108
- **Police**: 100
- **Fire**: 101
- **Ambulance**: 108

---

**Disclaimer**: This AI consultation tool is for educational and informational purposes only. It does not replace professional medical advice, diagnosis, or treatment. Always consult qualified healthcare providers for medical concerns.

## 🧠 Google GenAI (Optional) Integration

You can use Google's GenAI client server-side to call newer models or streaming endpoints. Follow these steps:

1. Install the official client in your server environment:

```powershell
cd path\to\project
npm install @google/genai mime
```

2. Add environment variables: copy `.env.example` to `.env` and set `GENAI_API_KEY`.

3. Use the helper in `server/genaiClient.ts` from a secure server process (do NOT import it into browser code):

```ts
import { generateContent } from './server/genaiClient';

const contents = [{ parts: [{ text: 'Hello from Swaasthmitra' }] }];
const output = await generateContent('gemini-2.0-flash', contents);
console.log(output);
```

Security note: Never commit your `.env` file or expose API keys to frontend code. Keep all calls that use `GENAI_API_KEY` on the server.