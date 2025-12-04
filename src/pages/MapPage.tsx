import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import { FaMapMarkedAlt, FaHospital, FaClinicMedical, FaPills, FaAmbulance, FaSearch, FaLocationArrow } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

interface HealthcareFacility {
  id: number;
  name: string;
  type: 'hospital' | 'clinic' | 'pharmacy' | 'ambulance';
  address: string;
  distance: string;
  phone: string;
  available: boolean;
  lat: number;
  lng: number;
}

// Component to fly to selected location
function ChangeView({ center, zoom }: { center: LatLngExpression; zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

const MapPage = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedFacility, setSelectedFacility] = useState<number | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number]>([20.5937, 78.9629]); // Default: Center of India

  const facilities: HealthcareFacility[] = [
    {
      id: 1,
      name: 'District Hospital',
      type: 'hospital',
      address: 'Main Road, District Center',
      distance: '2.5 km',
      phone: '0123-456789',
      available: true,
      lat: 20.5937,
      lng: 78.9629,
    },
    {
      id: 2,
      name: 'Primary Health Center',
      type: 'clinic',
      address: 'Village Center, Near Post Office',
      distance: '1.2 km',
      phone: '0123-456790',
      available: true,
      lat: 20.6,
      lng: 78.97,
    },
    {
      id: 3,
      name: 'MedPlus Pharmacy',
      type: 'pharmacy',
      address: 'Market Street, Shop No. 12',
      distance: '0.8 km',
      phone: '0123-456791',
      available: true,
      lat: 20.585,
      lng: 78.955,
    },
    {
      id: 4,
      name: 'Apollo Clinic',
      type: 'clinic',
      address: 'Station Road, Near Bus Stand',
      distance: '3.1 km',
      phone: '0123-456792',
      available: true,
      lat: 20.61,
      lng: 78.98,
    },
    {
      id: 5,
      name: 'GVK Emergency Services',
      type: 'ambulance',
      address: 'Emergency Response Unit',
      distance: '1.5 km',
      phone: '108',
      available: true,
      lat: 20.588,
      lng: 78.968,
    },
    {
      id: 6,
      name: 'Jan Aushadhi Kendra',
      type: 'pharmacy',
      address: 'Gandhi Chowk, Near Bank',
      distance: '1.8 km',
      phone: '0123-456793',
      available: true,
      lat: 20.595,
      lng: 78.96,
    },
  ];

  // Custom icons for different facility types
  const getMarkerIcon = (type: string) => {
    const iconColors: Record<string, string> = {
      hospital: '🏥',
      clinic: '🏨',
      pharmacy: '💊',
      ambulance: '🚑',
    };

    return new Icon({
      iconUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><text x="50%" y="50%" font-size="24" text-anchor="middle" dominant-baseline="middle">${iconColors[type] || '📍'}</text></svg>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'hospital':
        return <FaHospital className="text-red-500" />;
      case 'clinic':
        return <FaClinicMedical className="text-blue-500" />;
      case 'pharmacy':
        return <FaPills className="text-green-500" />;
      case 'ambulance':
        return <FaAmbulance className="text-orange-500" />;
      default:
        return <FaMapMarkedAlt />;
    }
  };

  const filteredFacilities = facilities.filter((facility) => {
    const matchesSearch = facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          facility.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || facility.type === selectedType;
    return matchesSearch && matchesType;
  });

  const mapCenter: LatLngExpression = selectedFacility
    ? [
        facilities.find((f) => f.id === selectedFacility)?.lat || userLocation[0],
        facilities.find((f) => f.id === selectedFacility)?.lng || userLocation[1],
      ]
    : userLocation;

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          alert('Location updated!');
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Using default location.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleFacilityClick = (facilityId: number) => {
    setSelectedFacility(facilityId);
  };

  const getDirections = (facility: HealthcareFacility) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${facility.lat},${facility.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <FaMapMarkedAlt className="text-6xl text-purple-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('map.title')}</h1>
            <p className="text-lg text-gray-600">{t('map.subtitle')}</p>
          </div>

          {/* Search and Filter */}
          <div className="card mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('common.searchLocation')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Filter */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">{t('common.allTypes')}</option>
                <option value="hospital">{t('map.hospitals')}</option>
                <option value="clinic">{t('map.clinics')}</option>
                <option value="pharmacy">{t('map.pharmacies')}</option>
                <option value="ambulance">Ambulance</option>
              </select>

              {/* Get Location Button */}
              <button
                onClick={handleGetLocation}
                className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
              >
                <FaLocationArrow />
                <span>{t('common.myLocation')}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map */}
            <div className="lg:col-span-2">
              <div className="card p-0 overflow-hidden h-[600px]">
                <MapContainer
                  center={userLocation}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                  className="rounded-xl"
                >
                  <ChangeView center={mapCenter} zoom={selectedFacility ? 15 : 13} />
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {/* User Location Marker */}
                  <Marker position={userLocation}>
                    <Popup>
                      <div className="text-center">
                        <strong>Your Location</strong>
                      </div>
                    </Popup>
                  </Marker>

                  {/* Facility Markers */}
                  {filteredFacilities.map((facility) => (
                    <Marker
                      key={facility.id}
                      position={[facility.lat, facility.lng]}
                      icon={getMarkerIcon(facility.type)}
                      eventHandlers={{
                        click: () => handleFacilityClick(facility.id),
                      }}
                    >
                      <Popup>
                        <div className="p-2 min-w-[200px]">
                          <div className="flex items-center mb-2">
                            <div className="text-2xl mr-2">{getIcon(facility.type)}</div>
                            <div>
                              <h3 className="font-bold text-lg">{facility.name}</h3>
                              <p className="text-xs text-gray-500 capitalize">{facility.type}</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{facility.address}</p>
                          <div className="flex flex-col space-y-2">
                            <a
                              href={`tel:${facility.phone}`}
                              className="bg-blue-500 text-white px-3 py-1 rounded text-sm text-center hover:bg-blue-600"
                            >
                              📞 {facility.phone}
                            </a>
                            <button
                              onClick={() => getDirections(facility)}
                              className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                            >
                              🧭 {t('common.directions')}
                            </button>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>

            {/* Facilities List */}
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-900 sticky top-0 bg-gray-50 py-2">
                {filteredFacilities.length} {t('common.facilitiesFound')}
              </h2>

              {filteredFacilities.map((facility) => (
                <div
                  key={facility.id}
                  onClick={() => handleFacilityClick(facility.id)}
                  className={`card hover:shadow-xl transition-all cursor-pointer ${
                    selectedFacility === facility.id ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Icon */}
                    <div className="text-3xl mt-1">
                      {getIcon(facility.type)}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 truncate">{facility.name}</h3>
                          <p className="text-xs text-gray-500 capitalize">{facility.type}</p>
                        </div>
                        <span className="bg-primary text-white px-2 py-1 rounded-full text-xs font-semibold ml-2">
                          {facility.distance}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">{facility.address}</p>

                      <div className="flex flex-col gap-2">
                        <a
                          href={`tel:${facility.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-semibold transition-colors text-center"
                        >
                          📞 {facility.phone}
                        </a>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            getDirections(facility);
                          }}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-semibold transition-colors"
                        >
                          🧭 Directions
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Banner */}
          <div className="mt-8 card bg-red-50 border-2 border-red-200">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <FaAmbulance className="text-5xl text-red-600" />
                <div>
                  <h3 className="text-2xl font-bold text-red-900">{t('map.emergencyBanner.title')}</h3>
                  <p className="text-red-700">{t('map.emergencyBanner.subtitle')}</p>
                </div>
              </div>
              <a
                href="tel:108"
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors"
              >
                📞 Call 108
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
