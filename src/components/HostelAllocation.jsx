import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaClipboardList, FaPlus, FaEdit, FaTrash, FaUser, FaBed, FaCalendar, FaSearch, FaFilter } from 'react-icons/fa';
import { hostelAllocationAPI, hostelAPI, hostelStudentAPI, roomTypeAPI, roomAPI } from '../services/api';
import Swal from 'sweetalert2';

const HostelAllocation = ({ onNavigate }) => {
  const [allocations, setAllocations] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [students, setStudents] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    phone: '',
    hostelId: '',
    roomNo: '',
    joiningDate: '',
    monthlyRent: '',
    securityDeposit: '',
    remark: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [allocationsRes, hostelsRes, studentsRes, roomTypesRes, roomsRes] = await Promise.all([
        hostelAllocationAPI.getAll().catch(err => ({ data: { allocations: [] } })),
        hostelAPI.getAll().catch(err => ({ data: { hostels: [] } })),
        hostelStudentAPI.getAll({ status: 'Active' }).catch(err => ({ data: { data: [] } })),
        roomTypeAPI.getAll().catch(err => ({ data: { roomTypes: [] } })),
        roomAPI.getAll().catch(err => ({ data: { rooms: [] } }))
      ]);
      
      // Extract data from correct response structure
      const allocationsData = allocationsRes.data.allocations || [];
      const hostelsData = hostelsRes.data.hostels || [];
      const studentsData = studentsRes.data.data || [];
      const roomTypesData = roomTypesRes.data.roomTypes || [];
      const roomsData = roomsRes.data.rooms || [];
      
      console.log('=== DATA FETCHED ===');
      console.log('Allocations:', allocationsData.length);
      console.log('Hostels:', hostelsData.length, hostelsData);
      console.log('Students:', studentsData.length, studentsData);
      console.log('Room Types:', roomTypesData.length, roomTypesData);
      console.log('Rooms:', roomsData.length, roomsData);
      
      setAllocations(allocationsData);
      setHostels(hostelsData);
      setStudents(studentsData);
      setRoomTypes(roomTypesData);
      setRooms(roomsData);
      
      if (hostelsData.length === 0) {
        toast.error('No hostels found! Please create hostels first.');
      } else if (studentsData.length === 0) {
        toast.error('No students found! Please add students first.');
      } else {
        toast.success(`Loaded: ${hostelsData.length} hostels, ${studentsData.length} students, ${roomsData.length} rooms`);
      }
    } catch (error) {
      toast.error('Failed to load data');
      console.error('Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Auto-fill student name when student is selected
    if (name === 'studentId') {
      const student = students.find(s => s._id === value);
      if (student) {
        setFormData(prev => ({
          ...prev,
          studentName: student.name,
          phone: student.phone || ''
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        studentId: formData.studentId,
        studentName: formData.studentName,
        hostelId: formData.hostelId,
        roomNo: formData.roomNo,
        joiningDate: formData.joiningDate,
        monthlyRent: parseFloat(formData.monthlyRent),
        securityDeposit: parseFloat(formData.securityDeposit),
        remark: formData.remark
      };

      console.log('Submitting payload:', payload);

      if (editingId) {
        await hostelAllocationAPI.update(editingId, payload);
        toast.success('Allocation updated successfully!');
      } else {
        await hostelAllocationAPI.allocate(payload);
        toast.success('Student allocated successfully!');
      }
      
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Submit Error:', error);
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      studentId: '',
      studentName: '',
      phone: '',
      hostelId: '',
      roomNo: '',
      joiningDate: '',
      monthlyRent: '',
      securityDeposit: '',
      remark: ''
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (allocation) => {
    setFormData({
      studentId: allocation.studentId,
      studentName: allocation.studentName,
      phone: '',
      hostelId: allocation.hostel?._id || '',
      roomNo: allocation.roomNo,
      joiningDate: allocation.joiningDate?.split('T')[0] || '',
      monthlyRent: allocation.monthlyRent,
      securityDeposit: allocation.securityDeposit,
      remark: allocation.remark || ''
    });
    setEditingId(allocation._id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Cancel Allocation?',
      text: 'Are you sure you want to cancel this allocation?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await hostelAllocationAPI.cancel(id);
          toast.success('Allocation cancelled successfully');
          fetchData();
        } catch (error) {
          toast.error('Failed to cancel allocation');
        }
      }
    });
  };

  const filteredAllocations = allocations.filter(allocation => {
    const matchesSearch = 
      allocation.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      allocation.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      allocation.roomNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      allocation.hostel?.hostelName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || 
      (statusFilter === 'Active' && allocation.allocationStatus === 'allocated') ||
      (statusFilter === 'Cancelled' && allocation.allocationStatus === 'cancelled');
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'allocated': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'allocated': return 'Active';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  // Get available rooms for selected hostel
  const availableRooms = rooms.filter(room => 
    formData.hostelId ? String(room.hostel?._id) === String(formData.hostelId) : false
  );

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
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                <p className="mt-4 text-gray-600">Loading allocations...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAllocations.map((allocation) => (
                  <div key={allocation._id} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {allocation.studentName?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">{allocation.studentName}</h3>
                          <p className="text-sm text-gray-600">{allocation.studentId}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {allocation.allocationStatus === 'allocated' && (
                          <>
                            <button
                              onClick={() => handleEdit(allocation)}
                              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(allocation._id)}
                              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                              <FaTrash />
                            </button>
                          </>
                        )}
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
                        <span className="font-semibold text-gray-800">{allocation.hostel?.hostelName || 'N/A'}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Monthly Rent:</span>
                        <span className="font-bold text-green-600">₹{allocation.monthlyRent?.toLocaleString()}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Security:</span>
                        <span className="font-semibold text-gray-800">₹{allocation.securityDeposit?.toLocaleString()}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 flex items-center">
                          <FaCalendar className="mr-2" />
                          Joined:
                        </span>
                        <span className="font-semibold text-gray-800">
                          {allocation.joiningDate ? new Date(allocation.joiningDate).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-700">Status:</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(allocation.allocationStatus)}`}>
                          {getStatusLabel(allocation.allocationStatus)}
                        </span>
                      </div>
                      {allocation.remark && (
                        <p className="mt-2 text-xs text-gray-600 italic">{allocation.remark}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && filteredAllocations.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No allocations found</p>
              </div>
            )}
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6">
                <h2 className="text-2xl font-bold text-white">
                  {editingId ? 'Edit Allocation' : 'New Room Allocation'}
                </h2>
                <p className="text-emerald-100 text-sm mt-1">
                  📊 Available: {hostels.length} hostels | {students.length} students | {rooms.length} rooms | {roomTypes.length} room types
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Select Student <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                      required
                      disabled={editingId}
                    >
                      <option value="">-- Select Student --</option>
                      {students.map(student => (
                        <option key={student._id} value={student._id}>
                          {student.name} - {student.rollNumber} ({student.course})
                        </option>
                      ))}
                    </select>
                    {students.length === 0 && (
                      <p className="text-xs text-red-500 mt-1">⚠️ No students available</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Student Name</label>
                    <input
                      type="text"
                      name="studentName"
                      value={formData.studentName}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 outline-none"
                      readOnly
                      placeholder="Auto-filled"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Select Hostel <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="hostelId"
                      value={formData.hostelId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                      required
                    >
                      <option value="">-- Select Hostel --</option>
                      {hostels.map(hostel => (
                        <option key={hostel._id} value={hostel._id}>
                          {hostel.hostelName} ({hostel.hostelCode}) - {hostel.type}
                        </option>
                      ))}
                    </select>
                    {hostels.length === 0 && (
                      <p className="text-xs text-red-500 mt-1">⚠️ No hostels available</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Room Number <span className="text-red-500">*</span>
                    </label>
                    {availableRooms.length > 0 ? (
                      <select
                        name="roomNo"
                        value={formData.roomNo}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                        required
                      >
                        <option value="">-- Select Room --</option>
                        {availableRooms.map(room => (
                          <option key={room._id} value={room.roomNo}>
                            Room {room.roomNo} - Floor {room.floorNo} ({room.status})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        name="roomNo"
                        value={formData.roomNo}
                        onChange={handleInputChange}
                        placeholder="e.g., 101"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                        required
                      />
                    )}
                    {formData.hostelId && availableRooms.length === 0 && (
                      <p className="text-xs text-orange-500 mt-1">ℹ️ No rooms found for this hostel. Enter manually.</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Joining Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="joiningDate"
                      value={formData.joiningDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Monthly Rent (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="monthlyRent"
                      value={formData.monthlyRent}
                      onChange={handleInputChange}
                      placeholder="Monthly rent amount"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                      required
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Security Deposit (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="securityDeposit"
                      value={formData.securityDeposit}
                      onChange={handleInputChange}
                      placeholder="Security deposit amount"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                      required
                      min="0"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Remark (Optional)</label>
                    <textarea
                      name="remark"
                      value={formData.remark}
                      onChange={handleInputChange}
                      placeholder="Any additional notes..."
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                    />
                  </div>

                  {roomTypes.length > 0 && (
                    <div className="md:col-span-2 bg-blue-50 p-4 rounded-xl border border-blue-200">
                      <p className="text-sm font-semibold text-blue-800 mb-2">💡 Available Room Types (Reference):</p>
                      <div className="grid grid-cols-2 gap-2">
                        {roomTypes.map(rt => (
                          <div key={rt._id} className="text-xs text-blue-700 bg-white p-2 rounded">
                            • <strong>{rt.roomTypeName}</strong> - ₹{rt.monthlyRent}/month | Capacity: {rt.capacity} | Deposit: ₹{rt.securityDeposit}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-300"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processing...' : (editingId ? 'Update Allocation' : 'Allocate Student')}
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
