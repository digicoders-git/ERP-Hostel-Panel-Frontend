import { useState, useEffect } from 'react';
import { FaBed, FaUser, FaTimes, FaPlus, FaSearch, FaFilter, FaTable, FaThLarge, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { bedAllocationAPI, hostelStudentAPI, roomAPI } from '../services/api';
import toast from 'react-hot-toast';

const BedAllocation = () => {
  const [rooms, setRooms] = useState([]);
  const [students, setStudents] = useState([]);
  const [bedAllocations, setBedAllocations] = useState([]);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [selectedFloor, setSelectedFloor] = useState('all');
  const [selectedRoom, setSelectedRoom] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllocationModal, setShowAllocationModal] = useState(false);
  const [selectedBed, setSelectedBed] = useState(null);
  const [showStudentProfile, setShowStudentProfile] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      console.log('Fetching bed allocation data...');
      
      // Try API first, fallback to localStorage
      let roomsData = [];
      let studentsData = [];
      let allocationsData = [];
      
      try {
        const roomsRes = await roomAPI.getAll();
        roomsData = roomsRes.data.data || roomsRes.data.rooms || [];
      } catch (err) {
        console.warn('Rooms API failed, using localStorage');
        roomsData = JSON.parse(localStorage.getItem('rooms') || '[]');
      }
      
      try {
        const studentsRes = await hostelStudentAPI.getAll({ status: 'Active' });
        studentsData = studentsRes.data.data || [];
      } catch (err) {
        console.warn('Students API failed, using localStorage');
        studentsData = JSON.parse(localStorage.getItem('students') || '[]');
      }
      
      try {
        const allocationsRes = await bedAllocationAPI.getAll({ status: 'active' });
        allocationsData = allocationsRes.data.data || [];
      } catch (err) {
        console.warn('Allocations API failed, using localStorage');
        allocationsData = JSON.parse(localStorage.getItem('bedAllocations') || '[]');
      }
      
      console.log('Fetched data:', { rooms: roomsData.length, students: studentsData.length, allocations: allocationsData.length });
      console.log('Students data:', studentsData);
      
      setRooms(roomsData);
      setStudents(studentsData);
      setBedAllocations(allocationsData);
      
      if (studentsData.length === 0) {
        toast.error('No students found in database');
      } else {
        toast.success(`Loaded ${studentsData.length} students`);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const floors = [...new Set(rooms.map(item => item.floor ?? item.floorNo))].filter(Boolean).sort((a, b) => a - b);
  const roomNumbers = [...new Set(rooms.map(item => item.roomNo))].sort();

  const filteredRooms = rooms.filter(room => {
    const currentFloor = String(room.floor ?? room.floorNo);
    const floorMatch = selectedFloor === 'all' || currentFloor === String(selectedFloor);
    const roomMatch = selectedRoom === 'all' || room.roomNo === selectedRoom;
    return floorMatch && roomMatch;
  });

  const getBedsForRoom = (roomId, capacity) => {
    const currentRoom = rooms.find(r => String(r._id) === String(roomId));
    const roomAllocations = bedAllocations.filter(
      alloc => String(alloc.roomId) === String(roomId)
    );
    
    const beds = [];
    // 1. Add all actual allocations from database
    roomAllocations.forEach(alloc => {
      beds.push({
        bedNumber: alloc.bedNumber, // Supports labels like "A1", "B2", etc.
        roomId,
        allocation: alloc
      });
    });
    
    // 2. Fill remaining capacity with vacant placeholders
    let currentCapacity = roomAllocations.length;
    let placeholderIndex = 1;
    
    while (currentCapacity < capacity) {
      // Find a placeholder number that doesn't clash with existing labels
      if (!beds.some(b => String(b.bedNumber) === String(placeholderIndex))) {
        beds.push({
          bedNumber: placeholderIndex,
          roomId,
          allocation: null
        });
        currentCapacity++;
      }
      placeholderIndex++;
    }

    // Sort beds by number/label for consistent UI
    return beds.sort((a, b) => 
      String(a.bedNumber).localeCompare(String(b.bedNumber), undefined, { numeric: true })
    );
  };

  const getStudentById = (studentId) => {
    return students.find(s => String(s._id) === String(studentId));
  };

  const handleBedClick = async (bed) => {
    console.log('Bed clicked:', bed);
    console.log('Available students:', availableStudents);
    if (bed.allocation) {
      let student = getStudentById(bed.allocation.studentId);
      
      if (!student) {
        const loadToast = toast.loading('Fetching student profile...');
        try {
          const res = await hostelStudentAPI.getById(bed.allocation.studentId);
          student = res.data.data;
          toast.dismiss(loadToast);
        } catch (error) {
          toast.error('Could not load student profile');
          toast.dismiss(loadToast);
          return;
        }
      }

      if (student) {
        setSelectedStudent(student);
        setShowStudentProfile(true);
      } else {
        toast.error('Student details not found');
      }
    } else {
      console.log('Opening allocation modal for bed:', bed);
      setSelectedBed(bed);
      setShowAllocationModal(true);
    }
  };

  const handleAllocateBed = async (studentId) => {
    setIsSubmitting(true);
    try {
      await bedAllocationAPI.allocate({
        roomId: selectedBed.roomId,
        bedNumber: selectedBed.bedNumber,
        studentId: studentId
      });
      toast.success('Bed allocated successfully');
      setShowAllocationModal(false);
      setSelectedBed(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to allocate bed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeallocateBed = (allocationId) => {
    Swal.fire({
      title: 'Deallocate Bed?',
      text: 'Are you sure you want to remove this student from the bed?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, deallocate'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsSubmitting(true);
        try {
          await bedAllocationAPI.deallocate(allocationId);
          toast.success('Bed deallocated successfully');
          setShowStudentProfile(false);
          fetchData();
        } catch (error) {
          toast.error('Failed to deallocate bed');
        } finally {
          setIsSubmitting(false);
        }
      }
    });
  };

  const availableStudents = students.filter(student => {
    const studentId = String(student._id || student.id);
    const isAllocated = bedAllocations.some(alloc => 
      String(alloc.studentId) === studentId && alloc.status !== 'deallocated'
    );
    const matchesSearch = student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.course?.toLowerCase().includes(searchTerm.toLowerCase());
    return !isAllocated && matchesSearch;
  });

  const renderTableView = () => {
    const allBeds = [];
    filteredRooms.forEach(room => {
      const beds = getBedsForRoom(room._id, room.capacity);
      beds.forEach(bed => {
        allBeds.push({
          ...bed,
          roomNo: room.roomNo,
          floor: room.floor ?? room.floorNo,
          roomType: room.roomType?.name || 'Standard'
        });
      });
    });

    return (
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b-2 border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Room / Floor</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Bed No</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Occupant</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Roll No</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allBeds.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center text-slate-400">
                    <FaExclamationCircle className="text-4xl mx-auto mb-3 opacity-20" />
                    <p className="text-lg font-medium">No beds found matching filters</p>
                  </td>
                </tr>
              ) : (
                allBeds.map((bed, idx) => (
                  <tr key={`${bed.roomId}-${bed.bedNumber}`} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-slate-900">Room {bed.roomNo}</p>
                        <p className="text-xs text-slate-500 font-medium tracking-tight uppercase">Floor {bed.floor}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-600">
                      #{bed.bedNumber}
                    </td>
                    <td className="px-6 py-4">
                      {bed.allocation ? (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                            <FaUser size={12} />
                          </div>
                          <p className="font-bold text-slate-800 text-sm">{bed.allocation.studentName}</p>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-sm">Vacant</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-600">
                      {bed.allocation?.rollNumber || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        bed.allocation 
                          ? 'bg-blue-50 text-blue-700 border-blue-200' 
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {bed.allocation ? 'Occupied' : 'Available'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleBedClick(bed)}
                          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all transform hover:scale-105 shadow-sm ${
                            bed.allocation
                              ? 'bg-slate-800 text-white hover:bg-slate-900 shadow-slate-200'
                              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
                          }`}
                        >
                          {bed.allocation ? 'View Profile' : 'Allocate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 space-y-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
            <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-200">
              <FaBed />
            </div>
            Bed Allocation
          </h1>
          <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-xs">
            Hostel Inventory & Resident Placement
          </p>
        </div>

        {/* View Toggle */}
        <div className="bg-white p-1.5 rounded-2xl shadow-xl border border-slate-200 flex items-center gap-1">
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
              viewMode === 'table' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <FaTable /> Table View
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
              viewMode === 'grid' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <FaThLarge /> Grid View
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 flex flex-col md:flex-row items-end gap-6">
        <div className="flex-1 space-y-2 w-full">
          <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
            <FaFilter className="text-indigo-600" /> Filter by Floor
          </label>
          <select
            value={selectedFloor}
            onChange={(e) => setSelectedFloor(e.target.value)}
            className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all font-bold text-slate-700 outline-none"
          >
            <option value="all">All Floors</option>
            {floors.map(floor => (
              <option key={floor} value={floor}>Floor {floor}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 space-y-2 w-full">
          <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
            <FaBed className="text-indigo-600" /> Specific Room
          </label>
          <select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all font-bold text-slate-700 outline-none"
          >
            <option value="all">All Rooms</option>
            {roomNumbers.map(room => (
              <option key={room} value={room}>Room {room}</option>
            ))}
          </select>
        </div>
        <button 
          onClick={fetchData}
          className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
        >
          Refresh Data
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-black text-xs uppercase tracking-widest animate-pulse">Synchronizing Inventory...</p>
        </div>
      ) : (
        <>
          {viewMode === 'table' ? renderTableView() : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in">
              {filteredRooms.map((room) => {
                const beds = getBedsForRoom(room._id, room.capacity);
                const occupiedBeds = beds.filter(b => b.allocation).length;

                return (
                  <div key={room._id} className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden group hover:shadow-2xl transition-all duration-500">
                    <div className="bg-slate-900 p-6 flex items-center justify-between text-white">
                      <div>
                        <h3 className="text-2xl font-black tracking-tight">Room {room.roomNo}</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Floor {room.floor ?? room.floorNo}</p>
                      </div>
                      <div className="px-4 py-2 bg-slate-800 rounded-xl border border-slate-700">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Occupancy</p>
                        <p className="text-sm font-black text-indigo-400">{occupiedBeds} / {room.capacity}</p>
                      </div>
                    </div>

                    <div className="p-6 grid grid-cols-2 gap-4">
                      {beds.map((bed) => (
                        <div
                          key={bed.bedNumber}
                          onClick={() => handleBedClick(bed)}
                          className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${
                            bed.allocation
                              ? 'border-indigo-600 bg-indigo-50 shadow-lg shadow-indigo-100'
                              : 'border-slate-100 bg-slate-50 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <FaBed className={`text-xl ${bed.allocation ? 'text-indigo-600' : 'text-slate-300'}`} />
                            <span className="text-[10px] font-black text-slate-500 uppercase">#{bed.bedNumber}</span>
                          </div>
                          {bed.allocation ? (
                            <div>
                              <p className="text-xs font-black text-slate-900 truncate">
                                {bed.allocation.studentName}
                              </p>
                              <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mt-1">Occupied</p>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              <FaPlus size={8} />
                              <span>Allocate</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {filteredRooms.length === 0 && (
            <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-slate-300">
              <FaExclamationCircle className="text-6xl text-slate-200 mx-auto mb-4" />
              <p className="text-slate-500 font-black text-sm uppercase tracking-widest">No matching rooms discovered</p>
            </div>
          )}
        </>
      )}

      {showAllocationModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[10000] p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full border border-slate-100 overflow-hidden">
            <div className="bg-slate-900 p-8 text-white flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black tracking-tight">Allocate Inventory</h2>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Bed #{selectedBed?.bedNumber} | Room {rooms.find(r => r._id === selectedBed?.roomId)?.roomNo}</p>
              </div>
              <button
                onClick={() => { setShowAllocationModal(false); setSelectedBed(null); }}
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xl hover:bg-slate-700 transition-all"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-10">
              <div className="mb-8">
                <div className="relative group">
                  <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input
                    type="text"
                    placeholder="Search students by name or roll number..."
                    value={searchTerm}
                    onChange={(e) => {
                      console.log('Search term:', e.target.value);
                      console.log('Available students:', availableStudents);
                      setSearchTerm(e.target.value);
                    }}
                    className="w-full pl-16 pr-6 py-5 bg-slate-50 border-none rounded-[1.5rem] text-sm font-bold text-slate-800 focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="max-h-[400px] overflow-y-auto custom-scrollbar space-y-3 pr-2">
                {availableStudents.length > 0 ? (
                  availableStudents.map((student) => (
                    <div
                      key={student._id || student.id}
                      onClick={() => !isSubmitting && handleAllocateBed(student._id || student.id)}
                      className={`flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] hover:bg-indigo-50 hover:border-indigo-100 cursor-pointer transition-all group ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white shadow-sm transition-all flex-shrink-0">
                          <FaUser />
                        </div>
                        <div className="min-w-0">
                          <p className="font-black text-slate-800 text-sm leading-tight truncate">{student.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 truncate">
                            {student.course || 'N/A'} • Roll: {student.rollNumber || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-indigo-600 opacity-0 group-hover:opacity-100 transition-all border border-indigo-100 flex-shrink-0">
                        <FaPlus size={10} />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-[2rem]">
                    <FaExclamationCircle className="text-slate-100 text-4xl mx-auto mb-3" />
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No unallocated students identified</p>
                    <p className="text-[9px] text-slate-400 mt-2">Total students in system: {students.length}</p>
                  </div>
                )}
              </div>
            </div>
            
            {isSubmitting && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10">
                 <div className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Updating Ledger...</span>
                 </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showStudentProfile && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg sticky top-0 z-10">
              <h2 className="text-2xl font-bold">Student Profile</h2>
              <button
                onClick={() => {
                  setShowStudentProfile(false);
                  setSelectedStudent(null);
                }}
                className="text-white hover:text-gray-200"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <div className="p-8">
              <div className="flex items-center gap-6 mb-8 pb-6 border-b">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <FaUser className="text-5xl text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-800">{selectedStudent.name}</h3>
                  <p className="text-lg text-gray-600 mt-1">Roll Number: {selectedStudent.rollNumber}</p>
                  <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                    {selectedStudent.status || 'Active'}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-blue-600 rounded"></div>
                  Academic Information
                </h4>
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-600 mb-1">Course</p>
                    <p className="text-xl font-bold text-gray-800">{selectedStudent.course || 'N/A'}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                    <p className="text-sm text-gray-600 mb-1">Year</p>
                    <p className="text-xl font-bold text-gray-800">{selectedStudent.year || 'N/A'}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                    <p className="text-sm text-gray-600 mb-1">Roll Number</p>
                    <p className="text-xl font-bold text-gray-800">{selectedStudent.rollNumber || 'N/A'}</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
                    <p className="text-sm text-gray-600 mb-1">Admission Date</p>
                    <p className="text-lg font-bold text-gray-800">{selectedStudent.admissionDate || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-green-600 rounded"></div>
                  Personal Information
                </h4>
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Gender</p>
                    <p className="text-lg font-semibold text-gray-800">{selectedStudent.gender || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Date of Birth</p>
                    <p className="text-lg font-semibold text-gray-800">{selectedStudent.dateOfBirth || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Blood Group</p>
                    <p className="text-lg font-semibold text-gray-800">{selectedStudent.bloodGroup || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <p className="text-sm font-semibold text-gray-800 truncate">{selectedStudent.email || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-purple-600 rounded"></div>
                  Contact Information
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Student Contact</p>
                    <p className="text-lg font-semibold text-gray-800">{selectedStudent.phone || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Parent Contact</p>
                    <p className="text-lg font-semibold text-gray-800">{selectedStudent.parentContact || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Emergency Contact</p>
                    <p className="text-lg font-semibold text-gray-800">{selectedStudent.emergencyContact || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-red-600 rounded"></div>
                  Address
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-lg font-semibold text-gray-800">{selectedStudent.address || 'N/A'}</p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-indigo-600 rounded"></div>
                  Hostel Allocation
                </h4>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-2 border-blue-200">
                  {(() => {
                    const allocation = bedAllocations.find(a => String(a.studentId) === String(selectedStudent._id));
                    const room = rooms.find(r => String(r._id) === String(allocation?.roomId));
                    return (
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Room Number</p>
                          <p className="text-2xl font-bold text-blue-600">{room?.roomNo || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Bed Number</p>
                          <p className="text-2xl font-bold text-blue-600">{allocation?.bedNumber || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Floor</p>
                          <p className="text-2xl font-bold text-blue-600">{room?.floor ?? room?.floorNo ?? 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Allocated Date</p>
                          <p className="text-lg font-semibold text-gray-800">{allocation?.allocatedDate || 'N/A'}</p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              <button
                onClick={() => {
                  const allocation = bedAllocations.find(a => String(a.studentId) === String(selectedStudent._id));
                  if (allocation) handleDeallocateBed(allocation._id);
                }}
                disabled={isSubmitting}
                className="w-full py-5 bg-rose-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-rose-700 shadow-xl shadow-rose-100 hover:shadow-rose-200 hover:-translate-y-1 transition-all disabled:bg-slate-400 disabled:shadow-none disabled:translate-y-0"
              >
                {isSubmitting ? 'Processing Release...' : 'Release Bed Occupancy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BedAllocation;
