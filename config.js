// Configuration for Gemini API
const CONFIG = {
    // Gemini API Configuration
    // SECURITY: Never hardcode API keys. Use environment variables instead.
    GEMINI_API_KEY: '', // Set via environment variable VITE_GEMINI_API_KEY
    GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    
    // Application Settings
    APP_NAME: 'Swaasthmitra',
    VERSION: '1.0.0',
    
    // Medical Settings
    MAX_CONSULTATION_TIME: 30, // minutes
    EMERGENCY_NUMBER: '108',
    
    // UI Settings
    TYPING_DELAY: 1000,
    AUTO_SCROLL: true,
    
    // API Settings
    MAX_RETRIES: 3,
    REQUEST_TIMEOUT: 30000, // 30 seconds
    
    // Initialize configuration
    init() {
        // Set API key if available in environment
        if (typeof process !== 'undefined' && process.env) {
            this.GEMINI_API_KEY = process.env.GEMINI_API_KEY || this.GEMINI_API_KEY;
        }
        
        // Initialize medical chat with API key
        if (this.GEMINI_API_KEY) {
            medicalChat.setApiKey(this.GEMINI_API_KEY);
        } else {
            console.warn('Gemini API key not configured. Please set GEMINI_API_KEY in config.js');
        }
    },
    
    // Validate configuration
    validate() {
        const issues = [];
        
        if (!this.GEMINI_API_KEY) {
            issues.push('Gemini API key is required');
        }
        
        if (issues.length > 0) {
            console.error('Configuration issues:', issues);
            this.showConfigError(issues);
            return false;
        }
        
        return true;
    },
    
    // Show configuration error to user
    showConfigError(issues) {
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            chatMessages.innerHTML = `
                <div class="config-error">
                    <h3>⚠️ Configuration Required</h3>
                    <p>To use the AI medical consultation, please configure the following:</p>
                    <ul>
                        ${issues.map(issue => `<li>${issue}</li>`).join('')}
                    </ul>
                    <div class="config-instructions">
                        <h4>How to set up:</h4>
                        <ol>
                            <li>Get a free Gemini API key from <a href="https://aistudio.google.com/app/apikey" target="_blank">Google AI Studio</a></li>
                            <li>Open <code>config.js</code> file</li>
                            <li>Add your API key: <code>GEMINI_API_KEY: 'your-api-key-here'</code></li>
                            <li>Refresh this page</li>
                        </ol>
                    </div>
                </div>
            `;
        }
    }
};

// Initialize configuration when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    CONFIG.init();
    
    // Validate configuration after a brief delay
    setTimeout(() => {
        if (!CONFIG.validate()) {
            return;
        }
        
        // Configuration is valid, show welcome message
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages && chatMessages.children.length === 0) {
            chatMessages.innerHTML = `
                <div class="message message-assistant">
                    <div class="message-avatar">
                        <div class="avatar-icon">🩺</div>
                    </div>
                    <div class="message-bubble">
                        <div class="message-header">
                            <span class="sender-name">Dr. Swaasthya</span>
                            <span class="message-time">Now</span>
                        </div>
                        <div class="message-content">
                            <div class="welcome-message">
                                <h3>🩺 Welcome to Swaasthmitra Medical Consultation</h3>
                                <p>I'm Dr. Swaasthya, your AI medical assistant. I'll conduct a structured medical consultation similar to what you'd experience with a doctor.</p>
                                <div class="consultation-features">
                                    <h4>What I'll do:</h4>
                                    <ul>
                                        <li>🏥 Ask detailed medical questions</li>
                                        <li>📋 Gather your symptoms and history</li>
                                        <li>🔍 Analyze your responses with AI</li>
                                        <li>📝 Provide a comprehensive SOAP note</li>
                                        <li>💡 Give personalized medical recommendations</li>
                                    </ul>
                                </div>
                                <button class="start-consultation-btn" onclick="medicalChat.startConsultation()">
                                    🚀 Start Medical Consultation
                                </button>
                                <div class="disclaimer-notice">
                                    <small>⚠️ This AI consultation supplements but does not replace professional medical care. For emergencies, call 108 immediately.</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }, 500);
});

// Export configuration for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}