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

// Enhanced Send Message Function
function sendMessage(text) {
    if (!text.trim()) return;
    
    // Add user message
    const userMessage = {
        id: Date.now().toString(),
        role: 'user',
        text: text,
        timestamp: new Date()
    };
    
    addMessageToChat(userMessage);
    
    // Show typing indicator
    showTypingIndicator();
    
    // Simulate processing time based on message complexity
    const processingTime = text.length > 50 ? 2000 : 1500;
    
    setTimeout(() => {
        hideTypingIndicator();
        const botResponse = getBotResponse(text);
        addMessageToChat(botResponse);
        
        // Add follow-up questions if available
        if (botResponse.followUpQuestions && botResponse.followUpQuestions.length > 0) {
            setTimeout(() => {
                showFollowUpButtons(botResponse.followUpQuestions);
            }, 500);
        }
    }, processingTime);
}

// Show/Hide Typing Indicator
function showTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.style.display = 'block';
        
        // Scroll to bottom
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.style.display = 'none';
    }
}

// Show Follow-up Questions
function showFollowUpButtons(questions) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages || !questions.length) return;
    
    const followUpDiv = document.createElement('div');
    followUpDiv.className = 'follow-up-questions';
    followUpDiv.innerHTML = `
        <div class="follow-up-header">Quick responses:</div>
        <div class="follow-up-buttons">
            ${questions.map(question => 
                `<button class="follow-up-btn" onclick="sendMessage('${question}')">${question}</button>`
            ).join('')}
        </div>
    `;
    
    chatMessages.appendChild(followUpDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Medical Consultation System - Like Doctronic.ai
const medicalConsultation = {
    currentStep: 'greeting',
    currentQuestionIndex: 0,
    patientInfo: {
        age: null,
        gender: null,
        primarySymptom: null,
        duration: null,
        severity: null,
        additionalSymptoms: [],
        answers: {}
    },
    questionnaire: [],
    isInProgress: false
};

// Medical Questionnaire Database
const medicalQuestionnaireSystem = {
    // Step 1: Basic Information
    basicInfo: [
        {
            id: 'age',
            question: 'What is your age?',
            type: 'number',
            options: ['Under 18', '18-25', '26-40', '41-60', 'Over 60'],
            required: true
        },
        {
            id: 'gender',
            question: 'What is your gender?',
            type: 'choice',
            options: ['Male', 'Female', 'Other'],
            required: true
        }
    ],

    // Step 2: Primary Symptom Assessment
    primarySymptom: [
        {
            id: 'main_complaint',
            question: 'What is your main health concern today?',
            type: 'text',
            required: true
        },
        {
            id: 'duration',
            question: 'How long have you been experiencing this?',
            type: 'choice',
            options: ['Less than 1 day', '1-3 days', '4-7 days', '1-4 weeks', 'More than 1 month'],
            required: true
        }
    ],

    // Step 3: Symptom-specific questions
    symptomQuestions: {
        'fever': [
            {
                id: 'fever_temp',
                question: 'What is your current temperature (if measured)?',
                type: 'choice',
                options: ['Below 100°F (37.8°C)', '100-102°F (37.8-38.9°C)', '102-104°F (38.9-40°C)', 'Above 104°F (40°C)', 'Not measured'],
                required: true
            },
            {
                id: 'fever_pattern',
                question: 'How would you describe the fever pattern?',
                type: 'choice',
                options: ['Continuous high fever', 'Comes and goes', 'Only at night', 'Only during day', 'Getting worse'],
                required: true
            },
            {
                id: 'associated_symptoms',
                question: 'Do you have any of these symptoms along with fever?',
                type: 'multiple',
                options: ['Headache', 'Body ache', 'Chills', 'Nausea/Vomiting', 'Cough', 'Sore throat', 'Difficulty breathing'],
                required: false
            }
        ],
        'headache': [
            {
                id: 'headache_location',
                question: 'Where is your headache located?',
                type: 'choice',
                options: ['Front of head', 'Back of head', 'Sides (temples)', 'Top of head', 'Entire head'],
                required: true
            },
            {
                id: 'headache_severity',
                question: 'On a scale of 1-10, how severe is your headache?',
                type: 'choice',
                options: ['1-2 (Mild)', '3-4 (Mild-Moderate)', '5-6 (Moderate)', '7-8 (Severe)', '9-10 (Extremely severe)'],
                required: true
            },
            {
                id: 'headache_type',
                question: 'How would you describe the pain?',
                type: 'choice',
                options: ['Throbbing/Pulsating', 'Sharp/Stabbing', 'Dull/Aching', 'Pressure/Squeezing', 'Burning'],
                required: true
            },
            {
                id: 'headache_triggers',
                question: 'Do you have any of these symptoms with your headache?',
                type: 'multiple',
                options: ['Nausea', 'Vomiting', 'Light sensitivity', 'Sound sensitivity', 'Dizziness', 'Blurred vision', 'Neck stiffness'],
                required: false
            }
        ],
        'chest_pain': [
            {
                id: 'chest_location',
                question: 'Where exactly is the chest pain located?',
                type: 'choice',
                options: ['Center of chest', 'Left side', 'Right side', 'Upper chest', 'Lower chest'],
                required: true
            },
            {
                id: 'chest_severity',
                question: 'How severe is the pain (1-10)?',
                type: 'choice',
                options: ['1-2 (Mild)', '3-4 (Mild-Moderate)', '5-6 (Moderate)', '7-8 (Severe)', '9-10 (Extremely severe)'],
                required: true
            },
            {
                id: 'chest_nature',
                question: 'How would you describe the pain?',
                type: 'choice',
                options: ['Sharp/Stabbing', 'Crushing/Squeezing', 'Burning', 'Aching', 'Pressure'],
                required: true
            },
            {
                id: 'chest_symptoms',
                question: 'Do you have any of these symptoms with chest pain?',
                type: 'multiple',
                options: ['Difficulty breathing', 'Sweating', 'Nausea', 'Dizziness', 'Arm pain', 'Jaw pain', 'Back pain'],
                required: true
            }
        ],
        'stomach_pain': [
            {
                id: 'stomach_location',
                question: 'Where is the stomach pain located?',
                type: 'choice',
                options: ['Upper abdomen', 'Lower abdomen', 'Right side', 'Left side', 'Around navel', 'Entire abdomen'],
                required: true
            },
            {
                id: 'stomach_severity',
                question: 'How severe is the pain (1-10)?',
                type: 'choice',
                options: ['1-2 (Mild)', '3-4 (Mild-Moderate)', '5-6 (Moderate)', '7-8 (Severe)', '9-10 (Extremely severe)'],
                required: true
            },
            {
                id: 'stomach_symptoms',
                question: 'Do you have any of these symptoms?',
                type: 'multiple',
                options: ['Nausea', 'Vomiting', 'Diarrhea', 'Constipation', 'Bloating', 'Loss of appetite', 'Fever'],
                required: false
            }
        ]
    },

    // Step 4: General health questions
    generalQuestions: [
        {
            id: 'medical_history',
            question: 'Do you have any existing medical conditions?',
            type: 'multiple',
            options: ['Diabetes', 'High blood pressure', 'Heart disease', 'Asthma', 'Kidney disease', 'Liver disease', 'None of these'],
            required: false
        },
        {
            id: 'medications',
            question: 'Are you currently taking any medications?',
            type: 'choice',
            options: ['Yes, regular medications', 'Yes, occasional medications', 'No medications', 'Prefer not to say'],
            required: false
        },
        {
            id: 'recent_changes',
            question: 'Have you noticed any recent changes in your health?',
            type: 'multiple',
            options: ['Weight loss', 'Weight gain', 'Changes in appetite', 'Sleep problems', 'Fatigue', 'Mood changes', 'None'],
            required: false
        }
    ]
};

// Medical Questionnaire Controller - Like Doctronic.ai
function startMedicalConsultation() {
    medicalConsultation.isInProgress = true;
    medicalConsultation.currentStep = 'basic_info';
    medicalConsultation.currentQuestionIndex = 0;
    
    // Start with first basic info question
    askNextQuestion();
}

function askNextQuestion() {
    let currentQuestion = null;
    
    switch(medicalConsultation.currentStep) {
        case 'basic_info':
            if (medicalConsultation.currentQuestionIndex < medicalQuestionnaireSystem.basicInfo.length) {
                currentQuestion = medicalQuestionnaireSystem.basicInfo[medicalConsultation.currentQuestionIndex];
            } else {
                // Move to primary symptom questions
                medicalConsultation.currentStep = 'primary_symptom';
                medicalConsultation.currentQuestionIndex = 0;
                currentQuestion = medicalQuestionnaireSystem.primarySymptom[0];
            }
            break;
            
        case 'primary_symptom':
            if (medicalConsultation.currentQuestionIndex < medicalQuestionnaireSystem.primarySymptom.length) {
                currentQuestion = medicalQuestionnaireSystem.primarySymptom[medicalConsultation.currentQuestionIndex];
            } else {
                // Move to symptom-specific questions based on primary complaint
                const primaryComplaint = medicalConsultation.patientInfo.answers['main_complaint'];
                const symptomKey = detectSymptomCategory(primaryComplaint);
                
                if (symptomKey && medicalQuestionnaireSystem.symptomQuestions[symptomKey]) {
                    medicalConsultation.currentStep = 'symptom_specific';
                    medicalConsultation.currentQuestionIndex = 0;
                    medicalConsultation.questionnaire = medicalQuestionnaireSystem.symptomQuestions[symptomKey];
                    currentQuestion = medicalConsultation.questionnaire[0];
                } else {
                    // Move to general questions
                    medicalConsultation.currentStep = 'general';
                    medicalConsultation.currentQuestionIndex = 0;
                    currentQuestion = medicalQuestionnaireSystem.generalQuestions[0];
                }
            }
            break;
            
        case 'symptom_specific':
            if (medicalConsultation.currentQuestionIndex < medicalConsultation.questionnaire.length) {
                currentQuestion = medicalConsultation.questionnaire[medicalConsultation.currentQuestionIndex];
            } else {
                // Move to general questions
                medicalConsultation.currentStep = 'general';
                medicalConsultation.currentQuestionIndex = 0;
                currentQuestion = medicalQuestionnaireSystem.generalQuestions[0];
            }
            break;
            
        case 'general':
            if (medicalConsultation.currentQuestionIndex < medicalQuestionnaireSystem.generalQuestions.length) {
                currentQuestion = medicalQuestionnaireSystem.generalQuestions[medicalConsultation.currentQuestionIndex];
            } else {
                // Assessment complete - generate final diagnosis
                generateFinalAssessment();
                return;
            }
            break;
    }
    
    if (currentQuestion) {
        displayQuestion(currentQuestion);
    }
}

function detectSymptomCategory(complaint) {
    const lower = complaint.toLowerCase();
    
    if (lower.includes('fever') || lower.includes('temperature') || lower.includes('hot')) {
        return 'fever';
    } else if (lower.includes('headache') || lower.includes('head pain') || lower.includes('migraine')) {
        return 'headache';
    } else if (lower.includes('chest pain') || lower.includes('heart') || lower.includes('breathing')) {
        return 'chest_pain';
    } else if (lower.includes('stomach') || lower.includes('abdom') || lower.includes('belly') || lower.includes('nausea')) {
        return 'stomach_pain';
    }
    
    return null;
}

function displayQuestion(questionObj) {
    let questionHTML = `<div class="medical-question">`;
    questionHTML += `<div class="question-header">`;
    questionHTML += `<div class="question-progress">Question ${getQuestionNumber()} of ${getTotalQuestions()}</div>`;
    questionHTML += `</div>`;
    questionHTML += `<div class="question-text">${questionObj.question}</div>`;
    
    if (questionObj.type === 'choice') {
        questionHTML += `<div class="question-options">`;
        questionObj.options.forEach((option, index) => {
            questionHTML += `<button class="option-btn" onclick="selectAnswer('${questionObj.id}', '${option}')" data-value="${option}">`;
            questionHTML += option;
            questionHTML += `</button>`;
        });
        questionHTML += `</div>`;
    } else if (questionObj.type === 'multiple') {
        questionHTML += `<div class="question-options multiple-choice">`;
        questionObj.options.forEach((option, index) => {
            questionHTML += `<label class="checkbox-option">`;
            questionHTML += `<input type="checkbox" value="${option}" onchange="updateMultipleAnswer('${questionObj.id}', '${option}', this.checked)">`;
            questionHTML += `<span class="checkmark"></span>`;
            questionHTML += option;
            questionHTML += `</label>`;
        });
        questionHTML += `</div>`;
        questionHTML += `<button class="next-btn" onclick="proceedToNext()" style="margin-top: 1rem;">Continue</button>`;
    } else if (questionObj.type === 'text') {
        questionHTML += `<div class="question-input">`;
        questionHTML += `<textarea class="text-input" id="textAnswer_${questionObj.id}" placeholder="Please describe your symptoms in detail..." rows="4"></textarea>`;
        questionHTML += `<button class="next-btn" onclick="submitTextAnswer('${questionObj.id}')">Continue</button>`;
        questionHTML += `</div>`;
    }
    
    questionHTML += `</div>`;
    
    const botMessage = {
        id: Date.now().toString(),
        role: 'bot',
        text: questionHTML,
        timestamp: new Date(),
        isQuestion: true
    };
    
    addMessageToChat(botMessage);
}

function selectAnswer(questionId, answer) {
    medicalConsultation.patientInfo.answers[questionId] = answer;
    
    // Visual feedback
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(btn => btn.classList.remove('selected'));
    event.target.classList.add('selected');
    
    // Auto-proceed after selection
    setTimeout(() => {
        proceedToNext();
    }, 500);
}

function updateMultipleAnswer(questionId, option, isChecked) {
    if (!medicalConsultation.patientInfo.answers[questionId]) {
        medicalConsultation.patientInfo.answers[questionId] = [];
    }
    
    if (isChecked) {
        if (!medicalConsultation.patientInfo.answers[questionId].includes(option)) {
            medicalConsultation.patientInfo.answers[questionId].push(option);
        }
    } else {
        const index = medicalConsultation.patientInfo.answers[questionId].indexOf(option);
        if (index > -1) {
            medicalConsultation.patientInfo.answers[questionId].splice(index, 1);
        }
    }
}

function submitTextAnswer(questionId) {
    const textArea = document.getElementById(`textAnswer_${questionId}`);
    if (textArea && textArea.value.trim()) {
        medicalConsultation.patientInfo.answers[questionId] = textArea.value.trim();
        proceedToNext();
    } else {
        alert('Please provide an answer before continuing.');
    }
}

function proceedToNext() {
    medicalConsultation.currentQuestionIndex++;
    askNextQuestion();
}

function getQuestionNumber() {
    let count = 0;
    
    if (medicalConsultation.currentStep === 'basic_info') {
        count = medicalConsultation.currentQuestionIndex + 1;
    } else if (medicalConsultation.currentStep === 'primary_symptom') {
        count = medicalQuestionnaireSystem.basicInfo.length + medicalConsultation.currentQuestionIndex + 1;
    } else if (medicalConsultation.currentStep === 'symptom_specific') {
        count = medicalQuestionnaireSystem.basicInfo.length + medicalQuestionnaireSystem.primarySymptom.length + medicalConsultation.currentQuestionIndex + 1;
    } else if (medicalConsultation.currentStep === 'general') {
        const symptomQuestions = medicalConsultation.questionnaire ? medicalConsultation.questionnaire.length : 0;
        count = medicalQuestionnaireSystem.basicInfo.length + medicalQuestionnaireSystem.primarySymptom.length + symptomQuestions + medicalConsultation.currentQuestionIndex + 1;
    }
    
    return count;
}

function getTotalQuestions() {
    const basicCount = medicalQuestionnaireSystem.basicInfo.length;
    const primaryCount = medicalQuestionnaireSystem.primarySymptom.length;
    const generalCount = medicalQuestionnaireSystem.generalQuestions.length;
    const symptomCount = medicalConsultation.questionnaire ? medicalConsultation.questionnaire.length : 3; // estimated
    
    return basicCount + primaryCount + symptomCount + generalCount;
}

function generateFinalAssessment() {
    const answers = medicalConsultation.patientInfo.answers;
    
    // Analyze all the collected data
    const assessment = analyzePatientData(answers);
    
    // Create comprehensive medical assessment
    const assessmentHTML = createMedicalAssessment(assessment);
    
    const finalMessage = {
        id: Date.now().toString(),
        role: 'bot',
        text: assessmentHTML,
        timestamp: new Date(),
        isAssessment: true
    };
    
    addMessageToChat(finalMessage);
    
    // Reset consultation
    medicalConsultation.isInProgress = false;
    medicalConsultation.currentStep = 'complete';
}

// Format Medical Response Like Doctronic
function formatMedicalResponse({ diagnosis, immediateAdvice, whenToSeekHelp, followUpQuestions, severity }) {
    let response = `<div class="medical-response">`;
    
    // Diagnosis Section
    response += `<div class="diagnosis-section severity-${severity}">`;
    response += `<div class="section-title">🩺 Initial Assessment</div>`;
    response += `<div>${diagnosis}</div>`;
    response += `</div>`;
    
    // Immediate Advice
    if (immediateAdvice) {
        response += `<div class="advice-section">`;
        response += `<div class="section-title">💡 Immediate Care</div>`;
        response += `<div>${immediateAdvice}</div>`;
        response += `</div>`;
    }
    
    // When to Seek Help
    response += `<div class="follow-up-section">`;
    response += `<div class="section-title">🏥 When to Seek Medical Help</div>`;
    response += `<div>${whenToSeekHelp}</div>`;
    response += `</div>`;
    
    // Follow-up Questions
    if (followUpQuestions.length > 0) {
        response += `<div class="follow-up-section">`;
        response += `<div class="section-title">❓ To better help you, please answer:</div>`;
        response += `<ul>`;
        followUpQuestions.forEach(question => {
            response += `<li>${question}</li>`;
        });
        response += `</ul>`;
        response += `</div>`;
    }
    
    // Medical Disclaimer
    response += `<div class="medical-disclaimer">`;
    response += `<small><em>⚠️ This assessment is for informational purposes only and does not replace professional medical advice. Always consult healthcare providers for accurate diagnosis and treatment.</em></small>`;
    response += `</div>`;
    
    response += `</div>`;
    return response;
}

// Medical Data Analysis & Assessment Generation
function analyzePatientData(answers) {
    const assessment = {
        riskLevel: 'low',
        primaryDiagnosis: '',
        possibleConditions: [],
        recommendations: [],
        urgency: 'routine',
        redFlags: []
    };
    
    // Analyze based on main complaint and symptoms
    const mainComplaint = answers.main_complaint?.toLowerCase() || '';
    const duration = answers.duration || '';
    
    // Check for red flags (emergency conditions)
    if (answers.chest_symptoms && answers.chest_symptoms.includes('Difficulty breathing')) {
        assessment.riskLevel = 'critical';
        assessment.urgency = 'emergency';
        assessment.redFlags.push('Difficulty breathing with chest pain');
    }
    
    if (answers.chest_severity && (answers.chest_severity.includes('9-10') || answers.chest_severity.includes('7-8'))) {
        assessment.riskLevel = 'high';
        assessment.urgency = 'urgent';
    }
    
    if (answers.fever_temp && answers.fever_temp.includes('Above 104°F')) {
        assessment.riskLevel = 'high';
        assessment.urgency = 'urgent';
        assessment.redFlags.push('Very high fever');
    }
    
    if (answers.headache_symptoms && answers.headache_symptoms.includes('Neck stiffness')) {
        assessment.riskLevel = 'critical';
        assessment.urgency = 'emergency';
        assessment.redFlags.push('Headache with neck stiffness');
    }
    
    // Generate primary diagnosis based on symptoms
    if (mainComplaint.includes('fever')) {
        assessment.primaryDiagnosis = 'Fever of unknown origin';
        if (answers.fever_pattern === 'Getting worse') {
            assessment.riskLevel = 'medium';
        }
        assessment.possibleConditions = ['Viral infection', 'Bacterial infection', 'Flu'];
    } else if (mainComplaint.includes('headache')) {
        assessment.primaryDiagnosis = 'Headache';
        if (answers.headache_severity && answers.headache_severity.includes('9-10')) {
            assessment.riskLevel = 'high';
            assessment.possibleConditions = ['Migraine', 'Tension headache', 'Secondary headache'];
        } else {
            assessment.possibleConditions = ['Tension headache', 'Stress headache', 'Dehydration'];
        }
    } else if (mainComplaint.includes('chest')) {
        assessment.primaryDiagnosis = 'Chest pain';
        assessment.riskLevel = 'high';
        assessment.possibleConditions = ['Cardiac chest pain', 'Muscular pain', 'Respiratory cause'];
    } else if (mainComplaint.includes('stomach')) {
        assessment.primaryDiagnosis = 'Abdominal pain';
        assessment.possibleConditions = ['Gastritis', 'Food poisoning', 'Indigestion'];
    }
    
    // Generate recommendations
    if (assessment.riskLevel === 'critical') {
        assessment.recommendations = [
            'Call emergency services immediately (108)',
            'Go to nearest emergency room',
            'Do not delay medical attention'
        ];
    } else if (assessment.riskLevel === 'high') {
        assessment.recommendations = [
            'Seek medical attention today',
            'Visit nearest healthcare facility',
            'Monitor symptoms closely'
        ];
    } else {
        assessment.recommendations = [
            'Rest and monitor symptoms',
            'Stay hydrated',
            'Seek medical care if symptoms worsen'
        ];
    }
    
    return assessment;
}

function createMedicalAssessment(assessment) {
    let html = `<div class="final-assessment">`;
    
    // Header
    html += `<div class="assessment-header">`;
    html += `<h3>🩺 Medical Assessment Complete</h3>`;
    html += `<div class="assessment-date">Assessment Date: ${new Date().toLocaleDateString()}</div>`;
    html += `</div>`;
    
    // Risk Level Indicator
    html += `<div class="risk-indicator risk-${assessment.riskLevel}">`;
    html += `<div class="risk-badge">${assessment.riskLevel.toUpperCase()} PRIORITY</div>`;
    html += `</div>`;
    
    // Primary Assessment
    html += `<div class="assessment-section">`;
    html += `<div class="section-title">📋 Primary Assessment</div>`;
    html += `<div class="diagnosis">${assessment.primaryDiagnosis}</div>`;
    html += `</div>`;
    
    // Red Flags (if any)
    if (assessment.redFlags.length > 0) {
        html += `<div class="assessment-section alert-section">`;
        html += `<div class="section-title">🚨 Warning Signs Detected</div>`;
        html += `<ul class="red-flags">`;
        assessment.redFlags.forEach(flag => {
            html += `<li>${flag}</li>`;
        });
        html += `</ul>`;
        html += `</div>`;
    }
    
    // Possible Conditions
    if (assessment.possibleConditions.length > 0) {
        html += `<div class="assessment-section">`;
        html += `<div class="section-title">🔍 Possible Conditions</div>`;
        html += `<ul class="conditions-list">`;
        assessment.possibleConditions.forEach(condition => {
            html += `<li>${condition}</li>`;
        });
        html += `</ul>`;
        html += `</div>`;
    }
    
    // Recommendations
    html += `<div class="assessment-section">`;
    html += `<div class="section-title">💡 Recommendations</div>`;
    html += `<ul class="recommendations-list">`;
    assessment.recommendations.forEach(rec => {
        html += `<li>${rec}</li>`;
    });
    html += `</ul>`;
    html += `</div>`;
    
    // Urgency Timeline
    html += `<div class="assessment-section">`;
    html += `<div class="section-title">⏰ Timeline</div>`;
    html += `<div class="urgency-info">`;
    if (assessment.urgency === 'emergency') {
        html += `<strong>IMMEDIATE ACTION REQUIRED</strong> - Seek emergency medical care within minutes`;
    } else if (assessment.urgency === 'urgent') {
        html += `<strong>URGENT</strong> - Seek medical care within 24 hours`;
    } else {
        html += `<strong>ROUTINE</strong> - Schedule medical appointment within 1-2 weeks if symptoms persist`;
    }
    html += `</div>`;
    html += `</div>`;
    
    // Disclaimer
    html += `<div class="assessment-disclaimer">`;
    html += `<div class="disclaimer-title">⚠️ Important Medical Disclaimer</div>`;
    html += `<p>This assessment is for informational purposes only and should not replace professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</p>`;
    html += `</div>`;
    
    // Actions
    html += `<div class="assessment-actions">`;
    html += `<button class="action-btn primary" onclick="window.open('tel:108', '_self')">📞 Call Emergency (108)</button>`;
    html += `<button class="action-btn secondary" onclick="startNewConsultation()">🔄 New Consultation</button>`;
    html += `</div>`;
    
    html += `</div>`;
    return html;
}

function startNewConsultation() {
    // Reset consultation data
    medicalConsultation.currentStep = 'greeting';
    medicalConsultation.currentQuestionIndex = 0;
    medicalConsultation.patientInfo = {
        age: null,
        gender: null,
        primarySymptom: null,
        duration: null,
        severity: null,
        additionalSymptoms: [],
        answers: {}
    };
    medicalConsultation.questionnaire = [];
    medicalConsultation.isInProgress = false;
    
    // Clear chat and start fresh
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        chatMessages.innerHTML = `
            <div class="message message-bot">
                <div class="message-avatar">
                    <div class="avatar-icon">🩺</div>
                </div>
                <div class="message-bubble">
                    <div class="message-header">
                        <span class="sender-name">Dr. Swaasthya</span>
                        <span class="message-time">Just now</span>
                    </div>
                    <div class="message-text">
                        <div class="greeting-message">
                            <strong>Welcome back! I'm Dr. Swaasthya, your AI medical assistant.</strong>
                        </div>
                        <div class="consultation-intro">
                            Ready to start a new medical consultation? I'll ask you a series of questions to better understand your health concerns.
                        </div>
                        <div class="quick-questions">
                            <button class="medical-question-btn" onclick="startMedicalConsultation()">🩺 Start Medical Assessment</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// Updated Get Bot Response
function getBotResponse(userMessage) {
    // Check if consultation is in progress
    if (medicalConsultation.isInProgress) {
        return {
            id: Date.now().toString(),
            role: 'bot',
            text: 'Please answer the current question to continue your medical assessment.',
            timestamp: new Date()
        };
    }
    
    // Check if user wants to start consultation
    const lowerMessage = userMessage.toLowerCase();
    if (lowerMessage.includes('start') || lowerMessage.includes('begin') || lowerMessage.includes('assess')) {
        startMedicalConsultation();
        return null; // Don't add message, startMedicalConsultation will handle it
    }
    
    // Default response encouraging to start proper assessment
    return {
        id: Date.now().toString(),
        role: 'bot',
        text: `I understand you have health concerns. For the most accurate assessment, I recommend starting our structured medical consultation. This will help me ask the right questions and provide better guidance.
        
        <div style="margin-top: 1rem;">
            <button class="medical-question-btn" onclick="startMedicalConsultation()" style="width: 100%;">🩺 Start Medical Assessment</button>
        </div>`,
        timestamp: new Date()
    };
}

// Add Message to Chat (Enhanced)
function addMessageToChat(message) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${message.role}`;
    
    if (message.role === 'bot') {
        // Bot message with avatar and professional styling
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        avatarDiv.innerHTML = '<div class="avatar-icon">🩺</div>';
        messageDiv.appendChild(avatarDiv);
        
        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'message-bubble';
        
        // Add header for bot messages
        const headerDiv = document.createElement('div');
        headerDiv.className = 'message-header';
        headerDiv.innerHTML = `
            <span class="sender-name">Dr. Swaasthya</span>
            <span class="message-time">${formatTime(message.timestamp)}</span>
        `;
        
        const textDiv = document.createElement('div');
        textDiv.className = 'message-text';
        
        // Handle HTML content for medical responses
        if (message.text.includes('<div class="medical-response">')) {
            textDiv.innerHTML = message.text;
        } else {
            textDiv.textContent = message.text;
        }
        
        bubbleDiv.appendChild(headerDiv);
        bubbleDiv.appendChild(textDiv);
        messageDiv.appendChild(bubbleDiv);
    } else {
        // User message
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        avatarDiv.innerHTML = '<div class="avatar-icon">👤</div>';
        messageDiv.appendChild(avatarDiv);
        
        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'message-bubble';
        
        const headerDiv = document.createElement('div');
        headerDiv.className = 'message-header';
        headerDiv.innerHTML = `
            <span class="sender-name">You</span>
            <span class="message-time">${formatTime(message.timestamp)}</span>
        `;
        
        const textDiv = document.createElement('div');
        textDiv.className = 'message-text';
        textDiv.textContent = message.text;
        
        bubbleDiv.appendChild(headerDiv);
        bubbleDiv.appendChild(textDiv);
        messageDiv.appendChild(bubbleDiv);
    }
    
    if (message.severity === 'critical') {
        messageDiv.classList.add('critical-message');
    }
    
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom smoothly
    chatMessages.scrollTo({
        top: chatMessages.scrollHeight,
        behavior: 'smooth'
    });
    
    // Store message
    messages.push(message);
}

// Format time helper
function formatTime(timestamp) {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    return messageTime.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
    });
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
