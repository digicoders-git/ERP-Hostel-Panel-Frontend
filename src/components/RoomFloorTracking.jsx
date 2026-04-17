import { useState, useEffect } from 'react';
import { FaBuilding, FaDoorOpen, FaBed, FaUser, FaFilter } from 'react-icons/fa';
import { dashboardAPI } from '../services/api';
import toast from 'react-hot-toast';

const RoomFloorTracking = () => {
  const [selectedFloor, setSelectedFloor] = useState('all');
  const [selectedRoomStatus, setSelectedRoomStatus] = useState('all');
  const [floorsData, setFloorsData] = useState({});
  const [roomTypes, setRoomTypes] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await dashboardAPI.getFloorTracking();
      if (response.data.success) {
        setFloorsData(response.data.data.floors || {});
        setRoomTypes(response.data.data.roomTypes || []);
        setStats(response.data.data.stats || null);
      }
    } catch (error) {
      toast.error('Failed to load floor tracking data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredRooms = () => {
    let allRooms = [];
    Object.entries(floorsData).forEach(([floor, rooms]) => {
      if (selectedFloor === 'all' || floor === selectedFloor) {
        allRooms = [...allRooms, ...rooms];
      }
    });

    return allRooms.filter(room => {
      const occupancyRate = room.capacity > 0 ? (room.occupiedBeds / room.capacity) * 100 : 0;
      if (selectedRoomStatus === 'all') return true;
      if (selectedRoomStatus === 'full') return occupancyRate === 100;
      if (selectedRoomStatus === 'available') return occupancyRate < 100 && occupancyRate > 0;
      if (selectedRoomStatus === 'empty') return occupancyRate === 0;
      return true;
    });
  };

  const floors = Object.keys(floorsData).sort((a, b) => parseInt(a) - parseInt(b));
  const filteredRooms = getFilteredRooms();

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FaBuilding className="text-blue-600" />
            Room & Floor Tracking
          </h1>
          <p className="text-gray-600 mt-2">Live floor-wise bed allocation and occupancy monitoring</p>
        </div>
        <button 
          onClick={fetchData}
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 text-sm font-semibold transition-all"
        >
          Refresh Data
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Rooms', value: stats?.totalRooms || 0, icon: FaDoorOpen, color: 'blue' },
          { label: 'Total Beds', value: stats?.totalBeds || 0, icon: FaBed, color: 'green' },
          { label: 'Occupied Beds', value: stats?.occupiedBeds || 0, icon: FaBed, color: 'orange' },
          { label: 'Live Students', value: stats?.totalStudents || 0, icon: FaUser, color: 'purple' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-black text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <FaFilter className="text-gray-400" />
          <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest">Filters</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Select Floor</label>
            <select
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
            >
              <option value="all">All Floors</option>
              {floors.map(floor => (
                <option key={floor} value={floor}>Floor {floor}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Occupancy Status</label>
            <select
              value={selectedRoomStatus}
              onChange={(e) => setSelectedRoomStatus(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
            >
              <option value="all">All Status</option>
              <option value="empty">Empty (0% Occupied)</option>
              <option value="available">Partially Occupied</option>
              <option value="full">Fully Occupied (100%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rooms Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Floor</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Room</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Capacity</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Beds (O/A)</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Students</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredRooms.map((room) => {
                const occupancyRate = room.capacity > 0 ? (room.occupiedBeds / room.capacity) * 100 : 0;
                
                return (
                  <tr key={room._id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-600">
                      Floor {room.floor || room.floorNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                          {room.roomNo || room.number}
                        </div>
                        <span className="font-bold text-gray-900">Room {room.roomNo || room.number}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                      {room.roomTypeName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                      {room.capacity} Beds
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-orange-600 font-bold">{room.occupiedBeds}</span>
                        <span className="text-gray-300">/</span>
                        <span className="text-green-600 font-bold">{room.availableBeds}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {room.allocatedStudents?.length > 0 ? (
                          room.allocatedStudents.map((alloc, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md text-[10px] font-bold border border-indigo-100">
                              {alloc.studentName}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-xs italic">No occupants</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {occupancyRate === 100 ? (
                        <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-bold border border-red-100 tracking-widest uppercase">Full</span>
                      ) : occupancyRate === 0 ? (
                        <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-[10px] font-bold border border-gray-100 tracking-widest uppercase">Empty</span>
                      ) : (
                        <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-bold border border-green-100 tracking-widest uppercase">Available</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredRooms.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaFilter className="text-gray-300 text-2xl" />
            </div>
            <p className="text-gray-400 font-medium">No rooms match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomFloorTracking;
