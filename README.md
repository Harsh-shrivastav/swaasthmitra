# 🏥 Swaasthmitra - AI-Powered Healthcare Platform

A comprehensive healthcare platform built with React, TypeScript, and Google Gemini AI, providing accessible medical consultation, doctor search, emergency services, and health record management.

## ✨ Features

### 🤖 AI Medical Consultation
- Conversational AI chatbot powered by Google Gemini 2.5 Pro
- Professional doctor-style responses with markdown formatting
- Context-aware medical conversations with chat history
- SOAP note summary generation (Subjective, Objective, Assessment, Plan)
- Emergency symptom detection
- Copy consultation summaries to clipboard

### 👨‍⚕️ Find Doctors
- Search doctors by name, specialty, or hospital
- Filter by 12 medical specialties
- Sort by rating, experience, or consultation fee
- Detailed doctor profiles with qualifications, languages, and availability
- Direct appointment booking and call functionality
- 6 sample doctors with comprehensive information

### 🚨 Emergency Services
- One-tap emergency call to 108 (Ambulance)
- Quick access to emergency numbers (Police, Fire, Women/Child Helplines)
- Recognition guide for 6 critical medical emergencies
- Symptom identification and first response actions
- Basic first aid tutorials (CPR, Choking, Burns)
- Color-coded emergency categories

### 🗺️ Interactive Healthcare Map
- Leaflet-based interactive map with OpenStreetMap
- Real-time healthcare facility locations
- Custom markers for hospitals, clinics, pharmacies, ambulances
- Facility filtering and search
- GPS location tracking
- Click-to-zoom and Google Maps directions integration

### 📅 Appointment Scheduling
- Comprehensive booking form with patient details
- Specialty selection from 12 medical fields
- Date and time slot selection
- Reason for visit and additional notes
- Form validation and confirmation

### 📋 Health Records Management
- Personal health information dashboard
- Blood group, height, weight, allergies tracking
- Tabbed record filtering (All, Prescriptions, Reports, Visits)
- Sample records with attachments and download functionality
- Quick stats overview
- Add/edit/delete record capabilities

## 🚀 Quick Setup Guide

### Prerequisites
- Node.js 18+ and npm
- Google Gemini API Key

### 1. Get Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key" 
4. Copy your API key

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/Harsh-shrivastav/swaasthmitra.git

# Navigate to project directory
cd swaasthmitra

# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. Configure API Key

1. Open `src/services/geminiService.ts`
2. Replace the API key in the configuration:
   ```typescript
   const genAI = new GoogleGenerativeAI('your-api-key-here');
   ```
3. Save the file

### 4. Access the Application

Open your browser and navigate to `http://localhost:3000` (or the port shown in terminal)

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS v3** - Utility-first styling
- **React Router DOM** - Client-side routing

### Maps & Location
- **Leaflet 1.9.4** - Interactive maps
- **react-leaflet 5.0.0** - React wrapper for Leaflet
- **OpenStreetMap** - Map tile provider

### AI & Services
- **@google/generative-ai** - Google Gemini API integration
- **Axios** - HTTP client
- **react-markdown** - Markdown rendering for chat responses

### Database & Storage
- **Dexie.js** - IndexedDB wrapper for local storage

### Icons & UI
- **React Icons** - Comprehensive icon library

## 🏗️ Project Structure

```
swaasthmitra/
├── src/
│   ├── components/
│   │   ├── Header.tsx           # Navigation header
│   │   └── ScrollToTop.tsx      # Auto-scroll on route change
│   ├── pages/
│   │   ├── LandingPage.tsx      # Hero & features showcase
│   │   ├── HomePage.tsx         # Main dashboard with 6 feature cards
│   │   ├── ConsultationPage.tsx # AI chatbot interface
│   │   ├── DoctorsPage.tsx      # Doctor search & profiles
│   │   ├── EmergencyPage.tsx    # Emergency contacts & first aid
│   │   ├── RecordsPage.tsx      # Health records management
│   │   ├── SchedulePage.tsx     # Appointment booking
│   │   └── MapPage.tsx          # Interactive healthcare map
│   ├── services/
│   │   ├── geminiService.ts     # Gemini AI API integration
│   │   └── database.ts          # Dexie IndexedDB wrapper
│   ├── context/
│   │   └── ConsultationContext.tsx
│   ├── App.tsx                  # Main app with routing
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles
├── public/                      # Static assets
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── vite.config.ts               # Vite config
├── tailwind.config.js           # Tailwind CSS config
└── postcss.config.js            # PostCSS config
```

## 🔧 Configuration

