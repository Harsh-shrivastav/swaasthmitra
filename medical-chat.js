// Medical Consultation System with Gemini API
class MedicalConsultation {
    constructor() {
        this.apiKey = ''; // Will be set from environment or config
        this.currentStep = 'greeting';
        this.currentQuestionIndex = 0;
        this.patientData = {
            demographics: {},
            chiefComplaint: '',
            historyOfPresentIllness: '',
            reviewOfSystems: {},
            pastMedicalHistory: [],
            medications: [],
            allergies: [],
            socialHistory: {},
            vitalSigns: {},
            physicalExam: {},
            answers: {}
        };
        this.conversationHistory = [];
        this.isInProgress = false;
    }

    // Initialize API Key
    setApiKey(key) {
        this.apiKey = key;
    }

    // Start medical consultation
    async startConsultation() {
        this.isInProgress = true;
        this.currentStep = 'demographics';
        this.currentQuestionIndex = 0;
        
        const welcomeMessage = {
            id: Date.now().toString(),
            role: 'assistant',
            content: this.getWelcomeMessage(),
            timestamp: new Date(),
            isStructured: true
        };
        
        this.addMessageToChat(welcomeMessage);
        this.askNextQuestion();
    }

    // Medical questionnaire structure
    getQuestions() {
        return {
            demographics: [
                {
                    id: 'age',
                    question: 'What is your age?',
                    type: 'number',
                    options: ['Under 18', '18-30', '31-45', '46-60', '61-75', 'Over 75'],
                    required: true
                },
                {
                    id: 'gender',
                    question: 'What is your biological sex?',
                    type: 'choice',
                    options: ['Male', 'Female', 'Prefer not to say'],
                    required: true
                }
            ],
            
            chiefComplaint: [
                {
                    id: 'primary_concern',
                    question: 'What is your main health concern today? Please describe in your own words.',
                    type: 'text',
                    placeholder: 'e.g., "I have been having chest pain for 2 days"',
                    required: true
                }
            ],
            
            presentIllness: [
                {
                    id: 'duration',
                    question: 'How long have you been experiencing this problem?',
                    type: 'choice',
                    options: ['Less than 1 hour', '1-6 hours', '6-24 hours', '1-3 days', '4-7 days', '1-4 weeks', 'More than 1 month'],
                    required: true
                },
                {
                    id: 'severity',
                    question: 'On a scale of 1-10, how would you rate your discomfort?',
                    type: 'choice',
                    options: ['1-2 (Minimal)', '3-4 (Mild)', '5-6 (Moderate)', '7-8 (Severe)', '9-10 (Unbearable)'],
                    required: true
                },
                {
                    id: 'progression',
                    question: 'How has your condition changed over time?',
                    type: 'choice',
                    options: ['Getting better', 'Staying the same', 'Getting worse', 'Comes and goes', 'First time experiencing this'],
                    required: true
                }
            ],
            
            reviewOfSystems: [
                {
                    id: 'associated_symptoms',
                    question: 'Are you experiencing any of these symptoms along with your main concern?',
                    type: 'multiple',
                    options: ['Fever', 'Headache', 'Nausea', 'Vomiting', 'Dizziness', 'Fatigue', 'Difficulty breathing', 'Chest pain', 'Abdominal pain', 'Changes in appetite', 'Sleep problems'],
                    required: false
                }
            ],
            
            medicalHistory: [
                {
                    id: 'past_conditions',
                    question: 'Do you have any of these medical conditions?',
                    type: 'multiple',
                    options: ['Diabetes', 'High blood pressure', 'Heart disease', 'Asthma', 'Kidney disease', 'Liver disease', 'Cancer', 'Depression/Anxiety', 'Thyroid problems', 'None of these'],
                    required: false
                },
                {
                    id: 'medications',
                    question: 'Are you currently taking any medications? (Include vitamins and supplements)',
                    type: 'choice',
                    options: ['No medications', 'Yes, prescription medications', 'Yes, over-the-counter medications', 'Yes, both prescription and OTC'],
                    required: false
                },
                {
                    id: 'allergies',
                    question: 'Do you have any known allergies?',
                    type: 'choice',
                    options: ['No known allergies', 'Drug allergies', 'Food allergies', 'Environmental allergies', 'Multiple allergies'],
                    required: false
                }
            ],
            
            socialHistory: [
                {
                    id: 'smoking',
                    question: 'Do you smoke or use tobacco products?',
                    type: 'choice',
                    options: ['Never smoked', 'Former smoker', 'Current smoker (less than 1 pack/day)', 'Current smoker (1+ pack/day)'],
                    required: false
                },
                {
                    id: 'alcohol',
                    question: 'How often do you consume alcohol?',
                    type: 'choice',
                    options: ['Never', 'Rarely (few times a year)', 'Occasionally (few times a month)', 'Regularly (few times a week)', 'Daily'],
                    required: false
                }
            ]
        };
    }

