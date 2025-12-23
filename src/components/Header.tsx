import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FaBars, FaTimes, FaGlobe } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();

  const navLinks = [
    { name: t('header.features'), href: '/#features' },
    { name: t('header.technology'), href: '/#tech' },
    { name: t('header.impact'), href: '/#impact' },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="Logo" className="w-10 h-10" />
            <span className="text-2xl font-bold text-primary">{t('header.appName')}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-700 hover:text-primary transition-colors"
              >
                {link.name}
              </a>
            ))}
            
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg"
              title="Toggle Language"
            >
              <FaGlobe className="text-sm" />
              <span className="text-sm font-medium">{language === 'en' ? 'हिं' : 'EN'}</span>
            </button>

            <Link to="/consultation" className="btn-primary">
              {t('header.startConsultation')}
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block text-gray-700 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            
            {/* Mobile Language Toggle */}
            <button
              onClick={() => {
                toggleLanguage();
                setIsMenuOpen(false);
              }}
              className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg w-full"
            >
              <FaGlobe className="text-sm" />
              <span className="text-sm font-medium">
                {language === 'en' ? 'Switch to Hindi' : 'अंग्रेजी में बदलें'}
              </span>
            </button>

            <Link
              to="/consultation"
              className="block btn-primary text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('header.startConsultation')}
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
