import { useState } from 'react';
import toast from 'react-hot-toast';
import { FaClipboardList, FaPlus, FaEdit, FaTrash, FaUser, FaBed, FaCalendar, FaSearch, FaFilter, FaCheckCircle } from 'react-icons/fa';

const HostelAllocation = ({ onNavigate }) => {
  const [allocations, setAllocations] = useState([
    { 
      id: 1, 
      studentName: 'Rahul Kumar', 
      studentId: 'STU001', 
      phone: '+91 9876543210',
      roomNo: '101', 
      hostel: 'Boys Hostel A', 
      roomType: 'Single AC',
      allocatedDate: '2024-01-15',
      rent: 8000,
      status: 'Active'
    },
    { 
      id: 2, 
      studentName: 'Priya Sharma', 
      studentId: 'STU002', 
      phone: '+91 9876543211',
      roomNo: '202', 
      hostel: 'Girls Hostel B', 
      roomType: 'Double Sharing AC',
      allocatedDate: '2024-01-20',
      rent: 5000,
      status: 'Active'
    },
    { 
      id: 3, 
      studentName: 'Amit Singh', 
      studentId: 'STU003', 
      phone: '+91 9876543212',
      roomNo: '103', 
      hostel: 'Boys Hostel A', 
      roomType: 'Triple Sharing',
      allocatedDate: '2024-02-01',
      rent: 4000,
      status: 'Pending'
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [formData, setFormData] = useState({
    studentName: '',
    studentId: '',
    phone: '',
    roomNo: '',
    hostel: '',
    roomType: '',
    allocatedDate: '',
    rent: ''
  });

  const hostels = ['Boys Hostel A', 'Boys Hostel B', 'Girls Hostel A', 'Girls Hostel B'];
  const roomTypes = ['Single AC', 'Single Non-AC', 'Double Sharing AC', 'Double Sharing', 'Triple Sharing'];
  const statuses = ['All', 'Active', 'Pending', 'Completed'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setAllocations(prev => prev.map(allocation => 
        allocation.id === editingId ? { ...formData, id: editingId, status: 'Active' } : allocation
      ));
      toast.success('Allocation updated successfully!');
    } else {
      setAllocations(prev => [...prev, { ...formData, id: Date.now(), status: 'Pending' }]);
      toast.success('Student allocated successfully!');
    }
    resetForm();
    setTimeout(() => {
      onNavigate('hostelAllocation');
    }, 1500);
  };

  const resetForm = () => {
    setFormData({ studentName: '', studentId: '', phone: '', roomNo: '', hostel: '', roomType: '', allocatedDate: '', rent: '' });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (allocation) => {
    setFormData(allocation);
    setEditingId(allocation.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setAllocations(prev => prev.filter(allocation => allocation.id !== id));
  };

  const handleStatusChange = (id, newStatus) => {
    setAllocations(prev => prev.map(allocation => 
      allocation.id === id ? { ...allocation, status: newStatus } : allocation
    ));
  };

  const filteredAllocations = allocations.filter(allocation => {
    const matchesSearch = allocation.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         allocation.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         allocation.roomNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         allocation.hostel.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || allocation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center">
                  <FaClipboardList className="mr-3" />
                  Hostel Allocation
                </h1>
                <p className="text-emerald-100 mt-2">Manage student room assignments and allocations</p>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center space-x-2"
              >
                <FaPlus />
                <span>New Allocation</span>
              </button>
            </div>
          </div>

          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by student name, ID, room, or hostel..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                />
              </div>
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition appearance-none bg-white"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAllocations.map((allocation) => (
                <div key={allocation.id} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {allocation.studentName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{allocation.studentName}</h3>
                        <p className="text-sm text-gray-600">{allocation.studentId}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(allocation)}
                        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(allocation.id)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 flex items-center">
                        <FaBed className="mr-2" />
                        Room:
                      </span>
                      <span className="font-semibold text-gray-800">{allocation.roomNo}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Hostel:</span>
                      <span className="font-semibold text-gray-800">{allocation.hostel}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-semibold text-gray-800">{allocation.roomType}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-semibold text-gray-800">{allocation.phone}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Rent:</span>
                      <span className="font-bold text-green-600">₹{allocation.rent.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 flex items-center">
                        <FaCalendar className="mr-2" />
                        Allocated:
                      </span>
                      <span className="font-semibold text-gray-800">{new Date(allocation.allocatedDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-gray-700">Status:</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(allocation.status)}`}>
                        {allocation.status}
                      </span>
                    </div>
                    
                    <select
                      value={allocation.status}
                      onChange={(e) => handleStatusChange(allocation.id, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition text-sm"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Active">Active</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6">
                <h2 className="text-2xl font-bold text-white">
                  {editingId ? 'Edit Allocation' : 'New Room Allocation'}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto scrollbar-hide">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Student Name</label>
                    <input
                      type="text"
                      name="studentName"
                      value={formData.studentName}
                      onChange={handleInputChange}
                      placeholder="Enter student name"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Student ID</label>
                    <input
                      type="text"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleInputChange}
                      placeholder="e.g., STU001"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
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
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Room Number</label>
                    <input
                      type="text"
                      name="roomNo"
                      value={formData.roomNo}
                      onChange={handleInputChange}
                      placeholder="e.g., 101"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Hostel</label>
                    <select
                      name="hostel"
                      value={formData.hostel}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                      required
                    >
                      <option value="">Select Hostel</option>
                      {hostels.map(hostel => (
                        <option key={hostel} value={hostel}>{hostel}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Room Type</label>
                    <select
                      name="roomType"
                      value={formData.roomType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                      required
                    >
                      <option value="">Select Type</option>
                      {roomTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Allocation Date</label>
                    <input
                      type="date"
                      name="allocatedDate"
                      value={formData.allocatedDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Monthly Rent (₹)</label>
                    <input
                      type="number"
                      name="rent"
                      value={formData.rent}
                      onChange={handleInputChange}
                      placeholder="Monthly rent amount"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                      required
                    />
                  </div>
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
                    className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    {editingId ? 'Update' : 'Allocate'}
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

export default HostelAllocation;