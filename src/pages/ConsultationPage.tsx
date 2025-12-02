import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { geminiService } from '../services/geminiService';
import { FaRobot, FaUser, FaPhone, FaFileAlt } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ConsultationPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChatStarted, setIsChatStarted] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isChatStarted) {
      geminiService.initChat();
      setIsChatStarted(true);
      
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: "Good day. I am **Dr. Swaasthmitra**, an AI medical assistant.\n\nI provide professional medical guidance while emphasizing that I am an AI system, not a replacement for licensed physicians.\n\n**For emergencies, call 108 immediately.**\n\nHow may I assist you today? Please describe your symptoms.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isChatStarted]);

  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const conversationText = messages
        .map(m => `${m.sender === 'user' ? 'Patient' : 'Doctor'}: ${m.text}`)
        .join('\n\n');
      
      const summaryText = await geminiService.generateSummary(conversationText);
      setSummary(summaryText);
      setShowSummary(true);
    } catch (error) {
      console.error('Error generating summary:', error);
      alert('Failed to generate summary. Please try again.');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await geminiService.sendMessage(input);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error: any) {
      console.error('Error details:', error);
      
      let errorText = 'Sorry, I encountered an error. ';
      
      if (error.message?.includes('API key')) {
        errorText += 'API key is not configured properly. Please contact support.';
      } else if (error.message?.includes('quota')) {
        errorText += 'API quota exceeded. Please try again later.';
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        errorText += 'Network error. Please check your internet connection.';
      } else {
        errorText += 'Please try again or call 108 if this is an emergency.';
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorText + '\n\n' + (error.message || ''),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleNewConsultation = () => {
    geminiService.resetChat();
    setIsChatStarted(false);
    setMessages([]);
  };

  const handleEmergency = () => {
    window.open('tel:108', '_self');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-t-2xl shadow-lg p-6 border-b">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                  🩺 AI Medical Consultation
                </h1>
                <p className="text-gray-600 mt-2">Chat with Dr. Swaasthmitra - Your AI Health Assistant</p>
              </div>
              <div className="flex gap-3">
                {messages.length > 2 && (
                  <button
                    onClick={handleGenerateSummary}
                    disabled={isGeneratingSummary}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2 disabled:bg-gray-400"
                  >
                    <FaFileAlt />
                    {isGeneratingSummary ? 'Generating...' : 'Summary'}
                  </button>
                )}
                <button
                  onClick={handleNewConsultation}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                  New Chat
                </button>
                <button
                  onClick={() => navigate('/home')}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  Back
                </button>
              </div>
            </div>
          </div>

          {/* Summary Modal */}
          {showSummary && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto">
                <div className="p-6 border-b flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-800">Consultation Summary</h2>
                  <button
                    onClick={() => setShowSummary(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>
                <div className="p-6 prose prose-sm max-w-none">
                  <ReactMarkdown>{summary}</ReactMarkdown>
                </div>
                <div className="p-6 border-t flex gap-3">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(summary);
                      alert('Summary copied to clipboard!');
                    }}
                    className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
                  >
                    Copy Summary
                  </button>
                  <button
                    onClick={() => setShowSummary(false)}
                    className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Chat Messages */}
          <div className="bg-white shadow-lg" style={{ height: '500px', overflowY: 'auto' }}>
            <div className="p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-green-500 text-white'
                    }`}
                  >
                    {message.sender === 'user' ? <FaUser /> : <FaRobot />}
                  </div>
                  <div
                    className={`max-w-[70%] rounded-2xl p-4 ${
                      message.sender === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.sender === 'bot' ? (
                      <div className="prose prose-sm max-w-none prose-headings:mt-2 prose-headings:mb-1 prose-p:my-1 prose-ul:my-1">
                        <ReactMarkdown
                          components={{
                            strong: ({ children }) => <span className="font-bold text-gray-900">{children}</span>,
                            em: ({ children }) => <span className="italic">{children}</span>,
                            p: ({ children }) => <p className="my-2">{children}</p>,
                            ul: ({ children }) => <ul className="list-disc ml-4 my-2">{children}</ul>,
                            li: ({ children }) => <li className="my-1">{children}</li>,
                          }}
                        >
                          {message.text}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{message.text}</p>
                    )}
                    <span className="text-xs opacity-70 mt-2 block">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-green-500 text-white">
                    <FaRobot />
                  </div>
                  <div className="bg-gray-100 rounded-2xl p-4">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="bg-white rounded-b-2xl shadow-lg p-6">
            <div className="flex gap-3 mb-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe your symptoms... (Press Enter to send)"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
                disabled={isLoading}
              />
              <button
                onClick={handleSubmit}
                disabled={isLoading || !input.trim()}
                className="px-8 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition font-semibold self-end"
              >
                Send
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">
                🚨 For emergencies, call 108 immediately
              </p>
              <button
                onClick={handleEmergency}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 text-sm"
              >
                <FaPhone />
                <span>Emergency 108</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationPage;
