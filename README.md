# Swaasthmitra — AI-Powered Healthcare Platform 🚑

🔗 **Live Demo:** [swaasthmitra-2yu8.vercel.app](https://swaasthmitra-2yu8.vercel.app)  
💻 **Source Code:** [GitHub Repository](https://github.com/Harsh-shrivastav/swaasthmitra)

---

## 📖 Overview
**Swaasthmitra** is a comprehensive healthcare platform built with **React, TypeScript**, and powered by **Google Gemini AI**.  
It aims to bring accessible healthcare services to users by offering:

- 🤖 AI-driven medical consultation (chatbot)  
- 👨‍⚕️ Doctor search & appointment booking  
- 🚨 Emergency services info & first-aid guidance  
- 🗺️ Interactive map for nearby healthcare facilities  
- 📂 Personal health record management  

---

## ✨ Features

### 🧠 AI Medical Consultation
- Conversational AI chatbot with Gemini, giving doctor-style responses in markdown  
- Context-aware conversations with chat history  
- Generation of **SOAP-style summaries** (Subjective, Objective, Assessment, Plan)  
- Emergency symptom detection  
- Ability to copy consultation summary  

### 👨‍⚕️ Find Doctors
- Search by name, specialty, or hospital  
- Filter by 12 medical specialties  
- Sort by rating, experience, or consultation fee  
- Detailed doctor profiles (qualifications, languages, availability)  
- Direct appointment booking & calling  
- *(Includes sample data for demo)*  

### 🚨 Emergency Services
- One-tap **“CALL 108”** button for ambulance  
- Quick access to emergency contacts (police, fire, women/child helpline etc.)  
- Guide for 6 critical emergencies with first-aid instructions (CPR, choking, burns, etc.)  
- Symptom identification and response actions  

### 🗺️ Interactive Healthcare Map
- Map with facility locations (hospitals, clinics, pharmacies, ambulances) via **Leaflet + OpenStreetMap**  
- Facility filtering and search  
- GPS location + click-to-zoom + directions support  

### 📅 Appointment Scheduling
- Booking form with patient details, specialty, date/time, reason for visit, notes  
- Form validation and confirmation  

### 📂 Health Records Management
- Dashboard for personal health info (blood group, height/weight, allergies)  
- Tabs for prescriptions, reports, visits with ability to add/edit/delete entries  
- Attachment and download support  
- Quick stats overview  

---

## 🛠️ Tech Stack
- **Frontend:** React 18 + TypeScript (built with Vite)  
- **Styling:** Tailwind CSS v3  
- **Routing:** React Router DOM  
- **AI:** Google Gemini via `@google/generative-ai` + Axios  
- **Storage:** IndexedDB via Dexie.js (local client storage)  
- **Maps:** Leaflet + react-leaflet (OpenStreetMap)  

---

## 🚀 Quick Setup

```bash
# Clone the repository
git clone https://github.com/Harsh-shrivastav/swaasthmitra.git
cd swaasthmitra

# Install dependencies
npm install

# Add your Google Gemini API key
# Update src/services/geminiService.ts with your key

# Start the development server
npm run dev
```
Open **http://localhost:3000** in your browser to access the app.

---

## ⚠️ Important Notice (Medical Disclaimer)

This application is provided for **educational and informational purposes only**.  
It **does not** offer medical advice, diagnosis, or treatment.  
Always consult a **qualified healthcare professional** for real medical concerns.  

In emergencies — **dial 108** (or your local ambulance number).

---

## 🌱 Future Enhancements (Planned)

- 🎙️ **Voice input/output** for consultations  
- 🌐 **Multi-language support** (Hindi, Tamil, Telugu, Bengali)  
- 📱 **Offline/PWA capabilities**  
- 🔐 **User authentication & profiles**  
- 🔔 **Real-time notifications & doctor availability**  
- 📹 **Telemedicine video consultations**  
- 📄 **Prescription upload with OCR**  
- ⏰ **Medicine reminders & vitals tracking** (BP, glucose, weight)  
- 👨‍👩‍👧 **Family health profiles**, lab test booking, pharmacy delivery, insurance integration  

---

## 🤝 Contributing

Contributions are welcome! 🎉  
Follow these steps:

1. **Fork** the repository  
2. **Create a new branch:**
   ```bash
   git checkout -b feature/your-feature
3. Make your changes and commit
4. Push your branch
5. Open a Pull Request for review

## 📄 License

This project is open-source under the MIT License.