### Gemini AI Settings
Located in `src/services/geminiService.ts`:
- **Model**: gemini-2.5-pro
- **Temperature**: 0.7 (balanced creativity/accuracy)
- **Max Tokens**: 2048
- **Safety Settings**: Default (blocks harmful content)

### Map Configuration
Located in `src/pages/MapPage.tsx`:
- **Default Center**: [28.6139, 77.2090] (Delhi)
- **Default Zoom**: 12
- **Tile Layer**: OpenStreetMap
- **Marker Types**: Hospitals, Clinics, Pharmacies, Ambulances

## 🔐 Privacy & Security

- All AI conversations processed through Google's Gemini API
- No personal health information stored on external servers
- Local IndexedDB for client-side health record storage
- Appropriate medical disclaimers on all pages
- Emergency protocols for critical symptoms
- HTTPS recommended for production deployment

## 📱 Responsive Design

- Fully responsive layout for mobile, tablet, and desktop
- Touch-friendly interface elements
- Optimized map interactions for mobile devices
- Accessible color schemes and contrast ratios

## 🆘 Troubleshooting

### API Key Issues
- Ensure API key is correctly entered in `src/services/geminiService.ts`
- Check for extra spaces or quotes in the key string
- Verify API key is active in Google AI Studio
- Check API quota and billing status

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

### Map Not Loading
- Check internet connection (OpenStreetMap requires online access)
- Verify Leaflet CSS is imported in `index.css`
- Check browser console for tile loading errors

### AI Not Responding
- Verify Gemini API key is configured
- Check browser console for API errors
- Ensure model name is correct (gemini-2.5-pro)
- Check API quota limits

## 📖 Usage Examples

### AI Consultation Flow
1. Navigate to "Online Consultation"
2. Start conversation: "I have been experiencing headaches for 3 days"
3. AI asks follow-up questions about severity, location, triggers
4. Provide detailed responses
5. Click "Generate Summary" for SOAP note
6. Copy summary or start new consultation

### Finding Doctors
1. Go to "Find Doctors"
2. Search by name, specialty, or hospital
3. Filter by specialty (e.g., Cardiologist)
4. Sort by rating, experience, or fee
5. Click "Book Appointment" to schedule
6. Use phone icon for direct calling

### Emergency Response
1. Access "Emergency Services"
2. Large "CALL 108" button for immediate ambulance
3. Browse emergency conditions and symptoms
4. Follow first aid instructions
5. Quick access to all emergency numbers

## 🔮 Future Enhancements

- [ ] Voice input/output for consultations
- [ ] Multi-language support (Hindi, Tamil, Telugu, Bengali)
- [ ] Offline PWA capabilities with service workers
- [ ] User authentication and profiles
- [ ] Integration with actual hospital databases
- [ ] Real-time doctor availability
- [ ] Telemedicine video consultations
- [ ] Prescription upload and OCR
- [ ] Medicine reminder notifications
- [ ] Health vitals tracking (BP, glucose, weight)
- [ ] Family health profiles
- [ ] Insurance integration
- [ ] Lab test booking
- [ ] Pharmacy medicine delivery

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Developer

**Harsh Shrivastav**
- GitHub: [@Harsh-shrivastav](https://github.com/Harsh-shrivastav)

## 📞 Emergency Contacts (India)

- **Medical Emergency / Ambulance**: 108
- **Police**: 100
- **Fire**: 101
- **Women Helpline**: 1091
- **Child Helpline**: 1098
- **Disaster Management**: 108

## 🙏 Acknowledgments

- Google Gemini AI for conversational AI capabilities
- OpenStreetMap contributors for map tiles
- Leaflet.js for interactive mapping
- React and TypeScript communities

---

## ⚠️ Medical Disclaimer

**IMPORTANT**: This application is for **educational and informational purposes only**. It does NOT provide medical advice, diagnosis, or treatment. 

- Always consult qualified healthcare professionals for medical concerns
- In case of emergency, call 108 immediately
- Do not rely solely on AI-generated medical information
- This tool cannot replace in-person medical examination
- AI responses may contain errors or incomplete information

**By using this application, you acknowledge that:**
- You understand the limitations of AI medical consultation
- You will seek professional medical care when needed
- The developers are not liable for any health outcomes
- This is a demonstration project, not a certified medical device

## 📊 Project Status

✅ **Completed Features:**
- AI Medical Consultation with SOAP notes
- Doctor Search and Profiles
- Emergency Services Information
- Interactive Healthcare Map
- Appointment Scheduling
- Health Records Management
- Responsive Design
- Scroll-to-Top Navigation

🚧 **In Development:**
- User Authentication
- Real-time Notifications
- Multi-language Support

---

**Made with ❤️ for accessible healthcare**