    // Get welcome message
    getWelcomeMessage() {
        return `
            <div class="consultation-welcome">
                <div class="welcome-header">
                    <h3>🩺 Medical Consultation Started</h3>
                    <p>I'll ask you a series of questions to understand your health concerns, similar to a doctor's visit.</p>
                </div>
                <div class="consultation-process">
                    <h4>What to expect:</h4>
                    <ol>
                        <li><strong>Basic Information</strong> - Demographics and background</li>
                        <li><strong>Chief Complaint</strong> - Your main health concern</li>
                        <li><strong>Symptom Details</strong> - Duration, severity, and progression</li>
                        <li><strong>Review of Systems</strong> - Associated symptoms</li>
                        <li><strong>Medical History</strong> - Past conditions and medications</li>
                        <li><strong>Assessment</strong> - AI analysis and SOAP note</li>
                    </ol>
                </div>
                <div class="privacy-notice">
                    <p><small>🔒 Your responses are analyzed using AI to provide medical insights. This consultation does not replace professional medical advice.</small></p>
                </div>
            </div>
        `;
    }

    // Ask next question in sequence
    askNextQuestion() {
        const questions = this.getQuestions();
        let currentQuestion = null;
        let sectionName = '';

        // Determine current section and question
        switch(this.currentStep) {
            case 'demographics':
                if (this.currentQuestionIndex < questions.demographics.length) {
                    currentQuestion = questions.demographics[this.currentQuestionIndex];
                    sectionName = 'Demographics';
                } else {
                    this.moveToNextSection('chiefComplaint');
                    return;
                }
                break;

            case 'chiefComplaint':
                if (this.currentQuestionIndex < questions.chiefComplaint.length) {
                    currentQuestion = questions.chiefComplaint[this.currentQuestionIndex];
                    sectionName = 'Chief Complaint';
                } else {
                    this.moveToNextSection('presentIllness');
                    return;
                }
                break;

            case 'presentIllness':
                if (this.currentQuestionIndex < questions.presentIllness.length) {
                    currentQuestion = questions.presentIllness[this.currentQuestionIndex];
                    sectionName = 'Present Illness';
                } else {
                    this.moveToNextSection('reviewOfSystems');
                    return;
                }
                break;

            case 'reviewOfSystems':
                if (this.currentQuestionIndex < questions.reviewOfSystems.length) {
                    currentQuestion = questions.reviewOfSystems[this.currentQuestionIndex];
                    sectionName = 'Review of Systems';
                } else {
                    this.moveToNextSection('medicalHistory');
                    return;
                }
                break;

            case 'medicalHistory':
                if (this.currentQuestionIndex < questions.medicalHistory.length) {
                    currentQuestion = questions.medicalHistory[this.currentQuestionIndex];
                    sectionName = 'Medical History';
                } else {
                    this.moveToNextSection('socialHistory');
                    return;
                }
                break;

            case 'socialHistory':
                if (this.currentQuestionIndex < questions.socialHistory.length) {
                    currentQuestion = questions.socialHistory[this.currentQuestionIndex];
                    sectionName = 'Social History';
                } else {
                    this.generateFinalAssessment();
                    return;
                }
                break;
        }

        if (currentQuestion) {
            this.displayQuestion(currentQuestion, sectionName);
        }
    }

    // Move to next section
    moveToNextSection(nextSection) {
        this.currentStep = nextSection;
        this.currentQuestionIndex = 0;
        this.askNextQuestion();
    }

    // Display question with professional formatting
    displayQuestion(questionObj, sectionName) {
        const totalQuestions = this.getTotalQuestions();
        const currentQuestionNum = this.getCurrentQuestionNumber();

        let questionHTML = `
            <div class="medical-question" id="question-${questionObj.id}">
                <div class="question-header">
                    <div class="section-indicator">${sectionName}</div>
                    <div class="progress-indicator">
                        <span class="progress-text">Question ${currentQuestionNum} of ${totalQuestions}</span>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${(currentQuestionNum/totalQuestions)*100}%"></div>
                        </div>
                    </div>
                </div>
                <div class="question-content">
                    <h4 class="question-text">${questionObj.question}</h4>
                    ${this.generateAnswerOptions(questionObj)}
                </div>
            </div>
        `;

        const questionMessage = {
            id: Date.now().toString(),
            role: 'assistant',
            content: questionHTML,
            timestamp: new Date(),
            isQuestion: true,
            questionId: questionObj.id
        };

        this.addMessageToChat(questionMessage);
    }

    // Generate answer options based on question type
    generateAnswerOptions(questionObj) {
        let optionsHTML = '';

        switch(questionObj.type) {
            case 'choice':
                optionsHTML = '<div class="answer-options single-choice">';
                questionObj.options.forEach((option, index) => {
                    optionsHTML += `
                        <button class="option-btn" onclick="medicalChat.selectAnswer('${questionObj.id}', '${option}')" data-value="${option}">
                            ${option}
                        </button>
                    `;
                });
                optionsHTML += '</div>';
                break;

            case 'multiple':
                optionsHTML = '<div class="answer-options multiple-choice">';
                optionsHTML += '<p class="instruction-text">Select all that apply:</p>';
                questionObj.options.forEach((option, index) => {
                    optionsHTML += `
                        <label class="checkbox-option">
                            <input type="checkbox" value="${option}" onchange="medicalChat.updateMultipleAnswer('${questionObj.id}', '${option}', this.checked)">
                            <span class="checkmark"></span>
                            <span class="option-text">${option}</span>
                        </label>
                    `;
                });
                optionsHTML += `
                    <button class="continue-btn" onclick="medicalChat.proceedToNext()" style="margin-top: 1rem;">
                        Continue
                    </button>
                </div>`;
                break;

            case 'text':
                optionsHTML = `
                    <div class="answer-options text-input">
                        <textarea 
                            class="medical-textarea" 
                            id="textAnswer_${questionObj.id}" 
                            placeholder="${questionObj.placeholder || 'Please provide details...'}" 
                            rows="4"
                            maxlength="1000"
                        ></textarea>
                        <div class="input-footer">
                            <span class="char-count" id="charCount_${questionObj.id}">0/1000</span>
                            <button class="continue-btn" onclick="medicalChat.submitTextAnswer('${questionObj.id}')">
                                Continue
                            </button>
                        </div>
                    </div>
                `;
                break;

            case 'number':
                optionsHTML = '<div class="answer-options single-choice">';
                questionObj.options.forEach((option, index) => {
                    optionsHTML += `
                        <button class="option-btn" onclick="medicalChat.selectAnswer('${questionObj.id}', '${option}')" data-value="${option}">
                            ${option}
                        </button>
                    `;
                });
                optionsHTML += '</div>';
                break;
        }

        return optionsHTML;
    }

    // Handle single choice answers
    selectAnswer(questionId, answer) {
        this.patientData.answers[questionId] = answer;
        
        // Add user response to chat
        const userMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: answer,
            timestamp: new Date(),
            questionId: questionId
        };
        
        this.addMessageToChat(userMessage);
        
        // Visual feedback
        const buttons = document.querySelectorAll(`#question-${questionId} .option-btn`);
        buttons.forEach(btn => {
            btn.classList.remove('selected');
            btn.disabled = true;
        });
        event.target.classList.add('selected');
        
