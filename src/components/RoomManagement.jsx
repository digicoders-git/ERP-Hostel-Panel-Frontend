import { 
  FaDoorOpen, FaPlus, FaEdit, FaTrash, FaUser, FaCheckCircle, 
  FaTimesCircle, FaTools, FaSearch, FaFilter, FaBuilding,
  FaBed, FaMoneyBillWave, FaSpinner, FaHistory, FaMapMarkerAlt
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import { roomAPI, roomTypeAPI, bedAllocationAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [roomsRes, roomTypesRes, allocationsRes] = await Promise.all([
        roomAPI.getAll(),
        roomTypeAPI.getAll(),
        bedAllocationAPI.getAll()
      ]);

      const roomsData = roomsRes.data.rooms || roomsRes.data.data || roomsRes.data;
      if (Array.isArray(roomsData)) setRooms(roomsData);
      
      const typesData = roomTypesRes.data.roomTypes || roomTypesRes.data.data || roomTypesRes.data;
      if (Array.isArray(typesData)) setRoomTypes(typesData);

      const allocsData = allocationsRes.data.data || allocationsRes.data.allocations || allocationsRes.data;
      if (Array.isArray(allocsData)) setAllocations(allocsData);
    } catch (error) {
      toast.error('Failed to fetch inventory data');
      console.error('Room Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setIsSubmitting(true);
    try {
      const dbStatus = newStatus.toLowerCase();
      const response = await roomAPI.updateStatus(id, dbStatus);
      if (response.data.success) {
        setRooms(prev => prev.map(room => 
          room._id === id ? { ...room, status: dbStatus } : room
        ));
        toast.success(`Unit ${id.slice(-4).toUpperCase()} status synced to ${newStatus}`);
      }
    } catch (error) {
      toast.error('Failed to sync unit status');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoomType = (room) => {
    if (room.roomType && typeof room.roomType === 'object') return room.roomType;
    return roomTypes.find(rt => rt._id === (room.roomType || room.typeId));
  };

  const getAllocatedStudents = (roomId) => {
    return allocations.filter(allocation => String(allocation.roomId) === String(roomId));
  };

  const filteredRooms = rooms.filter(room => {
    const roomType = getRoomType(room);
    const roomNumber = String(room.roomNo || room.number || '');
    const roomTypeName = roomType ? (roomType.roomTypeName || roomType.name || '') : '';
    
    const matchesSearch = roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         roomTypeName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const roomStatus = room.status || 'available';
    const normalizedStatus = roomStatus.charAt(0).toUpperCase() + roomStatus.slice(1);
    const matchesStatus = statusFilter === 'All' || normalizedStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusTheme = (status) => {
    const s = status?.toLowerCase();
    switch(s) {
      case 'available': return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', icon: <FaCheckCircle /> };
      case 'occupied': return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', icon: <FaUser /> };
      case 'maintenance': return { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', icon: <FaTools /> };
      default: return { bg: 'bg-slate-50', text: 'text-slate-400', border: 'border-slate-100', icon: <FaTimesCircle /> };
    }
  };

  return (
    <div className="space-y-8 animate-in transition-all">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Facilities Management</h2>
          <p className="text-slate-500 font-medium tracking-tight">Official registry of room assets, inventory status, and occupancy.</p>
        </div>
        <div className="bg-slate-900 text-white px-8 py-4 rounded-[2rem] shadow-2xl flex items-center gap-6">
           <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Total Capacity</p>
              <p className="text-xl font-black">{rooms.reduce((acc, r) => acc + (r.capacity || 0), 0)} Beds</p>
           </div>
           <div className="w-px h-8 bg-slate-800"></div>
           <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Occupancy Rate</p>
              <p className="text-xl font-black">{Math.round((allocations.length / (rooms.reduce((acc, r) => acc + (r.capacity || 0), 0) || 1)) * 100)}%</p>
           </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl flex flex-wrap items-center gap-6">
        <div className="flex-1 min-w-[300px] relative group">
          <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
          <input
            type="text"
            placeholder="Search room unit or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-6 py-4 bg-slate-50 border-none rounded-[1.5rem] text-sm font-bold text-slate-800 focus:ring-2 focus:ring-slate-900 outline-none transition-all"
          />
        </div>
        
        <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100 shadow-inner">
           {['All', 'Available', 'Occupied', 'Maintenance'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                  statusFilter === status ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {status}
              </button>
           ))}
        </div>

        <button 
          onClick={fetchData} 
          className="p-4 bg-white text-slate-400 hover:bg-slate-900 hover:text-white rounded-2xl border border-slate-200 transition-all shadow-sm"
          title="Refresh Ledger"
        >
          <FaHistory />
        </button>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {loading ? (
          <div className="col-span-full py-32 text-center space-y-4">
             <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Syncing Facility Ledger...</p>
          </div>
        ) : filteredRooms.length > 0 ? (
          filteredRooms.map((room) => {
            const roomType = getRoomType(room);
            const allocatedStudents = getAllocatedStudents(room._id || room.id);
            const currentStatus = room.status || 'available';
            const theme = getStatusTheme(currentStatus);
            
            return (
              <div key={room._id || room.id} className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                {/* Visual Header */}
                <div className="bg-slate-900 p-8 text-white relative">
                   <div className="absolute top-8 right-8 w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xl">
                      <FaBuilding />
                   </div>
                   <h3 className="text-3xl font-black tracking-tight">Unit {room.roomNo || room.number}</h3>
                   <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Floor {room.floorNo || room.floor || 'G'}</p>
                </div>

                <div className="p-8 space-y-6">
                   {/* Key Metrics */}
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 rounded-2xl">
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Capacity</p>
                         <p className="text-lg font-black text-slate-900 flex items-center gap-2">
                            <FaBed size={14} className="text-indigo-600" />
                            {room.capacity}
                         </p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl">
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Occupancy</p>
                         <p className={`text-lg font-black ${allocatedStudents.length >= room.capacity ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {allocatedStudents.length}/{room.capacity}
                         </p>
                      </div>
                   </div>

                   {/* Configuration List */}
                   <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs px-2">
                         <span className="font-bold text-slate-400 uppercase tracking-widest">Category</span>
                         <span className="font-black text-slate-900">{roomType ? (roomType.roomTypeName || roomType.name) : 'Standard'}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs px-2">
                         <span className="font-bold text-slate-400 uppercase tracking-widest">Rate (PM)</span>
                         <span className="font-black text-emerald-600 flex items-center gap-1">
                            <FaMoneyBillWave size={12} />
                            ₹{room.monthlyRent?.toLocaleString() || (roomType ? roomType.monthlyRent?.toLocaleString() : '---')}
                         </span>
                      </div>
                   </div>

                   {/* Occupant Listing */}
                   <div className="pt-4 border-t border-slate-50">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 px-2">Active Occupants</p>
                      {allocatedStudents.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                           {allocatedStudents.map((alloc, idx) => (
                             <div key={idx} className="flex-1 min-w-[45%] flex items-center gap-2 p-2 bg-indigo-50/50 rounded-xl border border-indigo-100/50 group/item hover:bg-indigo-600 hover:text-white transition-all">
                                <FaUser size={10} />
                                <span className="text-[10px] font-black truncate">{alloc.studentName}</span>
                             </div>
                           ))}
                        </div>
                      ) : (
                        <div className="py-4 text-center border-2 border-dashed border-slate-50 rounded-2xl">
                           <p className="text-[10px] font-black text-slate-200 uppercase tracking-widest italic tracking-[0.2em]">Ready for Intake</p>
                        </div>
                      )}
                   </div>
                </div>

                {/* Management Controls */}
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center gap-3">
                   <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl flex-1 border ${theme.border} ${theme.bg} ${theme.text}`}>
                      <div className="animate-in fade-in zoom-in duration-300">
                        {isSubmitting ? <FaSpinner className="animate-spin" /> : theme.icon}
                      </div>
                      <select
                        value={currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                        onChange={(e) => handleStatusChange(room._id || room.id, e.target.value)}
                        className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest w-full cursor-pointer disabled:opacity-50"
                        disabled={allocatedStudents.length >= room.capacity || isSubmitting}
                      >
                        <option value="Available">Set Available</option>
                        <option value="Occupied">Set Occupied</option>
                        <option value="Maintenance">Set Maintenance</option>
                      </select>
                   </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-40 text-center space-y-6">
             <div className="p-10 bg-white rounded-full w-fit mx-auto shadow-2xl">
                <FaDoorOpen className="text-6xl text-slate-100" />
             </div>
             <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Inventory Mismatch</h3>
                <p className="text-slate-400 font-medium italic mt-2">No room units found matching the active ledger filters.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomManagement;