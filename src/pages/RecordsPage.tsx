import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeartbeat, FaFileMedical, FaPills, FaVial, FaAllergies, FaPlus, FaDownload, FaTrash, FaEdit } from 'react-icons/fa';

interface HealthRecord {
  id: number;
  type: 'prescription' | 'report' | 'visit' | 'vaccination';
  title: string;
  date: string;
  doctor?: string;
  hospital?: string;
  notes: string;
  attachments?: string[];
}

const RecordsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'prescriptions' | 'reports' | 'visits'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const records: HealthRecord[] = [
    {
      id: 1,
      type: 'prescription',
      title: 'Fever Medication',
      date: '2024-11-28',
      doctor: 'Dr. Rajesh Kumar',
      hospital: 'Apollo Hospital',
      notes: 'Paracetamol 500mg - 3 times daily for 5 days',
      attachments: ['prescription_001.pdf']
    },
    {
      id: 2,
      type: 'report',
      title: 'Blood Test Results',
      date: '2024-11-25',
      doctor: 'Dr. Priya Sharma',
      hospital: 'Max Lab',
      notes: 'Complete Blood Count - All parameters normal',
      attachments: ['blood_test_report.pdf']
    },
    {
      id: 3,
      type: 'visit',
      title: 'General Checkup',
      date: '2024-11-20',
      doctor: 'Dr. Amit Patel',
      hospital: 'Fortis Hospital',
      notes: 'Routine checkup - No issues found. BP: 120/80, Weight: 70kg',
    },
    {
      id: 4,
      type: 'vaccination',
      title: 'COVID-19 Booster',
      date: '2024-10-15',
      hospital: 'Government Health Center',
      notes: 'COVID-19 vaccine booster dose administered',
      attachments: ['vaccine_certificate.pdf']
    },
  ];

  const personalInfo = {
    bloodGroup: 'O+',
    height: '175 cm',
    weight: '70 kg',
    allergies: ['Penicillin', 'Peanuts'],
    chronicConditions: ['None'],
    emergencyContact: '+91-9876543210'
  };

  const filteredRecords = activeTab === 'all' 
    ? records 
    : records.filter(r => {
        if (activeTab === 'prescriptions') return r.type === 'prescription';
        if (activeTab === 'reports') return r.type === 'report';
        if (activeTab === 'visits') return r.type === 'visit';
        return true;
      });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'prescription': return <FaPills className="text-blue-500" />;
      case 'report': return <FaVial className="text-purple-500" />;
      case 'visit': return <FaFileMedical className="text-green-500" />;
      case 'vaccination': return <FaAllergies className="text-orange-500" />;
      default: return <FaFileMedical />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'prescription': return 'bg-blue-100 text-blue-800';
      case 'report': return 'bg-purple-100 text-purple-800';
      case 'visit': return 'bg-green-100 text-green-800';
      case 'vaccination': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <FaHeartbeat className="text-6xl text-teal-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Health Records</h1>
            <p className="text-lg text-gray-600">Securely store and access your medical records</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Personal Health Info */}
            <div className="lg:col-span-1">
              <div className="card mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Personal Info</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">Blood Group</span>
                    <span className="font-bold text-red-600">{personalInfo.bloodGroup}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">Height</span>
                    <span className="font-semibold">{personalInfo.height}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">Weight</span>
                    <span className="font-semibold">{personalInfo.weight}</span>
                  </div>
                  <div className="py-2">
                    <span className="text-gray-600 block mb-2">Allergies</span>
                    <div className="flex flex-wrap gap-2">
                      {personalInfo.allergies.map((allergy, idx) => (
                        <span key={idx} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="py-2">
                    <span className="text-gray-600 block mb-2">Emergency Contact</span>
                    <a href={`tel:${personalInfo.emergencyContact}`} className="text-primary font-semibold">
                      {personalInfo.emergencyContact}
                    </a>
                  </div>
                </div>
                <button className="w-full mt-4 btn-secondary py-2 flex items-center justify-center space-x-2">
                  <FaEdit />
                  <span>Edit Info</span>
                </button>
              </div>

              {/* Quick Stats */}
              <div className="card">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Records</span>
                    <span className="font-bold text-2xl text-primary">{records.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Prescriptions</span>
                    <span className="font-bold text-xl">{records.filter(r => r.type === 'prescription').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Reports</span>
                    <span className="font-bold text-xl">{records.filter(r => r.type === 'report').length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Records List */}
            <div className="lg:col-span-2">
              {/* Tabs and Add Button */}
              <div className="card mb-6">
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setActiveTab('all')}
                      className={`px-4 py-2 rounded-lg font-semibold transition ${
                        activeTab === 'all' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      All Records
                    </button>
                    <button
                      onClick={() => setActiveTab('prescriptions')}
                      className={`px-4 py-2 rounded-lg font-semibold transition ${
                        activeTab === 'prescriptions' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Prescriptions
                    </button>
                    <button
                      onClick={() => setActiveTab('reports')}
                      className={`px-4 py-2 rounded-lg font-semibold transition ${
                        activeTab === 'reports' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Reports
                    </button>
                    <button
                      onClick={() => setActiveTab('visits')}
                      className={`px-4 py-2 rounded-lg font-semibold transition ${
                        activeTab === 'visits' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Visits
                    </button>
                  </div>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <FaPlus />
                    <span>Add Record</span>
                  </button>
                </div>
              </div>

              {/* Records */}
              <div className="space-y-4">
                {filteredRecords.map((record) => (
                  <div key={record.id} className="card hover:shadow-xl transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="text-3xl mt-1">
                          {getTypeIcon(record.type)}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{record.title}</h3>
                          <div className="flex items-center space-x-3 mt-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(record.type)}`}>
                              {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
                            </span>
                            <span className="text-sm text-gray-500">{new Date(record.date).toLocaleDateString('en-IN')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-blue-500 hover:text-blue-700 p-2">
                          <FaEdit />
                        </button>
                        <button className="text-red-500 hover:text-red-700 p-2">
                          <FaTrash />
                        </button>
                      </div>
                    </div>

                    {record.doctor && (
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>Doctor:</strong> {record.doctor}
                      </div>
                    )}
                    {record.hospital && (
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>Hospital:</strong> {record.hospital}
                      </div>
                    )}
                    <div className="text-gray-700 mb-4">
                      {record.notes}
                    </div>

                    {record.attachments && record.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {record.attachments.map((attachment, idx) => (
                          <button
                            key={idx}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 text-sm font-semibold transition"
                          >
                            <FaDownload />
                            <span>{attachment}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {filteredRecords.length === 0 && (
                <div className="text-center py-12 card">
                  <FaFileMedical className="text-6xl text-gray-300 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-600 mb-2">No records found</h3>
                  <p className="text-gray-500 mb-4">Start adding your health records to keep track of your medical history</p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="btn-primary"
                  >
                    <FaPlus className="inline mr-2" />
                    Add First Record
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/home')}
              className="btn-secondary px-8 py-3"
            >
              Back to Home
            </button>
          </div>

          {/* Add Record Modal Placeholder */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Add New Record</h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>
                <p className="text-gray-600 text-center py-8">
                  Record upload form coming soon...
                </p>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-full btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecordsPage;
