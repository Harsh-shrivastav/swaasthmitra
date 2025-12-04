import { Link } from 'react-router-dom';
import { FaHeartbeat, FaMobileAlt, FaRobot, FaBolt, FaGlobe, FaShieldAlt } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const LandingPage = () => {
  const { t } = useLanguage();

  const techFeatures = [
    {
      icon: <FaMobileAlt />,
      title: t('landing.tech.offline.title'),
      description: t('landing.tech.offline.desc'),
    },
    {
      icon: <FaRobot />,
      title: t('landing.tech.edgeai.title'),
      description: t('landing.tech.edgeai.desc'),
    },
    {
      icon: <FaGlobe />,
      title: t('landing.tech.voice.title'),
      description: t('landing.tech.voice.desc'),
    },
    {
      icon: <FaBolt />,
      title: t('landing.tech.async.title'),
      description: t('landing.tech.async.desc'),
    },
    {
      icon: <FaShieldAlt />,
      title: t('landing.tech.conflict.title'),
      description: t('landing.tech.conflict.desc'),
    },
    {
      icon: <FaHeartbeat />,
      title: t('landing.tech.emergency.title'),
      description: t('landing.tech.emergency.desc'),
    },
  ];
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 to-secondary/10 py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-primary/20 text-primary px-6 py-2 rounded-full mb-6 font-semibold">
              {t('landing.hero.tagline')}
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
              {t('landing.hero.title')}
            </h1>
            
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              {t('landing.hero.description')}
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/home" className="btn-primary text-lg px-8 py-3">
                {t('landing.hero.tryNow')}
              </Link>
              <a href="#features" className="btn-secondary text-lg px-8 py-3">
                {t('landing.hero.learnMore')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section id="features" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">{t('landing.features.title')}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('landing.features.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Problem Card */}
            <div className="card border-red-200 bg-red-50">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mr-4">
                  <FaHeartbeat className="text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{t('landing.problem.title')}</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>{t('landing.problem.point1')}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>{t('landing.problem.point2')}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>{t('landing.problem.point3')}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>{t('landing.problem.point4')}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>{t('landing.problem.point5')}</span>
                </li>
              </ul>
            </div>

            {/* Solution Card */}
            <div className="card border-green-200 bg-green-50">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mr-4">
                  <FaShieldAlt className="text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{t('landing.solution.title')}</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>{t('landing.solution.point1')}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>{t('landing.solution.point2')}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>{t('landing.solution.point3')}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>{t('landing.solution.point4')}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>{t('landing.solution.point5')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section id="tech" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">{t('landing.tech.title')}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('landing.tech.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {techFeatures.map((feature, index) => (
              <div key={index} className="card text-center">
                <div className="text-5xl text-primary mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-20 px-4 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">{t('landing.impact.title')}</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              {t('landing.impact.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto mb-12">
            {[
              { number: '500M+', labelKey: 'landing.impact.ruralPopulation' },
              { number: '24/7', labelKey: 'landing.impact.healthcareContinuity' },
              { number: '60%', labelKey: 'landing.impact.reductionWait' },
              { number: '0', labelKey: 'landing.impact.internetRequired' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold mb-2">{stat.number}</div>
                <p className="text-lg opacity-90">{t(stat.labelKey)}</p>
              </div>
            ))}
          </div>

          <div className="card bg-white text-gray-900 max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">{t('landing.cta.title')}</h3>
            <p className="text-gray-600 mb-6">
              {t('landing.cta.description')}
            </p>
            <Link to="/consultation" className="btn-primary text-lg px-8 py-3 inline-block">
              {t('landing.cta.button')}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src="/logo.png" alt="Logo" className="w-8 h-8" />
                <span className="text-xl font-bold">{t('header.appName')}</span>
              </div>
              <p className="text-gray-400">{t('landing.footer.tagline')}</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">{t('landing.footer.sections.product')}</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white">{t('landing.footer.links.features')}</a></li>
                <li><a href="#tech" className="hover:text-white">{t('landing.footer.links.tech')}</a></li>
                <li><a href="#impact" className="hover:text-white">{t('landing.footer.links.impact')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">{t('landing.footer.sections.company')}</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">{t('landing.footer.links.about')}</a></li>
                <li><a href="#" className="hover:text-white">{t('landing.footer.links.blog')}</a></li>
                <li><a href="#" className="hover:text-white">{t('landing.footer.links.careers')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">{t('landing.footer.sections.legal')}</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">{t('landing.footer.links.privacy')}</a></li>
                <li><a href="#" className="hover:text-white">{t('landing.footer.links.terms')}</a></li>
                <li><a href="#" className="hover:text-white">{t('landing.footer.links.contact')}</a></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-gray-400 pt-8 border-t border-gray-800">
            © 2025 Swaasthmitra. Making healthcare accessible for all.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
