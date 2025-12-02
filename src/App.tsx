import { Routes, Route } from 'react-router-dom';
import { ConsultationProvider } from './context/ConsultationContext';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import ConsultationPage from './pages/ConsultationPage';
import SchedulePage from './pages/SchedulePage';
import MapPage from './pages/MapPage';
import Header from './components/Header';

function App() {
  return (
    <ConsultationProvider>
      <div className="min-h-screen">
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/consultation" element={<ConsultationPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/map" element={<MapPage />} />
        </Routes>
      </div>
    </ConsultationProvider>
  );
}

export default App;
