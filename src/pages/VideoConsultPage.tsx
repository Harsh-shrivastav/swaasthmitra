import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaVideo, FaVideoSlash, FaMicrophone, FaMicrophoneSlash, FaPhone, FaDesktop, FaComments, FaUserMd, FaClock } from 'react-icons/fa';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  avatar: string;
  status: 'available' | 'busy' | 'offline';
  consultationFee: number;
  rating: number;
}

interface ChatMessage {
  id: string;
  sender: 'doctor' | 'patient';
  text: string;
  timestamp: Date;
}

const VideoConsultPage = () => {
  const navigate = useNavigate();
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isInCall, setIsInCall] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [callDuration, setCallDuration] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const callTimerRef = useRef<number | null>(null);

  const availableDoctors: Doctor[] = [
    {
      id: 1,
      name: 'Dr. Rajesh Kumar',
      specialty: 'General Physician',
      avatar: '👨‍⚕️',
      status: 'available',
      consultationFee: 500,
      rating: 4.8
    },
    {
      id: 2,
      name: 'Dr. Priya Sharma',
      specialty: 'Cardiologist',
      avatar: '👩‍⚕️',
      status: 'available',
      consultationFee: 1200,
      rating: 4.9
    },
    {
      id: 3,
      name: 'Dr. Amit Patel',
      specialty: 'Pediatrician',
      avatar: '👨‍⚕️',
      status: 'busy',
      consultationFee: 600,
      rating: 4.7
    },
    {
      id: 4,
      name: 'Dr. Sunita Reddy',
      specialty: 'Dermatologist',
      avatar: '👩‍⚕️',
      status: 'available',
      consultationFee: 800,
      rating: 4.6
    }
  ];

  useEffect(() => {
    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startCall = async (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsConnecting(true);

    setTimeout(async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        setIsInCall(true);
        setIsConnecting(false);
        
        callTimerRef.current = window.setInterval(() => {
          setCallDuration(prev => prev + 1);
        }, 1000);

        setTimeout(() => {
          addChatMessage('doctor', `Hello! I'm ${doctor.name}. How can I help you today?`);
        }, 2000);

      } catch (error) {
        console.error('Error accessing media devices:', error);
        alert('Please allow camera and microphone access to start the video call.');
        setIsConnecting(false);
      }
    }, 1500);
  };

  const endCall = () => {
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }

    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
    }

    setIsInCall(false);
    setSelectedDoctor(null);
    setCallDuration(0);
    setChatMessages([]);
    setShowChat(false);
  };

  const toggleVideo = () => {
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioOn(audioTrack.enabled);
      }
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true
        });
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
        
        setIsScreenSharing(true);
        
        screenStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
              if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
              }
            });
        };
      } else {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        
        setIsScreenSharing(false);
      }
    } catch (error) {
      console.error('Error sharing screen:', error);
    }
  };

  const addChatMessage = (sender: 'doctor' | 'patient', text: string) => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      sender,
      text,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, message]);
  };

  const sendChatMessage = () => {
    if (chatInput.trim()) {
      addChatMessage('patient', chatInput);
      setChatInput('');
      
      setTimeout(() => {
        const responses = [
          "I understand. Can you tell me more about that?",
          "Thank you for sharing. How long have you been experiencing this?",
          "That's helpful information. Let me check your vitals.",
          "I see. Have you taken any medication for this?"
        ];
        addChatMessage('doctor', responses[Math.floor(Math.random() * responses.length)]);
      }, 2000);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  if (isInCall && selectedDoctor) {
    return (
      <div className="fixed inset-0 bg-gray-900 z-50">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="bg-gray-800 px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{selectedDoctor.avatar}</div>
              <div>
                <h2 className="text-white font-bold text-lg">{selectedDoctor.name}</h2>
                <p className="text-gray-400 text-sm">{selectedDoctor.specialty}</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-white">
                <FaClock />
                <span className="font-mono text-lg">{formatDuration(callDuration)}</span>
              </div>
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Video Area */}
          <div className="flex-1 relative bg-black">
            {/* Doctor Video (Full Screen) */}
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <div className="text-center">
                <div className="text-9xl mb-4">{selectedDoctor.avatar}</div>
                <p className="text-white text-xl">Dr. {selectedDoctor.name.split(' ')[1]}</p>
                <p className="text-gray-400">Video Connected</p>
              </div>
            </div>

            {/* Your Video (PiP) */}
            <div className="absolute top-4 right-4 w-64 h-48 bg-gray-900 rounded-lg overflow-hidden shadow-2xl border-2 border-gray-700">
              {isVideoOn ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  style={{ transform: 'scaleX(-1)' }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                  <div className="text-center">
                    <FaVideoSlash className="text-5xl text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">Camera Off</p>
                  </div>
                </div>
              )}
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 px-2 py-1 rounded text-white text-xs">
                You {isScreenSharing && '(Screen)'}
              </div>
            </div>

            {/* Chat Panel */}
            {showChat && (
              <div className="absolute right-4 bottom-24 w-96 h-96 bg-white rounded-lg shadow-2xl flex flex-col">
                <div className="bg-primary text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
                  <h3 className="font-bold">Chat</h3>
                  <button onClick={() => setShowChat(false)} className="text-white hover:text-gray-200">
                    ✕
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {chatMessages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'patient' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] px-4 py-2 rounded-lg ${
                          msg.sender === 'patient'
                            ? 'bg-primary text-white'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <span className="text-xs opacity-70">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                      placeholder="Type a message..."
                      className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      onClick={sendChatMessage}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="bg-gray-800 px-6 py-6">
            <div className="flex justify-center items-center space-x-4">
              <button
                onClick={toggleVideo}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition ${
                  isVideoOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
                }`}
                title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
              >
                {isVideoOn ? (
                  <FaVideo className="text-white text-xl" />
                ) : (
                  <FaVideoSlash className="text-white text-xl" />
                )}
              </button>

              <button
                onClick={toggleAudio}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition ${
                  isAudioOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
                }`}
                title={isAudioOn ? 'Mute microphone' : 'Unmute microphone'}
              >
                {isAudioOn ? (
                  <FaMicrophone className="text-white text-xl" />
                ) : (
                  <FaMicrophoneSlash className="text-white text-xl" />
                )}
              </button>

              <button
                onClick={endCall}
                className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition shadow-lg"
                title="End call"
              >
                <FaPhone className="text-white text-2xl" style={{ transform: 'rotate(135deg)' }} />
              </button>

              <button
                onClick={toggleScreenShare}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition ${
                  isScreenSharing ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-700 hover:bg-gray-600'
                }`}
                title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
              >
                <FaDesktop className="text-white text-xl" />
              </button>

              <button
                onClick={() => setShowChat(!showChat)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition relative ${
                  showChat ? 'bg-primary hover:bg-primary-dark' : 'bg-gray-700 hover:bg-gray-600'
                }`}
                title="Toggle chat"
              >
                <FaComments className="text-white text-xl" />
                {chatMessages.length > 0 && !showChat && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {chatMessages.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
              <FaVideo className="text-5xl text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Virtual Video Consultation
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connect face-to-face with qualified doctors from the comfort of your home
            </p>
          </div>

          {isConnecting && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
                <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h3 className="text-2xl font-bold mb-2">Connecting...</h3>
                <p className="text-gray-600 mb-4">Setting up your video call with {selectedDoctor?.name}</p>
                <p className="text-sm text-gray-500">Please allow camera and microphone access</p>
              </div>
            </div>
          )}

          {/* Available Doctors */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <FaUserMd className="mr-3 text-primary" />
              Available Doctors for Video Consultation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availableDoctors.map(doctor => (
                <div
                  key={doctor.id}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border border-gray-100"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="text-6xl">{doctor.avatar}</div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{doctor.name}</h3>
                        <p className="text-gray-600">{doctor.specialty}</p>
                        <div className="flex items-center mt-1">
                          <span className="text-yellow-500 mr-1">⭐</span>
                          <span className="font-semibold">{doctor.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(doctor.status)}`}></div>
                      <span className={`text-sm font-semibold ${
                        doctor.status === 'available' ? 'text-green-600' : 
                        doctor.status === 'busy' ? 'text-yellow-600' : 'text-gray-600'
                      }`}>
                        {doctor.status.charAt(0).toUpperCase() + doctor.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-t border-gray-100">
                      <span className="text-gray-600">Consultation Fee</span>
                      <span className="font-bold text-lg text-primary">₹{doctor.consultationFee}</span>
                    </div>

                    <button
                      onClick={() => startCall(doctor)}
                      disabled={doctor.status !== 'available'}
                      className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition ${
                        doctor.status === 'available'
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <FaVideo />
                      <span>{doctor.status === 'available' ? 'Start Video Call' : 'Currently Unavailable'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Video Consultation Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaVideo className="text-3xl text-blue-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">HD Video Quality</h3>
                <p className="text-gray-600 text-sm">Crystal clear video with adaptive streaming</p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaDesktop className="text-3xl text-green-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Screen Sharing</h3>
                <p className="text-gray-600 text-sm">Share reports and test results during consultation</p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaComments className="text-3xl text-purple-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Real-time Chat</h3>
                <p className="text-gray-600 text-sm">Text chat alongside video for better communication</p>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/home')}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoConsultPage;
