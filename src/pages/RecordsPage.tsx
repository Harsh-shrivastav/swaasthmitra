import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeartbeat, FaFileMedical, FaPills, FaVial, FaAllergies, FaPlus, FaDownload, FaTrash, FaEdit, FaTimes, FaSave } from 'react-icons/fa';
import { db, HealthRecord, PersonalInfo } from '../services/database';

const RecordsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'prescriptions' | 'reports' | 'visits'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditPersonalInfo, setShowEditPersonalInfo] = useState(false);
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [editingRecord, setEditingRecord] = useState<HealthRecord | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Form state for new/edit record
  const [formData, setFormData] = useState<Partial<HealthRecord>>({
    type: 'prescription',
    title: '',
    date: new Date().toISOString().split('T')[0],
    doctor: '',
    hospital: '',
    notes: '',
    attachments: []
  });

  // Personal info state
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    bloodGroup: 'O+',
    height: '175 cm',
    weight: '70 kg',
    allergies: ['Penicillin', 'Peanuts'],
    chronicConditions: ['None'],
    emergencyContact: '+91-9876543210',
    updatedAt: new Date()
  });

  const [personalInfoForm, setPersonalInfoForm] = useState({ ...personalInfo });

  // Load data from database
  useEffect(() => {
    loadRecords();
    loadPersonalInfo();
  }, []);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const allRecords = await db.healthRecords.orderBy('date').reverse().toArray();
      
      // If no records, add sample data
      if (allRecords.length === 0) {
        const sampleRecords: HealthRecord[] = [
          {
            type: 'prescription',
            title: 'Fever Medication',
            date: '2024-11-28',
            doctor: 'Dr. Rajesh Kumar',
            hospital: 'Apollo Hospital',
            notes: 'Paracetamol 500mg - 3 times daily for 5 days',
            attachments: ['prescription_001.pdf'],
            createdAt: new Date('2024-11-28'),
            updatedAt: new Date('2024-11-28')
          },
          {
            type: 'report',
            title: 'Blood Test Results',
            date: '2024-11-25',
            doctor: 'Dr. Priya Sharma',
            hospital: 'Max Lab',
            notes: 'Complete Blood Count - All parameters normal',
            attachments: ['blood_test_report.pdf'],
            createdAt: new Date('2024-11-25'),
            updatedAt: new Date('2024-11-25')
          },
          {
            type: 'visit',
            title: 'General Checkup',
            date: '2024-11-20',
            doctor: 'Dr. Amit Patel',
            hospital: 'Fortis Hospital',
            notes: 'Routine checkup - No issues found. BP: 120/80, Weight: 70kg',
            createdAt: new Date('2024-11-20'),
            updatedAt: new Date('2024-11-20')
          }
        ];
        await db.healthRecords.bulkAdd(sampleRecords);
        setRecords(sampleRecords);
      } else {
        setRecords(allRecords);
      }
    } catch (error) {
      console.error('Failed to load records:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPersonalInfo = async () => {
    try {
      const info = await db.personalInfo.toArray();
      if (info.length > 0) {
        setPersonalInfo(info[0]);
        setPersonalInfoForm(info[0]);
      } else {
        // Save default personal info
        await db.personalInfo.add(personalInfo);
      }
    } catch (error) {
      console.error('Failed to load personal info:', error);
    }
  };

  const handleAddRecord = async () => {
    if (!formData.title || !formData.notes) {
      alert('Please fill in required fields (Title and Notes)');
      return;
    }

    try {
      const newRecord: HealthRecord = {
        ...formData as HealthRecord,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await db.healthRecords.add(newRecord);
      await loadRecords();
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error('Failed to add record:', error);
      alert('Failed to add record. Please try again.');
    }
  };

  const handleEditRecord = async () => {
    if (!editingRecord?.id || !formData.title || !formData.notes) {
      alert('Please fill in required fields');
      return;
    }

    try {
      await db.healthRecords.update(editingRecord.id, {
        ...formData,
        updatedAt: new Date()
      });
      await loadRecords();
      setEditingRecord(null);
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error('Failed to update record:', error);
      alert('Failed to update record. Please try again.');
    }
  };

  const handleDeleteRecord = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
      try {
        await db.healthRecords.delete(id);
        await loadRecords();
      } catch (error) {
        console.error('Failed to delete record:', error);
        alert('Failed to delete record. Please try again.');
      }
    }
  };

  const handleSavePersonalInfo = async () => {
    try {
      if (personalInfo.id) {
        await db.personalInfo.update(personalInfo.id, {
          ...personalInfoForm,
          updatedAt: new Date()
        });
      } else {
        await db.personalInfo.add({
          ...personalInfoForm,
          updatedAt: new Date()
        });
      }
      setPersonalInfo(personalInfoForm);
      setShowEditPersonalInfo(false);
    } catch (error) {
      console.error('Failed to save personal info:', error);
      alert('Failed to save personal info. Please try again.');
    }
  };

  const openEditModal = (record: HealthRecord) => {
    setEditingRecord(record);
    setFormData({
      type: record.type,
      title: record.title,
      date: record.date,
      doctor: record.doctor,
      hospital: record.hospital,
      notes: record.notes,
      attachments: record.attachments
    });
    setShowAddModal(true);
  };

  const resetForm = () => {
    setFormData({
      type: 'prescription',
      title: '',
      date: new Date().toISOString().split('T')[0],
      doctor: '',
      hospital: '',
      notes: '',
      attachments: []
    });
    setEditingRecord(null);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingRecord(null);
    resetForm();
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
                <button 
                  onClick={() => setShowEditPersonalInfo(true)}
                  className="w-full mt-4 btn-secondary py-2 flex items-center justify-center space-x-2"
                >
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

              {/* Loading State */}
              {loading && (
                <div className="text-center py-12">
                  <div className="animate-spin text-6xl text-primary mx-auto mb-4">⏳</div>
                  <p className="text-gray-600">Loading records...</p>
                </div>
              )}

              {/* Records */}
              {!loading && (
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
                        <button 
                          onClick={() => openEditModal(record)}
                          className="text-blue-500 hover:text-blue-700 p-2"
                          title="Edit record"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => record.id && handleDeleteRecord(record.id)}
                          className="text-red-500 hover:text-red-700 p-2"
                          title="Delete record"
                        >
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
              )}

              {!loading && filteredRecords.length === 0 && (
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

          {/* Add/Edit Record Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
              <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 my-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingRecord ? 'Edit Record' : 'Add New Record'}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700 text-3xl leading-none"
                  >
                    <FaTimes />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {/* Type Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Record Type *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="prescription">Prescription</option>
                      <option value="report">Medical Report</option>
                      <option value="visit">Doctor Visit</option>
                      <option value="vaccination">Vaccination</option>
                    </select>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Blood Test Results"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  {/* Doctor */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Doctor Name
                    </label>
                    <input
                      type="text"
                      value={formData.doctor || ''}
                      onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                      placeholder="e.g., Dr. Rajesh Kumar"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  {/* Hospital */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Hospital/Clinic
                    </label>
                    <input
                      type="text"
                      value={formData.hospital || ''}
                      onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                      placeholder="e.g., Apollo Hospital"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Notes *
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Detailed notes about this record..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    />
                  </div>

                  {/* File Upload Placeholder */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Attachments
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <FaFileMedical className="text-4xl text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">File upload coming soon...</p>
                      <p className="text-xs text-gray-400 mt-1">PDF, Images (JPG, PNG)</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={closeModal}
                      className="flex-1 btn-secondary py-3 flex items-center justify-center space-x-2"
                    >
                      <FaTimes />
                      <span>Cancel</span>
                    </button>
                    <button
                      onClick={editingRecord ? handleEditRecord : handleAddRecord}
                      className="flex-1 btn-primary py-3 flex items-center justify-center space-x-2"
                    >
                      <FaSave />
                      <span>{editingRecord ? 'Update' : 'Save'} Record</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edit Personal Info Modal */}
          {showEditPersonalInfo && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
              <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 my-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Edit Personal Information</h2>
                  <button
                    onClick={() => setShowEditPersonalInfo(false)}
                    className="text-gray-500 hover:text-gray-700 text-3xl leading-none"
                  >
                    <FaTimes />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Blood Group</label>
                    <select
                      value={personalInfoForm.bloodGroup}
                      onChange={(e) => setPersonalInfoForm({ ...personalInfoForm, bloodGroup: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Height</label>
                      <input
                        type="text"
                        value={personalInfoForm.height}
                        onChange={(e) => setPersonalInfoForm({ ...personalInfoForm, height: e.target.value })}
                        placeholder="e.g., 175 cm"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Weight</label>
                      <input
                        type="text"
                        value={personalInfoForm.weight}
                        onChange={(e) => setPersonalInfoForm({ ...personalInfoForm, weight: e.target.value })}
                        placeholder="e.g., 70 kg"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Allergies (comma-separated)</label>
                    <input
                      type="text"
                      value={personalInfoForm.allergies.join(', ')}
                      onChange={(e) => setPersonalInfoForm({ 
                        ...personalInfoForm, 
                        allergies: e.target.value.split(',').map(a => a.trim()).filter(a => a) 
                      })}
                      placeholder="e.g., Penicillin, Peanuts"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Chronic Conditions (comma-separated)</label>
                    <input
                      type="text"
                      value={personalInfoForm.chronicConditions.join(', ')}
                      onChange={(e) => setPersonalInfoForm({ 
                        ...personalInfoForm, 
                        chronicConditions: e.target.value.split(',').map(c => c.trim()).filter(c => c) 
                      })}
                      placeholder="e.g., Diabetes, Hypertension"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Emergency Contact</label>
                    <input
                      type="tel"
                      value={personalInfoForm.emergencyContact}
                      onChange={(e) => setPersonalInfoForm({ ...personalInfoForm, emergencyContact: e.target.value })}
                      placeholder="+91-9876543210"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setShowEditPersonalInfo(false)}
                      className="flex-1 btn-secondary py-3"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSavePersonalInfo}
                      className="flex-1 btn-primary py-3 flex items-center justify-center space-x-2"
                    >
                      <FaSave />
                      <span>Save Changes</span>
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

export default RecordsPage;
