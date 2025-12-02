// Swaasthmitra - JavaScript Functionality

// Global State
let isOfflineMode = false;
let currentLanguage = 'en';
let isListening = false;
let messages = [
    {
        id: '1',
        role: 'bot',
        text: 'Namaste! I am your Swaasthya Sahayak. How can I help you today?',
        timestamp: new Date()
    }
];

// Symptom Triage Logic
const symptomTriage = {
    critical: [
        'chest pain', 'heart attack', 'stroke', 'seizure', 'unconscious', 
        'breathing difficulty', 'severe bleeding', 'suicide'
    ],
    high: [
        'high fever', 'severe pain', 'broken bone', 'deep cut', 
        'severe burn', 'poisoning', 'allergic reaction'
    ],
    medium: [
        'fever', 'cough', 'headache', 'stomach pain', 'diarrhea', 
        'vomiting', 'rash', 'cold'
    ]
};

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeTabs();
    initializeChat();
    initializeDemo();
    initializeSchedule();
});

// Navigation
function initializeNavigation() {
    const menuButton = document.getElementById('menuButton');
    const navMobile = document.getElementById('navMobile');
    
    if (menuButton && navMobile) {
        menuButton.addEventListener('click', function() {
            navMobile.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking links
    const mobileLinks = document.querySelectorAll('.nav-link-mobile');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMobile.classList.remove('active');
        });
    });
}

// Tab System
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and tabs
            document.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Add active class to clicked button and corresponding tab
            this.classList.add('active');
            document.getElementById(tabName + 'Tab').classList.add('active');
        });
    });
}

// Chat Functionality
function initializeChat() {
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');
    const micButton = document.getElementById('micButton');
    const langButtons = document.querySelectorAll('.lang-button');
    
    // Send message on button click
    if (sendButton) {
        sendButton.addEventListener('click', function() {
            const message = chatInput.value.trim();
            if (message) {
                sendMessage(message);
                chatInput.value = '';
            }
        });
    }
    
    // Send message on Enter key
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const message = chatInput.value.trim();
                if (message) {
                    sendMessage(message);
                    chatInput.value = '';
                }
            }
        });
    }
    
    // Mic button
    if (micButton) {
        micButton.addEventListener('click', function() {
            toggleVoiceInput();
        });
    }
    
    // Language toggle
    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            setLanguage(lang);
            
            // Update active state
            langButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Send Message Function
function sendMessage(text) {
    // Add user message
    const userMessage = {
        id: Date.now().toString(),
        role: 'user',
        text: text,
        timestamp: new Date()
    };
    
    addMessageToChat(userMessage);
    
    // Simulate bot response
    setTimeout(() => {
        const botResponse = getBotResponse(text);
        addMessageToChat(botResponse);
    }, 800);
}

