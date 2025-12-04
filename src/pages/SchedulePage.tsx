import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaUserMd, FaClock, FaHospital, FaCheckCircle, FaTimesCircle, FaList } from 'react-icons/fa';
import { db, Appointment } from '../services/database';
import { useLanguage } from '../context/LanguageContext';

const SchedulePage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showAppointmentsList, setShowAppointmentsList] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);
  
  const [formData, setFormData] = useState({
    patientName: '',
    age: '',
    gender: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    specialty: '',
    doctor: '',
    reason: '',
  });

  const specialties = [
    'General Physician',
    'Pediatrician',
    'Gynecologist',
    'Cardiologist',
    'Dermatologist',
    'Orthopedic',
    'ENT Specialist',
    'Dentist',
    'Neurologist',
    'Ophthalmologist',
    'Psychiatrist',
    'Urologist',
  ];

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const allAppointments = await db.appointments.orderBy('date').reverse().toArray();
      setAppointments(allAppointments);
    } catch (error) {
      console.error('Failed to load appointments:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.patientName || !formData.age || !formData.gender || !formData.phone || 
        !formData.date || !formData.time || !formData.specialty) {
      alert(t('schedule.alertFillRequired'));
      return;
    }

    // Phone validation
    if (formData.phone.length < 10) {
      alert(t('schedule.alertPhoneInvalid'));
      return;
    }

    try {
      const newAppointment: Appointment = {
        ...formData,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const id = await db.appointments.add(newAppointment);
      const savedAppointment = await db.appointments.get(id);
      
      if (savedAppointment) {
        setConfirmedAppointment(savedAppointment);
        setShowConfirmation(true);
        await loadAppointments();
        
        // Reset form
        setFormData({
          patientName: '',
          age: '',
          gender: '',
          phone: '',
          email: '',
          date: '',
          time: '',
          specialty: '',
          doctor: '',
          reason: '',
        });
      }
    } catch (error) {
      console.error('Failed to book appointment:', error);
      alert('Failed to book appointment. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const cancelAppointment = async (id: number) => {
    if (window.confirm(t('schedule.cancelAppointment'))) {
      try {
        await db.appointments.update(id, { 
          status: 'cancelled',
          updatedAt: new Date()
        });
        await loadAppointments();
      } catch (error) {
        console.error('Failed to cancel appointment:', error);
        alert(t('common.error'));
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return '✓';
      case 'cancelled': return '✗';
      case 'completed': return '✓';
      default: return '⏱';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <FaCalendarAlt className="text-6xl text-blue-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('schedule.title')}</h1>
            <p className="text-lg text-gray-600">{t('schedule.subtitle')}</p>
            
            {appointments.length > 0 && (
              <button
                onClick={() => setShowAppointmentsList(!showAppointmentsList)}
                className="mt-4 btn-secondary px-6 py-2 flex items-center space-x-2 mx-auto"
              >
                <FaList />
                <span>{t('common.viewAppointments')} ({appointments.length})</span>
              </button>
            )}
          </div>

          {/* Appointments List */}
          {showAppointmentsList && appointments.length > 0 && (
            <div className="card mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{t('schedule.myAppointments')}</h2>
                <button
                  onClick={() => setShowAppointmentsList(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{appointment.patientName}</h3>
                        <p className="text-sm text-gray-600">{appointment.specialty}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(appointment.status)}`}>
                        {getStatusIcon(appointment.status)} {appointment.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <div>
                        <span className="text-gray-600">{t('common.date')}:</span>
                        <span className="ml-2 font-semibold">{new Date(appointment.date).toLocaleDateString('en-IN')}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">{t('common.time')}:</span>
                        <span className="ml-2 font-semibold">{appointment.time}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">{t('schedule.phone')}:</span>
                        <span className="ml-2">{appointment.phone}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">{t('common.age')}:</span>
                        <span className="ml-2">{appointment.age}</span>
                      </div>
                    </div>
                    
                    {appointment.reason && (
                      <div className="text-sm bg-gray-50 p-3 rounded mb-3">
                        <span className="font-semibold text-gray-700">{t('schedule.reasonForVisit')}:</span>
                        <p className="text-gray-600 mt-1">{appointment.reason}</p>
                      </div>
                    )}
                    
                    {appointment.status === 'pending' && (
                      <button
                        onClick={() => appointment.id && cancelAppointment(appointment.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-semibold"
                      >
                        {t('schedule.cancelAppointment')}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form */}
          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <FaUserMd className="mr-2 text-primary" />
                  {t('common.personalInfo')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('common.name')} *
                    </label>
                    <input
                      type="text"
                      name="patientName"
                      required
                      value={formData.patientName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder={t('common.name')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('common.age')} *
                    </label>
                    <input
                      type="number"
                      name="age"
                      required
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder={t('common.age')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('schedule.gender')} *
                    </label>
                    <select
                      name="gender"
                      required
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">{t('schedule.selectGender')}</option>
                      <option value="male">{t('schedule.gender.male')}</option>
                      <option value="female">{t('schedule.gender.female')}</option>
                      <option value="other">{t('schedule.gender.other')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('schedule.phone')} *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="+91-9876543210"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('schedule.emailOptional')}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
              </div>

              {/* Appointment Details */}
              <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <FaClock className="mr-2 text-primary" />
                  {t('common.appointmentDetails')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('common.date')} *
                    </label>
                    <input
                      type="date"
                      name="date"
                      required
                      value={formData.date}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('common.time')} *
                    </label>
                    <select
                      name="time"
                      required
                      value={formData.time}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">{t('schedule.selectTime')}</option>
                      <option value="09:00">09:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="14:00">02:00 PM</option>
                      <option value="15:00">03:00 PM</option>
                      <option value="16:00">04:00 PM</option>
                      <option value="17:00">05:00 PM</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('common.specialty')} *
                    </label>
                    <select
                      name="specialty"
                      required
                      value={formData.specialty}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">{t('schedule.selectSpecialty')}</option>
                      {specialties.map((specialty) => (
                        <option key={specialty} value={specialty}>
                          {specialty}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('schedule.preferredDoctorOptional')}
                    </label>
                    <input
                      type="text"
                      name="doctor"
                      value={formData.doctor}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder={t('schedule.anyAvailableDoctor')}
                    />
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <FaHospital className="mr-2 text-primary" />
                  {t('schedule.reasonForVisit')}
                </h2>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder={t('schedule.reasonPlaceholder')}
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="flex space-x-4">
                <button type="submit" className="btn-primary flex-1">
                  {t('schedule.book')}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/home')}
                  className="btn-secondary"
                >
                  {t('schedule.cancel')}
                </button>
              </div>
            </form>
          </div>

          {/* Confirmation Modal */}
          {showConfirmation && confirmedAppointment && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8">
                <div className="text-center">
                  <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('schedule.confirmedTitle')}</h2>
                  <p className="text-gray-600 mb-6">{t('schedule.confirmedSubtitle')}</p>
                  
                  <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                    <h3 className="font-bold text-lg mb-4 text-gray-900">{t('schedule.detailsTitle')}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('schedule.patient')}:</span>
                        <span className="font-semibold">{confirmedAppointment.patientName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('common.date')}:</span>
                        <span className="font-semibold">{new Date(confirmedAppointment.date).toLocaleDateString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('common.time')}:</span>
                        <span className="font-semibold">{confirmedAppointment.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('common.specialty')}:</span>
                        <span className="font-semibold">{confirmedAppointment.specialty}</span>
                      </div>
                      {confirmedAppointment.doctor && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('schedule.preferredDoctorOptional').split(' ')[0]}:</span>
                          <span className="font-semibold">{confirmedAppointment.doctor}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('schedule.phone')}:</span>
                        <span className="font-semibold">{confirmedAppointment.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('schedule.status')}:</span>
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                          {t('schedule.pending')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                    <p className="text-sm text-blue-900">
                      <strong>{t('schedule.nextStepsTitle')}</strong><br />
                      {t('schedule.nextStepsText')}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowConfirmation(false);
                        setConfirmedAppointment(null);
                      }}
                      className="flex-1 btn-primary"
                    >
                      {t('schedule.done')}
                    </button>
                    <button
                      onClick={() => {
                        setShowConfirmation(false);
                        setConfirmedAppointment(null);
                        setShowAppointmentsList(true);
                      }}
                      className="flex-1 btn-secondary"
                    >
                      {t('schedule.viewAll')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;
