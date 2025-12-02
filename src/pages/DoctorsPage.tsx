import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserMd, FaStar, FaPhone, FaCalendar, FaLanguage, FaSearch, FaFilter } from 'react-icons/fa';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  qualification: string;
  experience: number;
  rating: number;
  consultationFee: number;
  availability: string;
  languages: string[];
  hospital: string;
  address: string;
  phone: string;
}

const DoctorsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [sortBy, setSortBy] = useState('rating');

  const specialties = [
    'All', 'General Physician', 'Cardiologist', 'Pediatrician', 
    'Dermatologist', 'Orthopedic', 'Gynecologist', 'ENT Specialist',
    'Neurologist', 'Ophthalmologist', 'Dentist', 'Psychiatrist'
  ];

  const doctors: Doctor[] = [
    {
      id: 1,
      name: 'Dr. Rajesh Kumar',
      specialty: 'General Physician',
      qualification: 'MBBS, MD',
      experience: 15,
      rating: 4.8,
      consultationFee: 500,
      availability: 'Available Today',
      languages: ['English', 'Hindi', 'Bengali'],
      hospital: 'Apollo Hospital',
      address: 'Sector 15, Delhi',
      phone: '+91-9876543210'
    },
    {
      id: 2,
      name: 'Dr. Priya Sharma',
      specialty: 'Cardiologist',
      qualification: 'MBBS, MD, DM (Cardiology)',
      experience: 12,
      rating: 4.9,
      consultationFee: 1200,
      availability: 'Available Tomorrow',
      languages: ['English', 'Hindi'],
      hospital: 'Fortis Hospital',
      address: 'Nehru Place, Delhi',
      phone: '+91-9876543211'
    },
    {
      id: 3,
      name: 'Dr. Amit Patel',
      specialty: 'Pediatrician',
      qualification: 'MBBS, MD (Pediatrics)',
      experience: 10,
      rating: 4.7,
      consultationFee: 600,
      availability: 'Available Today',
      languages: ['English', 'Hindi', 'Gujarati'],
      hospital: 'Max Hospital',
      address: 'Saket, Delhi',
      phone: '+91-9876543212'
    },
    {
      id: 4,
      name: 'Dr. Sunita Reddy',
      specialty: 'Dermatologist',
      qualification: 'MBBS, MD (Dermatology)',
      experience: 8,
      rating: 4.6,
      consultationFee: 800,
      availability: 'Available Today',
      languages: ['English', 'Hindi', 'Telugu'],
      hospital: 'AIIMS',
      address: 'Ansari Nagar, Delhi',
      phone: '+91-9876543213'
    },
    {
      id: 5,
      name: 'Dr. Mohammed Ali',
      specialty: 'Orthopedic',
      qualification: 'MBBS, MS (Orthopedics)',
      experience: 18,
      rating: 4.9,
      consultationFee: 1000,
      availability: 'Available Today',
      languages: ['English', 'Hindi', 'Urdu'],
      hospital: 'Safdarjung Hospital',
      address: 'Ring Road, Delhi',
      phone: '+91-9876543214'
    },
    {
      id: 6,
      name: 'Dr. Kavita Iyer',
      specialty: 'Gynecologist',
      qualification: 'MBBS, MD (OB-GYN)',
      experience: 14,
      rating: 4.8,
      consultationFee: 900,
      availability: 'Available Tomorrow',
      languages: ['English', 'Hindi', 'Tamil'],
      hospital: 'Medanta Hospital',
      address: 'Gurgaon, Haryana',
      phone: '+91-9876543215'
    }
  ];

  const filteredDoctors = doctors
    .filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.hospital.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSpecialty = selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;
      return matchesSearch && matchesSpecialty;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'experience') return b.experience - a.experience;
      if (sortBy === 'fee') return a.consultationFee - b.consultationFee;
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <FaUserMd className="text-6xl text-orange-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Doctors</h1>
            <p className="text-lg text-gray-600">Search and connect with qualified doctors in your area</p>
          </div>

          {/* Search and Filters */}
          <div className="card mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search doctors, specialties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Specialty Filter */}
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
                >
                  {specialties.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="rating">Sort by Rating</option>
                <option value="experience">Sort by Experience</option>
                <option value="fee">Sort by Fee (Low to High)</option>
              </select>
            </div>
          </div>

          {/* Doctors List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredDoctors.map((doctor) => (
              <div key={doctor.id} className="card hover:shadow-2xl transition-all">
                <div className="flex items-start space-x-4">
                  {/* Doctor Avatar */}
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-4xl flex-shrink-0">
                    👨‍⚕️
                  </div>

                  {/* Doctor Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{doctor.name}</h3>
                        <p className="text-primary font-semibold">{doctor.specialty}</p>
                        <p className="text-sm text-gray-600">{doctor.qualification}</p>
                      </div>
                      <div className="flex items-center space-x-1 bg-yellow-100 px-3 py-1 rounded-full">
                        <FaStar className="text-yellow-500" />
                        <span className="font-bold text-gray-900">{doctor.rating}</span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <FaUserMd className="mr-2 text-gray-400" />
                        <span>{doctor.experience} years experience</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <FaLanguage className="mr-2 text-gray-400" />
                        <span>{doctor.languages.join(', ')}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <strong>{doctor.hospital}</strong> - {doctor.address}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">₹{doctor.consultationFee}</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          doctor.availability.includes('Today') 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {doctor.availability}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate('/schedule')}
                        className="flex-1 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-semibold transition flex items-center justify-center space-x-2"
                      >
                        <FaCalendar />
                        <span>Book Appointment</span>
                      </button>
                      <a
                        href={`tel:${doctor.phone}`}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center justify-center"
                      >
                        <FaPhone />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredDoctors.length === 0 && (
            <div className="text-center py-12">
              <FaUserMd className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-600 mb-2">No doctors found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}

          {/* Back Button */}
          <div className="mt-8 text-center">
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

export default DoctorsPage;