// Get Bot Response
function getBotResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    let severity = 'low';
    let responseText = '';
    
    // Check for critical symptoms
    if (symptomTriage.critical.some(symptom => lowerMessage.includes(symptom))) {
        severity = 'critical';
        responseText = currentLanguage === 'en'
            ? '🚨 RED ALERT: This requires immediate emergency medical attention. CALL 108 NOW. Do not wait.'
            : '🚨 लाल अलर्ट: इसके लिए तुरंत आपातकालीन चिकित्सा सहायता की आवश्यकता है। अभी 108 पर कॉल करें।';
    }
    // Check for high priority symptoms
    else if (symptomTriage.high.some(symptom => lowerMessage.includes(symptom))) {
        severity = 'high';
        responseText = currentLanguage === 'en'
            ? 'This requires urgent medical evaluation today. Please visit the nearest health center. In the meantime, rest and stay hydrated.'
            : 'इसके लिए आज चिकित्सा मूल्यांकन की आवश्यकता है। कृपया निकटतम स्वास्थ्य केंद्र जाएं।';
    }
    // Check for medium priority symptoms
    else if (symptomTriage.medium.some(symptom => lowerMessage.includes(symptom))) {
        severity = 'medium';
        
        if (lowerMessage.includes('fever')) {
            responseText = currentLanguage === 'en'
                ? 'For fever: Rest, drink plenty of water (2-3 liters daily), take paracetamol if available. Monitor temperature. If fever exceeds 103°F or persists beyond 3 days, seek medical attention.'
                : 'बुखार के लिए: आराम करें, खूब पानी पिएं (रोज 2-3 लीटर), पैरासिटामोल लें। तापमान देखें। अगर बुखार 103°F से अधिक है या 3 दिन से ज्यादा रहता है, चिकित्सा सहायता लें।';
        } else if (lowerMessage.includes('cough')) {
            responseText = currentLanguage === 'en'
                ? 'For cough: Stay hydrated, drink warm liquids, avoid cold foods. Rest your voice. If cough persists for more than a week or you have difficulty breathing, visit a health center.'
                : 'खांसी के लिए: खूब पानी पिएं, गर्म तरल पदार्थ लें, ठंडा खाना न खाएं। अगर खांसी एक हफ्ते से ज्यादा रहती है, स्वास्थ्य केंद्र जाएं।';
        } else if (lowerMessage.includes('headache')) {
            responseText = currentLanguage === 'en'
                ? 'For headache: Rest in a dark, quiet room. Stay hydrated. Take paracetamol if available. Apply cold compress to temples. If severe or with vision changes, seek immediate help.'
                : 'सिरदर्द के लिए: अंधेरे, शांत कमरे में आराम करें। पानी पिएं। पैरासिटामोल लें। अगर गंभीर है या दृष्टि बदल रही है, तुरंत सहायता लें।';
        } else {
            responseText = currentLanguage === 'en'
                ? 'Monitor your symptoms for 48 hours. Rest, stay hydrated, and eat light foods. If symptoms worsen or persist, please visit your nearest ASHA worker or health center.'
                : '48 घंटे के लिए अपने लक्षणों की निगरानी करें। आराम करें, पानी पिएं। अगर लक्षण बिगड़ते हैं, ASHA कार्यकर्ता या स्वास्थ्य केंद्र जाएं।';
        }
    }
    // Pregnancy-related
    else if (lowerMessage.includes('pregnancy') || lowerMessage.includes('pregnant')) {
        severity = 'medium';
        responseText = currentLanguage === 'en'
            ? 'For pregnancy care: Regular checkups are essential. Eat nutritious food, take prescribed vitamins, avoid alcohol/smoking. Contact your ASHA worker for antenatal care schedule.'
            : 'गर्भावस्था देखभाल के लिए: नियमित जांच जरूरी है। पौष्टिक भोजन खाएं, विटामिन लें। अपने ASHA कार्यकर्ता से संपर्क करें।';
    }
    // Default response
    else {
        responseText = currentLanguage === 'en'
            ? 'I understand your concern. For a detailed evaluation, please describe your symptoms in more detail or visit your nearest ASHA worker or health center.'
            : 'मैं आपकी चिंता समझता हूं। विस्तृत मूल्यांकन के लिए, कृपया अपने ASHA कार्यकर्ता या स्वास्थ्य केंद्र से मिलें।';
    }
    
    return {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: responseText,
        timestamp: new Date(),
        severity: severity
    };
}

