import { useNavigate } from 'react-router-dom';
import { FaAmbulance, FaPhone, FaExclamationTriangle, FaHeartbeat, FaBurn, FaBone, FaLungsVirus } from 'react-icons/fa';

const EmergencyPage = () => {
  const navigate = useNavigate();

  const emergencyNumbers = [
    { service: 'Ambulance / Medical Emergency', number: '108', icon: <FaAmbulance />, color: 'red' },
    { service: 'Police Emergency', number: '100', icon: <FaExclamationTriangle />, color: 'blue' },
    { service: 'Fire Emergency', number: '101', icon: <FaBurn />, color: 'orange' },
    { service: 'Women Helpline', number: '1091', icon: <FaExclamationTriangle />, color: 'purple' },
    { service: 'Child Helpline', number: '1098', icon: <FaExclamationTriangle />, color: 'green' },
    { service: 'Disaster Management', number: '108', icon: <FaExclamationTriangle />, color: 'yellow' },
  ];

  const emergencyConditions = [
    {
      title: 'Heart Attack',
      icon: <FaHeartbeat className="text-4xl text-red-500" />,
      symptoms: ['Chest pain or discomfort', 'Shortness of breath', 'Pain in arm, jaw, or back', 'Nausea or lightheadedness'],
      action: 'Call 108 immediately. Chew aspirin if available. Do not drive yourself.'
    },
    {
      title: 'Stroke',
      icon: <FaLungsVirus className="text-4xl text-purple-500" />,
      symptoms: ['Face drooping', 'Arm weakness', 'Speech difficulty', 'Sudden severe headache'],
      action: 'Call 108 immediately. Note the time symptoms started. Do not give food or water.'
    },
    {
      title: 'Severe Bleeding',
      icon: <FaExclamationTriangle className="text-4xl text-red-600" />,
      symptoms: ['Uncontrollable bleeding', 'Blood spurting from wound', 'Soaking through bandages', 'Signs of shock'],
      action: 'Call 108. Apply direct pressure. Elevate the injured area. Keep person warm.'
    },
    {
      title: 'Fracture / Severe Injury',
      icon: <FaBone className="text-4xl text-orange-500" />,
      symptoms: ['Deformed limb', 'Severe pain', 'Unable to move', 'Swelling and bruising'],
      action: 'Call 108. Do not move the person. Immobilize the injured area. Apply ice if available.'
    },
    {
      title: 'Breathing Problems',
      icon: <FaLungsVirus className="text-4xl text-blue-500" />,
      symptoms: ['Severe shortness of breath', 'Gasping for air', 'Blue lips or face', 'Chest tightness'],
      action: 'Call 108 immediately. Keep person calm and upright. Loosen tight clothing.'
    },
    {
      title: 'Poisoning',
      icon: <FaExclamationTriangle className="text-4xl text-green-600" />,
      symptoms: ['Nausea and vomiting', 'Difficulty breathing', 'Confusion or drowsiness', 'Burns around mouth'],
      action: 'Call 108 and Poison Control. Do not induce vomiting. Keep container of substance.'
    },
  ];

  const firstAidBasics = [
    {
      title: 'CPR Basics',
      steps: [
        'Check for responsiveness',
        'Call 108 immediately',
        'Place hands on center of chest',
        'Push hard and fast - 100-120 compressions/min',
        'Continue until help arrives'
      ]
    },
    {
      title: 'Choking Relief',
      steps: [
        'Encourage coughing if possible',
        'Give 5 back blows between shoulder blades',
        'Give 5 abdominal thrusts (Heimlich)',
        'Repeat until object dislodges',
        'Call 108 if unconscious'
      ]
    },
    {
      title: 'Burn Treatment',
      steps: [
        'Cool the burn with running water for 10-20 minutes',
        'Remove jewelry before swelling',
        'Cover with clean, dry cloth',
        'Do not apply ice or butter',
        'Seek medical help for severe burns'
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <FaAmbulance className="text-7xl text-red-600 mx-auto mb-4 animate-pulse" />
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Emergency Services</h1>
            <p className="text-xl text-gray-600">Quick access to emergency contacts and first aid guidance</p>
          </div>

          {/* Emergency Call Button */}
          <div className="mb-12">
            <div className="card bg-gradient-to-r from-red-500 to-red-600 text-white text-center p-8">
              <FaAmbulance className="text-6xl mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">Medical Emergency?</h2>
              <p className="text-xl mb-6">Call for immediate ambulance service</p>
              <a
                href="tel:108"
                className="inline-block bg-white text-red-600 px-12 py-5 rounded-xl font-bold text-2xl hover:bg-gray-100 transition shadow-2xl"
              >
                <FaPhone className="inline mr-3" />
                CALL 108 NOW
              </a>
            </div>
          </div>

          {/* Emergency Numbers */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Emergency Contact Numbers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {emergencyNumbers.map((item, index) => (
                <div key={index} className="card hover:shadow-xl transition-all">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`text-4xl text-${item.color}-600`}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{item.service}</h3>
                      <a
                        href={`tel:${item.number}`}
                        className="text-3xl font-bold text-primary hover:text-primary-dark"
                      >
                        {item.number}
                      </a>
                    </div>
                  </div>
                  <a
                    href={`tel:${item.number}`}
                    className={`block w-full bg-${item.color}-500 hover:bg-${item.color}-600 text-white py-3 rounded-lg font-semibold text-center transition`}
                  >
                    <FaPhone className="inline mr-2" />
                    Call Now
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Conditions */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Recognize Medical Emergencies</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {emergencyConditions.map((condition, index) => (
                <div key={index} className="card hover:shadow-xl transition-all">
                  <div className="flex items-center space-x-4 mb-4">
                    {condition.icon}
                    <h3 className="text-2xl font-bold text-gray-900">{condition.title}</h3>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Symptoms:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      {condition.symptoms.map((symptom, idx) => (
                        <li key={idx}>{symptom}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <h4 className="font-semibold text-red-900 mb-2">⚠️ What to Do:</h4>
                    <p className="text-red-800">{condition.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* First Aid Basics */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Basic First Aid</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {firstAidBasics.map((guide, index) => (
                <div key={index} className="card bg-blue-50 border-2 border-blue-200">
                  <h3 className="text-xl font-bold text-blue-900 mb-4">{guide.title}</h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    {guide.steps.map((step, idx) => (
                      <li key={idx} className="leading-relaxed">{step}</li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="card bg-yellow-50 border-2 border-yellow-300 mb-8">
            <div className="flex items-start space-x-4">
              <FaExclamationTriangle className="text-3xl text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-yellow-900 mb-2">Important Disclaimer</h3>
                <p className="text-yellow-800">
                  This information is for educational purposes only. In case of a medical emergency, 
                  always call 108 immediately. Do not attempt advanced medical procedures without 
                  proper training. When in doubt, seek professional medical help.
                </p>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="text-center">
            <button
              onClick={() => navigate('/home')}
              className="btn-secondary px-8 py-3"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyPage;
