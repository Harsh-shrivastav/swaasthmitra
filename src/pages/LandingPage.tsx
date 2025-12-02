import { Link } from 'react-router-dom';
import { FaHeartbeat, FaMobileAlt, FaRobot, FaBolt, FaGlobe, FaShieldAlt } from 'react-icons/fa';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 to-secondary/10 py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-primary/20 text-primary px-6 py-2 rounded-full mb-6 font-semibold">
              Healthcare that never sleeps
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
              Offline-First AI Healthcare for Rural India
            </h1>
            
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Swaasthmitra bridges the healthcare gap in underserved rural regions. 
              Get instant medical advice, emergency alerts, and resource mapping—even without internet.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/home" className="btn-primary text-lg px-8 py-3">
                Try Now
              </Link>
              <a href="#features" className="btn-secondary text-lg px-8 py-3">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section id="features" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">The Challenge & Our Solution</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Rural healthcare systems face critical gaps when frontline workers are unavailable. 
              Swaasthmitra fills that gap 24/7.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Problem Card */}
            <div className="card border-red-200 bg-red-50">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mr-4">
                  <FaHeartbeat className="text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">The Problem</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>No continuity when ASHA workers are unavailable</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Unreliable internet connectivity in rural areas</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Patients panic during emergencies without immediate guidance</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>No access to maternal care or preventive health checks</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Missed vaccinations and critical health records</span>
                </li>
              </ul>
            </div>

            {/* Solution Card */}
            <div className="card border-green-200 bg-green-50">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mr-4">
                  <FaShieldAlt className="text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Swaasthmitra's Solution</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>24/7 AI medical companion that works offline</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Voice-first interface in Hindi & English for accessibility</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Instant Red Alert system for critical emergencies</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Offline resource mapping to nearby health centers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Async appointment scheduler with auto-sync capabilities</span>
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
            <h2 className="text-4xl font-bold mb-4">Technical Architecture</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built for resilience, reliability, and real-world rural healthcare challenges.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: <FaMobileAlt />,
                title: 'Offline-First Architecture',
                description: 'All core logic runs locally. AI decision trees process symptoms without cloud dependency.',
              },
              {
                icon: <FaRobot />,
                title: 'Edge AI Model',
                description: 'Lightweight ML model optimized for rural connectivity. Gemini API for advanced analysis.',
              },
              {
                icon: <FaGlobe />,
                title: 'Voice Processing',
                description: 'Speech-to-text and text-to-speech in Hindi/English. Works offline using on-device processing.',
              },
              {
                icon: <FaBolt />,
                title: 'Async Data Sync',
                description: 'Appointments and records queued offline, auto-sync with database when connectivity returns.',
              },
              {
                icon: <FaShieldAlt />,
                title: 'Conflict Resolution',
                description: 'Handles multiple users sharing one device. Smart caching prevents duplicate entries.',
              },
              {
                icon: <FaHeartbeat />,
                title: 'Emergency Protocol',
                description: 'Red Alert instantly detects critical symptoms with immediate action paths.',
              },
            ].map((feature, index) => (
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
            <h2 className="text-4xl font-bold mb-4">Global Impact</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Transforming healthcare access in underserved regions, one village at a time.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto mb-12">
            {[
              { number: '500M+', label: 'Rural Population Reached' },
              { number: '24/7', label: 'Healthcare Continuity' },
              { number: '60%', label: 'Reduction in Wait Times' },
              { number: '0', label: 'Internet Required' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold mb-2">{stat.number}</div>
                <p className="text-lg opacity-90">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="card bg-white text-gray-900 max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">Join the Healthcare Revolution</h3>
            <p className="text-gray-600 mb-6">
              Swaasthmitra is empowering rural communities with accessible, offline-first healthcare. 
              Be part of this mission.
            </p>
            <Link to="/consultation" className="btn-primary text-lg px-8 py-3 inline-block">
              Get Started Today
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
                <span className="text-xl font-bold">Swaasthmitra</span>
              </div>
              <p className="text-gray-400">Offline-First AI Healthcare for Rural India</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#tech" className="hover:text-white">Technology</a></li>
                <li><a href="#impact" className="hover:text-white">Impact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
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
