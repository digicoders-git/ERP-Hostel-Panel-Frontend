import { useState } from 'react';
import toast from 'react-hot-toast';
import { FaUserTie, FaPlus, FaEdit, FaTrash, FaPhone, FaEnvelope, FaMapMarkerAlt, FaBuilding, FaCheckCircle, FaTimesCircle, FaSearch } from 'react-icons/fa';

const WardenManagement = ({ onNavigate }) => {
  const [wardens, setWardens] = useState([
    { 
      id: 1, 
      name: 'Mr. Rajesh Kumar', 
      phone: '+91 9876543210', 
      email: 'rajesh.kumar@hostel.com',
      address: '123 Main Street, Delhi',
      hostel: 'Boys Hostel A',
      experience: '5 years',
      status: 'Active',
      joinDate: '2019-01-15'
    },
    { 
      id: 2, 
      name: 'Mrs. Priya Sharma', 
      phone: '+91 9876543211', 
      email: 'priya.sharma@hostel.com',
      address: '456 Park Avenue, Mumbai',
      hostel: 'Girls Hostel B',
      experience: '3 years',
      status: 'Active',
      joinDate: '2021-03-20'
    },
    { 
      id: 3, 
      name: 'Mr. Suresh Patel', 
      phone: '+91 9876543212', 
      email: 'suresh.patel@hostel.com',
      address: '789 Garden Road, Pune',
      hostel: 'Boys Hostel B',
      experience: '7 years',
      status: 'Inactive',
      joinDate: '2017-08-10'
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    hostel: '',
    experience: '',
    joinDate: ''
  });

  const hostels = ['Boys Hostel A', 'Boys Hostel B', 'Girls Hostel A', 'Girls Hostel B'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setWardens(prev => prev.map(warden => 
        warden.id === editingId ? { ...formData, id: editingId, status: 'Active' } : warden
      ));
      toast.success('Warden updated successfully!');
    } else {
      setWardens(prev => [...prev, { ...formData, id: Date.now(), status: 'Active' }]);
      toast.success('Warden added successfully!');
    }
    resetForm();
    setTimeout(() => {
      onNavigate('wardenManagement');
    }, 1500);
  };

  const resetForm = () => {
    setFormData({ name: '', phone: '', email: '', address: '', hostel: '', experience: '', joinDate: '' });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (warden) => {
    setFormData(warden);
    setEditingId(warden.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setWardens(prev => prev.filter(warden => warden.id !== id));
  };

  const handleStatusToggle = (id) => {
    setWardens(prev => prev.map(warden => 
      warden.id === id ? { ...warden, status: warden.status === 'Active' ? 'Inactive' : 'Active' } : warden
    ));
  };

  const filteredWardens = wardens.filter(warden => 
    warden.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warden.hostel.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warden.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center">
                  <FaUserTie className="mr-3" />
                  Warden Management
                </h1>
                <p className="text-indigo-100 mt-2">Manage hostel wardens and their assignments</p>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center space-x-2"
              >
                <FaPlus />
                <span>Add Warden</span>
              </button>
            </div>
          </div>

          <div className="p-8">
            <div className="mb-6">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search wardens by name, hostel, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWardens.map((warden) => (
                <div key={warden.id} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {warden.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{warden.name}</h3>
                        <p className="text-sm text-gray-600">{warden.hostel}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(warden)}
                        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(warden.id)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <FaPhone className="text-gray-400" />
                      <span className="text-gray-700">{warden.phone}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <FaEnvelope className="text-gray-400" />
                      <span className="text-gray-700 text-sm">{warden.email}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <FaMapMarkerAlt className="text-gray-400" />
                      <span className="text-gray-700 text-sm">{warden.address}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <FaBuilding className="text-gray-400" />
                      <span className="text-gray-700">{warden.hostel}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-600">Experience: {warden.experience}</span>
                      <div className="flex items-center space-x-2">
                        {warden.status === 'Active' ? (
                          <FaCheckCircle className="text-green-500" />
                        ) : (
                          <FaTimesCircle className="text-red-500" />
                        )}
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          warden.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {warden.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Joined: {new Date(warden.joinDate).toLocaleDateString()}</span>
                      <button
                        onClick={() => handleStatusToggle(warden.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          warden.status === 'Active'
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {warden.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                <h2 className="text-2xl font-bold text-white">
                  {editingId ? 'Edit Warden' : 'Add New Warden'}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto scrollbar-hide">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter full name"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 9876543210"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="email@example.com"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Assigned Hostel</label>
                    <select
                      name="hostel"
                      value={formData.hostel}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                      required
                    >
                      <option value="">Select Hostel</option>
                      {hostels.map(hostel => (
                        <option key={hostel} value={hostel}>{hostel}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Experience</label>
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      placeholder="e.g., 5 years"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Join Date</label>
                    <input
                      type="date"
                      name="joinDate"
                      value={formData.joinDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Complete address"
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition resize-none"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    {editingId ? 'Update' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WardenManagement;