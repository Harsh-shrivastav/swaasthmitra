import { useState } from 'react';
import { useConsultation } from '../context/ConsultationContext';
import { geminiService } from '../services/geminiService';
import { FaRobot, FaUser, FaPhone } from 'react-icons/fa';

const ConsultationPage = () => {
  const { consultation, addMessage, updateConsultation, updatePatientData } = useConsultation();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const startConsultation = async () => {
    updateConsultation({ isInProgress: true, currentStep: 'demographics' });
    
    addMessage({
      id: Date.now().toString(),
      role: 'assistant',
      content: 'Welcome to Swaasthmitra Medical Consultation! Let\'s start with some basic information. What is your age?',
      timestamp: new Date(),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: input,
      timestamp: new Date(),
    };

    addMessage(userMessage);
    setInput('');
    setIsLoading(true);

    try {
      // Simple logic - in production, this would be more sophisticated
      if (consultation.currentStep === 'demographics') {
        updatePatientData({
          demographics: { ...consultation.patientData.demographics, age: input }
        });
        
        addMessage({
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Thank you. What is your gender?',
          timestamp: new Date(),
        });
      } else if (consultation.currentStep === 'chiefComplaint') {
        updatePatientData({ chiefComplaint: input });
        
        // Generate dynamic question using Gemini
        const context = consultation.conversationHistory
          .map(m => `${m.role}: ${m.content}`)
          .join('\n');
        
        const question = await geminiService.generateMedicalQuestion(
          context,
          consultation.patientData
        );

        addMessage({
          id: Date.now().toString(),
          role: 'assistant',
          content: question,
          timestamp: new Date(),
        });
      }
    } catch (error) {
      console.error('Error:', error);
      addMessage({
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      });
    }

    setIsLoading(false);
  };

  const handleEmergency = () => {
    window.open('tel:108', '_self');
  };

  if (!consultation.isInProgress) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full card text-center">
          <div className="text-6xl mb-6">🩺</div>
          <h1 className="text-3xl font-bold mb-4">Welcome to Medical Consultation</h1>
          <p className="text-gray-600 mb-8">
            I'm Dr. Swaasthya, your AI medical assistant. I'll conduct a structured medical 
            consultation similar to what you'd experience with a doctor.
          </p>
          <button onClick={startConsultation} className="btn-primary text-lg px-8 py-3">
            Start Consultation
          </button>
          <button onClick={handleEmergency} className="btn-secondary text-lg px-8 py-3 ml-4">
            🚨 Emergency
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Emergency Button */}
          <div className="mb-4 flex justify-end">
            <button
              onClick={handleEmergency}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2"
            >
              <FaPhone />
              <span>Emergency (108)</span>
            </button>
          </div>

          {/* Chat Container */}
          <div className="card min-h-[600px] flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {consultation.conversationHistory.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {message.role === 'user' ? <FaUser /> : <FaRobot />}
                  </div>
                  <div
                    className={`max-w-[70%] p-4 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70 mt-2">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-200 text-gray-700">
                    <FaRobot />
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your answer..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="btn-primary px-6"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationPage;
