import { Link } from 'react-router-dom';
import { FaStethoscope, FaCalendarAlt, FaMapMarkedAlt, FaUserMd, FaAmbulance, FaHeartbeat, FaVideo } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const HomePage = () => {
  const { t } = useLanguage();
  const features = [
    {
      id: 'consultation',
      title: t('home.consultation'),
      description: t('home.consultation.desc'),
      icon: <FaStethoscope className="text-5xl" />,
      color: 'from-green-500 to-emerald-600',
      link: '/consultation',
    },
    {
      id: 'schedule',
      title: t('home.schedule'),
      description: t('home.schedule.desc'),
      icon: <FaCalendarAlt className="text-5xl" />,
      color: 'from-blue-500 to-cyan-600',
      link: '/schedule',
    },
    {
      id: 'map',
      title: t('home.map'),
      description: t('home.map.desc'),
      icon: <FaMapMarkedAlt className="text-5xl" />,
      color: 'from-purple-500 to-pink-600',
      link: '/map',
    },
    {
      id: 'doctors',
      title: t('home.doctors'),
      description: t('home.doctors.desc'),
      icon: <FaUserMd className="text-5xl" />,
      color: 'from-orange-500 to-red-600',
      link: '/doctors',
    },
    {
      id: 'emergency',
      title: t('home.emergency'),
      description: t('home.emergency.desc'),
      icon: <FaAmbulance className="text-5xl" />,
      color: 'from-red-500 to-rose-600',
      link: '/emergency',
    },
    {
      id: 'health-records',
      title: t('home.records'),
      description: t('home.records.desc'),
      icon: <FaHeartbeat className="text-5xl" />,
      color: 'from-teal-500 to-green-600',
      link: '/records',
    },
    {
      id: 'video-consult',
      title: t('video.title'),
      description: t('video.subtitle'),
      icon: <FaVideo className="text-5xl" />,
      color: 'from-indigo-500 to-blue-600',
      link: '/video-consult',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {t('home.title')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-8">
            {t('home.subtitle')}
          </p>
          <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-6 py-3 rounded-full">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            <span className="font-semibold">Available Offline</span>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature) => (
            <Link
              key={feature.id}
              to={feature.link}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              {/* Content */}
              <div className="relative p-8">
                {/* Icon */}
                <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${feature.color} text-white flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-4">
                  {feature.description}
                </p>

                {/* Action */}
                <div className="flex items-center text-primary font-semibold group-hover:text-primary-dark transition-colors">
                  <span>Get Started</span>
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Emergency Banner */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl shadow-2xl p-8 text-white text-center">
            <div className="flex items-center justify-center mb-4">
              <FaAmbulance className="text-5xl" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Medical Emergency?</h2>
            <p className="text-lg mb-6 opacity-90">
              Call 108 for immediate ambulance service across India
            </p>
            <a
              href="tel:108"
              className="inline-block bg-white text-red-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              📞 Call 108 Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