// Add Message to Chat
function addMessageToChat(message) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${message.role}`;
    
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';
    
    if (message.severity === 'critical') {
        bubbleDiv.classList.add('critical');
    }
    
    bubbleDiv.textContent = message.text;
    messageDiv.appendChild(bubbleDiv);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    updateScroll(chatMessages);
    
    // Store message
    messages.push(message);
}

// Utility: scroll chat to bottom
function updateScroll(chatBox) {
    const box = chatBox || document.getElementById('chatMessages');
    if (!box) return;
    box.scrollTop = box.scrollHeight;
}

// Voice Input Toggle
function toggleVoiceInput() {
    const micButton = document.getElementById('micButton');
    const chatInput = document.getElementById('chatInput');
    
    isListening = !isListening;
    
    if (isListening) {
        micButton.classList.add('listening');
        
        // Simulate voice input after 1.5 seconds
        setTimeout(() => {
            const demoInput = currentLanguage === 'en' ? 'I have fever' : 'मुझे बुखार है';
            chatInput.value = demoInput;
            sendMessage(demoInput);
            chatInput.value = '';
            isListening = false;
            micButton.classList.remove('listening');
        }, 1500);
    } else {
        micButton.classList.remove('listening');
    }
}

// Set Language
function setLanguage(lang) {
    currentLanguage = lang;
    const chatInput = document.getElementById('chatInput');
    
    if (chatInput) {
        chatInput.placeholder = lang === 'en' ? 'Describe symptoms...' : 'लक्षण बताएं...';
    }
}

// Demo Controls
function initializeDemo() {
    const offlineToggle = document.getElementById('offlineToggle');
    const scenarioButtons = document.querySelectorAll('.scenario-btn');
    
    // Offline toggle
    if (offlineToggle) {
        offlineToggle.addEventListener('click', function() {
            isOfflineMode = !isOfflineMode;
            updateOfflineStatus();
        });
    }
    
    // Scenario buttons
    scenarioButtons.forEach(button => {
        button.addEventListener('click', function() {
            const message = this.getAttribute('data-message');
            const chatInput = document.getElementById('chatInput');
            if (chatInput) {
                chatInput.value = message;
                sendMessage(message);
                chatInput.value = '';
            }
            
            // Switch to chat tab
            document.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.querySelector('[data-tab="chat"]').classList.add('active');
            document.getElementById('chatTab').classList.add('active');
        });
    });
}

// Update Offline Status
function updateOfflineStatus() {
    const offlineToggle = document.getElementById('offlineToggle');
    const wifiIcon = document.getElementById('wifiIcon');
    const offlineNotice = document.getElementById('offlineNotice');
    
    if (offlineToggle) {
        if (isOfflineMode) {
            offlineToggle.textContent = 'Offline Mode ON';
            offlineToggle.classList.add('offline');
            
            if (wifiIcon) {
                wifiIcon.classList.add('offline');
                wifiIcon.innerHTML = `
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                    <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path>
                    <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path>
                    <path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path>
                    <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path>
                    <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
                    <line x1="12" y1="20" x2="12.01" y2="20"></line>
                `;
            }
            
            if (offlineNotice) {
                offlineNotice.innerHTML = `
                    <svg class="notice-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                        <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path>
                        <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path>
                    </svg>
                    <span class="notice-text">Offline mode: Data saved locally, will sync when online</span>
                `;
            }
        } else {
            offlineToggle.textContent = 'Online Mode ON';
            offlineToggle.classList.remove('offline');
            
            if (wifiIcon) {
                wifiIcon.classList.remove('offline');
                wifiIcon.innerHTML = `
                    <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
                    <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
                    <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
                    <line x1="12" y1="20" x2="12.01" y2="20"></line>
                `;
            }
            
            if (offlineNotice) {
                offlineNotice.innerHTML = `
                    <svg class="notice-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
                        <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
                        <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
                        <line x1="12" y1="20" x2="12.01" y2="20"></line>
                    </svg>
                    <span class="notice-text">Online: Data synced in real-time</span>
                `;
            }
        }
    }
}

// Schedule Form
function initializeSchedule() {
    const scheduleButton = document.getElementById('scheduleButton');
    
    if (scheduleButton) {
        scheduleButton.addEventListener('click', function() {
            const patientName = document.getElementById('patientName').value.trim();
            const vaccineType = document.getElementById('vaccineType').value;
            
            if (patientName && vaccineType) {
                const offlineMsg = isOfflineMode ? ' (saved offline, will sync when online)' : '';
                alert(`Appointment scheduled for ${patientName} - ${vaccineType}${offlineMsg}`);
                
                // Clear form
                document.getElementById('patientName').value = '';
                document.getElementById('vaccineType').value = '';
            } else {
                alert('Please fill in all fields');
            }
        });
    }
}

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Initialize chat with first message
window.addEventListener('load', function() {
    const firstMessage = {
        id: '1',
        role: 'bot',
        text: currentLanguage === 'en' 
            ? 'Namaste! I am your Swaasthya Sahayak. How can I help you today?'
            : 'नमस्ते! मैं आपका स्वास्थ्य सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?',
        timestamp: new Date()
    };
    
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages && chatMessages.children.length === 0) {
        addMessageToChat(firstMessage);
    }
});