        // Auto-proceed after brief delay
        setTimeout(() => {
            this.proceedToNext();
        }, 800);
    }

    // Handle multiple choice answers
    updateMultipleAnswer(questionId, option, isChecked) {
        if (!this.patientData.answers[questionId]) {
            this.patientData.answers[questionId] = [];
        }
        
        if (isChecked) {
            if (!this.patientData.answers[questionId].includes(option)) {
                this.patientData.answers[questionId].push(option);
            }
        } else {
            const index = this.patientData.answers[questionId].indexOf(option);
            if (index > -1) {
                this.patientData.answers[questionId].splice(index, 1);
            }
        }
    }

    // Handle text answers
    submitTextAnswer(questionId) {
        const textarea = document.getElementById(`textAnswer_${questionId}`);
        if (textarea && textarea.value.trim()) {
            const answer = textarea.value.trim();
            this.patientData.answers[questionId] = answer;
            
            // Add user response to chat
            const userMessage = {
                id: Date.now().toString(),
                role: 'user',
                content: answer,
                timestamp: new Date(),
                questionId: questionId
            };
            
            this.addMessageToChat(userMessage);
            
            // Disable textarea
            textarea.disabled = true;
            const button = textarea.parentElement.querySelector('.continue-btn');
            if (button) {
                button.disabled = true;
                button.textContent = 'Submitted';
            }
            
            setTimeout(() => {
                this.proceedToNext();
            }, 800);
        } else {
            alert('Please provide an answer before continuing.');
        }
    }

    // Proceed to next question
    proceedToNext() {
        this.currentQuestionIndex++;
        this.askNextQuestion();
    }

    // Get current question number
    getCurrentQuestionNumber() {
        let count = 0;
        const questions = this.getQuestions();

        if (this.currentStep === 'demographics') {
            count = this.currentQuestionIndex + 1;
        } else if (this.currentStep === 'chiefComplaint') {
            count = questions.demographics.length + this.currentQuestionIndex + 1;
        } else if (this.currentStep === 'presentIllness') {
            count = questions.demographics.length + questions.chiefComplaint.length + this.currentQuestionIndex + 1;
        } else if (this.currentStep === 'reviewOfSystems') {
            count = questions.demographics.length + questions.chiefComplaint.length + questions.presentIllness.length + this.currentQuestionIndex + 1;
        } else if (this.currentStep === 'medicalHistory') {
            count = questions.demographics.length + questions.chiefComplaint.length + questions.presentIllness.length + questions.reviewOfSystems.length + this.currentQuestionIndex + 1;
        } else if (this.currentStep === 'socialHistory') {
            count = questions.demographics.length + questions.chiefComplaint.length + questions.presentIllness.length + questions.reviewOfSystems.length + questions.medicalHistory.length + this.currentQuestionIndex + 1;
        }

        return count;
    }

    // Get total number of questions
    getTotalQuestions() {
        const questions = this.getQuestions();
        return questions.demographics.length + 
               questions.chiefComplaint.length + 
               questions.presentIllness.length + 
               questions.reviewOfSystems.length + 
               questions.medicalHistory.length + 
               questions.socialHistory.length;
    }

    // Generate final assessment using Gemini API
    async generateFinalAssessment() {
        // Show loading message
        const loadingMessage = {
            id: Date.now().toString(),
            role: 'assistant',
            content: this.getLoadingMessage(),
            timestamp: new Date(),
            isLoading: true
        };
        this.addMessageToChat(loadingMessage);

        try {
            // Prepare patient data for AI analysis
            const patientSummary = this.preparePatientSummary();
            
            // Call Gemini API for medical assessment
            const assessment = await this.callGeminiAPI(patientSummary);
            
            // Remove loading message
            this.removeLoadingMessage();
            
            // Display final assessment with SOAP note
            const assessmentMessage = {
                id: Date.now().toString(),
                role: 'assistant',
                content: assessment,
                timestamp: new Date(),
                isAssessment: true
            };
            
            this.addMessageToChat(assessmentMessage);
            
            // Mark consultation as complete
            this.isInProgress = false;
            this.currentStep = 'complete';
            
        } catch (error) {
            console.error('Error generating assessment:', error);
            this.removeLoadingMessage();
            this.showErrorMessage(error.message);
        }
    }

    // Prepare patient summary for AI
    preparePatientSummary() {
        const answers = this.patientData.answers;
        
        return `
PATIENT CONSULTATION SUMMARY:

DEMOGRAPHICS:
- Age: ${answers.age || 'Not provided'}
- Gender: ${answers.gender || 'Not provided'}

CHIEF COMPLAINT:
${answers.primary_concern || 'Not provided'}

HISTORY OF PRESENT ILLNESS:
- Duration: ${answers.duration || 'Not provided'}
- Severity (1-10): ${answers.severity || 'Not provided'}
- Progression: ${answers.progression || 'Not provided'}

REVIEW OF SYSTEMS:
Associated symptoms: ${Array.isArray(answers.associated_symptoms) ? answers.associated_symptoms.join(', ') : 'None reported'}

PAST MEDICAL HISTORY:
Medical conditions: ${Array.isArray(answers.past_conditions) ? answers.past_conditions.join(', ') : 'None reported'}
Medications: ${answers.medications || 'Not provided'}
Allergies: ${answers.allergies || 'Not provided'}

SOCIAL HISTORY:
- Smoking: ${answers.smoking || 'Not provided'}
- Alcohol: ${answers.alcohol || 'Not provided'}

Please provide a comprehensive medical assessment in SOAP note format with the following sections:
1. SUBJECTIVE - Patient's reported symptoms and history
2. OBJECTIVE - Analysis of provided information (note: no physical exam performed)
3. ASSESSMENT - Differential diagnosis and clinical impression
4. PLAN - Recommendations for care, follow-up, and when to seek immediate attention

Also include:
- Risk stratification (Low/Medium/High/Critical)
- Red flags if any
- Specific recommendations for this patient
- When to seek emergency care

Format the response in clear, professional medical language while being accessible to patients.
        `;
    }

    // Call Gemini API
    async callGeminiAPI(patientSummary) {
        if (!this.apiKey) {
            throw new Error('Gemini API key not configured');
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `You are an experienced physician providing a medical consultation. Based on the following patient information, provide a comprehensive SOAP note assessment:\n\n${patientSummary}\n\nIMPORTANT: This is a telemedicine consultation. No physical examination was performed. Include appropriate disclaimers about the limitations of remote assessment and emphasize when in-person evaluation is needed.`
                    }]
                }],
                generationConfig: {
                    temperature: 0.3,
                    topK: 40,
                    topP: 0.8,
                    maxOutputTokens: 2048,
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const content = data.candidates[0].content.parts[0].text;
            return this.formatAssessmentResponse(content);
        } else {
            throw new Error('Invalid API response format');
        }
    }

    // Format assessment response for display
    formatAssessmentResponse(content) {
        // Convert plain text SOAP note to HTML with proper formatting
        let formattedContent = content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>');

        return `
            <div class="final-assessment">
                <div class="assessment-header">
                    <h2>🏥 Medical Assessment Complete</h2>
                    <div class="assessment-meta">
                        <span>Generated by AI Medical Assistant</span>
                        <span>Date: ${new Date().toLocaleDateString()}</span>
                    </div>
                </div>
                
                <div class="soap-note">
                    <p>${formattedContent}</p>
                </div>
                
                <div class="assessment-actions">
                    <button class="action-btn primary" onclick="window.print()">🖨️ Print Assessment</button>
                    <button class="action-btn secondary" onclick="medicalChat.startNewConsultation()">🔄 New Consultation</button>
                    <a href="tel:108" class="action-btn emergency">📞 Emergency (108)</a>
                </div>
                
                <div class="medical-disclaimer">
                    <h4>⚠️ Important Medical Disclaimer</h4>
                    <p>This AI-generated assessment is for informational purposes only and should not replace professional medical advice, diagnosis, or treatment. Always seek the advice of qualified healthcare providers for any medical concerns. In case of emergency, call 108 immediately.</p>
                </div>
            </div>
        `;
    }

    // Get loading message
    getLoadingMessage() {
        return `
            <div class="assessment-loading">
                <div class="loading-icon">
                    <div class="medical-spinner"></div>
                </div>
                <h3>🩺 Analyzing Your Consultation...</h3>
                <p>Our AI is reviewing your responses and generating a comprehensive medical assessment.</p>
                <div class="loading-steps">
                    <div class="step active">📋 Processing symptoms</div>
                    <div class="step active">🔍 Analyzing patterns</div>
                    <div class="step active">📝 Generating SOAP note</div>
                </div>
            </div>
        `;
    }

    // Remove loading message
    removeLoadingMessage() {
        const loadingElements = document.querySelectorAll('.assessment-loading');
        loadingElements.forEach(el => el.remove());
    }

    // Show error message
    showErrorMessage(error) {
        const errorMessage = {
            id: Date.now().toString(),
            role: 'assistant',
            content: `
                <div class="error-message">
                    <h3>❌ Assessment Error</h3>
                    <p>Sorry, we encountered an error while generating your medical assessment: ${error}</p>
                    <button class="action-btn secondary" onclick="medicalChat.generateFinalAssessment()">
                        🔄 Try Again
                    </button>
                </div>
            `,
            timestamp: new Date(),
            isError: true
        };
        this.addMessageToChat(errorMessage);
    }

    // Add message to chat interface
    addMessageToChat(message) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${message.role}`;
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <div class="avatar-icon">${message.role === 'user' ? '👤' : '🩺'}</div>
            </div>
            <div class="message-bubble">
                <div class="message-header">
                    <span class="sender-name">${message.role === 'user' ? 'You' : 'Dr. Swaasthya'}</span>
                    <span class="message-time">${this.formatTime(message.timestamp)}</span>
                </div>
                <div class="message-content">
                    ${message.content}
                </div>
            </div>
        `;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Format timestamp
    formatTime(timestamp) {
        return new Date(timestamp).toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit', 
            hour12: true 
        });
    }

    // Start new consultation
    startNewConsultation() {
        // Reset all data
        this.currentStep = 'greeting';
        this.currentQuestionIndex = 0;
        this.patientData = {
            demographics: {},
            chiefComplaint: '',
            historyOfPresentIllness: '',
            reviewOfSystems: {},
            pastMedicalHistory: [],
            medications: [],
            allergies: [],
            socialHistory: {},
            vitalSigns: {},
            physicalExam: {},
            answers: {}
        };
        this.conversationHistory = [];
        this.isInProgress = false;

        // Clear chat
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            chatMessages.innerHTML = '';
        }

        // Start fresh consultation
        this.startConsultation();
    }
}

// Global instance
const medicalChat = new MedicalConsultation();