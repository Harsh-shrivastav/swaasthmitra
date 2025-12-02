import { Routes, Route } from 'react-router-dom';
import { ConsultationProvider } from './context/ConsultationContext';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import ConsultationPage from './pages/ConsultationPage';
import SchedulePage from './pages/SchedulePage';
import MapPage from './pages/MapPage';
import DoctorsPage from './pages/DoctorsPage';
import EmergencyPage from './pages/EmergencyPage';
import RecordsPage from './pages/RecordsPage';
import Header from './components/Header';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <ConsultationProvider>
      <div className="min-h-screen">
        <ScrollToTop />
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/consultation" element={<ConsultationPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/emergency" element={<EmergencyPage />} />
          <Route path="/records" element={<RecordsPage />} />
        </Routes>
      </div>
    </ConsultationProvider>
  );
}

export default App;
