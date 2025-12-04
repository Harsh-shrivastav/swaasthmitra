import { useNavigate } from 'react-router-dom';
import { FaAmbulance, FaPhone, FaExclamationTriangle, FaHeartbeat, FaBurn, FaBone, FaLungsVirus } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const EmergencyPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const emergencyNumbers = [
    { service: t('emergency.services.ambulance'), number: '108', icon: <FaAmbulance />, color: 'red' },
    { service: t('emergency.services.police'), number: '100', icon: <FaExclamationTriangle />, color: 'blue' },
    { service: t('emergency.services.fire'), number: '101', icon: <FaBurn />, color: 'orange' },
    { service: t('emergency.services.womenHelpline'), number: '1091', icon: <FaExclamationTriangle />, color: 'purple' },
    { service: t('emergency.services.childHelpline'), number: '1098', icon: <FaExclamationTriangle />, color: 'green' },
    { service: t('emergency.services.disaster'), number: '108', icon: <FaExclamationTriangle />, color: 'yellow' },
  ];

  const emergencyConditions = [
    {
      title: t('emergency.conditions.heart.title'),
      icon: <FaHeartbeat className="text-4xl text-red-500" />,
      symptoms: [
        t('emergency.conditions.heart.symptom1'),
        t('emergency.conditions.heart.symptom2'),
        t('emergency.conditions.heart.symptom3'),
        t('emergency.conditions.heart.symptom4'),
      ],
      action: t('emergency.conditions.heart.action')
    },
    {
      title: t('emergency.conditions.stroke.title'),
      icon: <FaLungsVirus className="text-4xl text-purple-500" />,
      symptoms: [
        t('emergency.conditions.stroke.symptom1'),
        t('emergency.conditions.stroke.symptom2'),
        t('emergency.conditions.stroke.symptom3'),
        t('emergency.conditions.stroke.symptom4'),
      ],
      action: t('emergency.conditions.stroke.action')
    },
    {
      title: t('emergency.conditions.bleeding.title'),
      icon: <FaExclamationTriangle className="text-4xl text-red-600" />,
      symptoms: [
        t('emergency.conditions.bleeding.symptom1'),
        t('emergency.conditions.bleeding.symptom2'),
        t('emergency.conditions.bleeding.symptom3'),
        t('emergency.conditions.bleeding.symptom4'),
      ],
      action: t('emergency.conditions.bleeding.action')
    },
    {
      title: t('emergency.conditions.fracture.title'),
      icon: <FaBone className="text-4xl text-orange-500" />,
      symptoms: [
        t('emergency.conditions.fracture.symptom1'),
        t('emergency.conditions.fracture.symptom2'),
        t('emergency.conditions.fracture.symptom3'),
        t('emergency.conditions.fracture.symptom4'),
      ],
      action: t('emergency.conditions.fracture.action')
    },
    {
      title: t('emergency.conditions.breathing.title'),
      icon: <FaLungsVirus className="text-4xl text-blue-500" />,
      symptoms: [
        t('emergency.conditions.breathing.symptom1'),
        t('emergency.conditions.breathing.symptom2'),
        t('emergency.conditions.breathing.symptom3'),
        t('emergency.conditions.breathing.symptom4'),
      ],
      action: t('emergency.conditions.breathing.action')
    },
    {
      title: t('emergency.conditions.poison.title'),
      icon: <FaExclamationTriangle className="text-4xl text-green-600" />,
      symptoms: [
        t('emergency.conditions.poison.symptom1'),
        t('emergency.conditions.poison.symptom2'),
        t('emergency.conditions.poison.symptom3'),
        t('emergency.conditions.poison.symptom4'),
      ],
      action: t('emergency.conditions.poison.action')
    },
  ];

  const firstAidBasics = [
    {
      title: t('emergency.cpr.title'),
      steps: [
        t('emergency.cpr.step1'),
        t('emergency.cpr.step2'),
        t('emergency.cpr.step3'),
        t('emergency.cpr.step4'),
        t('emergency.cpr.step5'),
      ],
    },
    {
      title: t('emergency.choking.title'),
      steps: [
        t('emergency.choking.step1'),
        t('emergency.choking.step2'),
        t('emergency.choking.step3'),
        t('emergency.choking.step4'),
        t('emergency.choking.step5'),
      ],
    },
    {
      title: t('emergency.burn.title'),
      steps: [
        t('emergency.burn.step1'),
        t('emergency.burn.step2'),
        t('emergency.burn.step3'),
        t('emergency.burn.step4'),
        t('emergency.burn.step5'),
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <FaAmbulance className="text-7xl text-red-600 mx-auto mb-4 animate-pulse" />
            <h1 className="text-5xl font-bold text-gray-900 mb-4">{t('emergency.title')}</h1>
            <p className="text-xl text-gray-600">{t('emergency.subtitle')}</p>
          </div>

          {/* Emergency Call Banner */}
          <div className="mb-12">
            <div className="card bg-gradient-to-r from-red-500 to-red-600 text-white text-center p-8">
              <FaAmbulance className="text-6xl mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2">{t('map.emergencyBanner.title')}</h2>
              <p className="text-xl mb-6">{t('emergency.banner.subtitle')}</p>
              <a
                href="tel:108"
                className="inline-block bg-white text-red-600 px-12 py-5 rounded-xl font-bold text-2xl hover:bg-gray-100 transition shadow-2xl"
              >
                <FaPhone className="inline mr-3" />
                {t('emergency.call108Now')}
              </a>
            </div>
          </div>

          {/* Emergency Numbers */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('emergency.numbersTitle')}</h2>
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
                    {t('emergency.callNow')}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Conditions */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('emergency.recognizeTitle')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {emergencyConditions.map((condition, index) => (
                <div key={index} className="card hover:shadow-xl transition-all">
                  <div className="flex items-center space-x-4 mb-4">
                    {condition.icon}
                    <h3 className="text-2xl font-bold text-gray-900">{condition.title}</h3>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{t('emergency.symptoms')}</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      {condition.symptoms.map((symptom, idx) => (
                        <li key={idx}>{symptom}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <h4 className="font-semibold text-red-900 mb-2">{t('emergency.whatToDo')}</h4>
                    <p className="text-red-800">{condition.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* First Aid Basics */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('emergency.firstAid')}</h2>
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
                <h3 className="text-xl font-bold text-yellow-900 mb-2">{t('emergency.disclaimerTitle')}</h3>
                <p className="text-yellow-800">{t('emergency.disclaimerText')}</p>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="text-center">
            <button
              onClick={() => navigate('/home')}
              className="btn-secondary px-8 py-3"
            >
              {t('emergency.backToHome')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyPage;
