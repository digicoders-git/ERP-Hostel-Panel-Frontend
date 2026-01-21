import { useState, useEffect } from 'react';
import { FaDoorOpen, FaPlus, FaEdit, FaTrash, FaUser, FaCheckCircle, FaTimesCircle, FaTools, FaSearch, FaFilter } from 'react-icons/fa';
import Swal from 'sweetalert2';

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  // const [showForm, setShowForm] = useState(false);
  // const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  // const [formData, setFormData] = useState({
  //   number: '',
  //   typeId: '',
  //   floor: '',
  //   capacity: ''
  // });

  useEffect(() => {
    const savedRooms = JSON.parse(localStorage.getItem('rooms') || '[]');
    const savedRoomTypes = JSON.parse(localStorage.getItem('roomTypes') || '[]');
    
    // Add sample rooms if none exist
    if (savedRooms.length === 0 && savedRoomTypes.length > 0) {
      const sampleRooms = [
        { id: 1, number: '101', typeId: savedRoomTypes[0]?.id, floor: 1, capacity: savedRoomTypes[0]?.capacity, status: 'Available' },
        { id: 2, number: '102', typeId: savedRoomTypes[1]?.id, floor: 1, capacity: savedRoomTypes[1]?.capacity, status: 'Available' },
        { id: 3, number: '201', typeId: savedRoomTypes[2]?.id, floor: 2, capacity: savedRoomTypes[2]?.capacity, status: 'Available' },
        { id: 4, number: '202', typeId: savedRoomTypes[3]?.id, floor: 2, capacity: savedRoomTypes[3]?.capacity, status: 'Maintenance' },
      ].filter(room => room.typeId); // Only add rooms with valid typeId
      setRooms(sampleRooms);
      localStorage.setItem('rooms', JSON.stringify(sampleRooms));
    } else {
      setRooms(savedRooms);
    }
    
    setRoomTypes(savedRoomTypes);
  }, []);

  const statuses = ['All', 'Available', 'Occupied', 'Maintenance'];

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData(prev => {
  //     const updated = { ...prev, [name]: value };
      
  //     // Auto-update capacity when room type changes
  //     if (name === 'typeId' && value) {
  //       const selectedRoomType = roomTypes.find(rt => rt.id === parseInt(value));
  //       if (selectedRoomType) {
  //         updated.capacity = selectedRoomType.capacity.toString();
  //       }
  //     }
      
  //     return updated;
  //   });
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
    
  //   if (!formData.number || !formData.typeId || !formData.floor) {
  //     Swal.fire('Error', 'Please fill all required fields', 'error');
  //     return;
  //   }

  //   const selectedRoomType = roomTypes.find(rt => rt.id === parseInt(formData.typeId));
    
  //   if (editingId) {
  //     const updatedRooms = rooms.map(room => 
  //       room.id === editingId ? { 
  //         ...room, 
  //         number: formData.number,
  //         typeId: parseInt(formData.typeId),
  //         floor: parseInt(formData.floor),
  //         capacity: selectedRoomType.capacity
  //       } : room
  //     );
  //     setRooms(updatedRooms);
  //     localStorage.setItem('rooms', JSON.stringify(updatedRooms));
  //     Swal.fire('Success!', 'Room updated successfully', 'success');
  //   } else {
  //     const newRoom = {
  //       id: Date.now(),
  //       number: formData.number,
  //       typeId: parseInt(formData.typeId),
  //       floor: parseInt(formData.floor),
  //       capacity: selectedRoomType.capacity,
  //       status: 'Available'
  //     };
  //     const updatedRooms = [...rooms, newRoom];
  //     setRooms(updatedRooms);
  //     localStorage.setItem('rooms', JSON.stringify(updatedRooms));
  //     Swal.fire('Success!', 'Room created successfully', 'success');
  //   }
  //   resetForm();
  // };

  // const resetForm = () => {
  //   setFormData({ number: '', typeId: '', floor: '', capacity: '' });
  //   setShowForm(false);
  //   setEditingId(null);
  // };

  // const handleEdit = (room) => {
  //   setFormData({
  //     number: room.number,
  //     typeId: room.typeId.toString(),
  //     floor: room.floor.toString(),
  //     capacity: room.capacity.toString()
  //   });
  //   setEditingId(room.id);
  //   setShowForm(true);
  // };

  // const handleDelete = (id) => {
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: 'This will delete the room permanently',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#d33',
  //     cancelButtonColor: '#3085d6',
  //     confirmButtonText: 'Yes, delete!'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       const updatedRooms = rooms.filter(room => room.id !== id);
  //       setRooms(updatedRooms);
  //       localStorage.setItem('rooms', JSON.stringify(updatedRooms));
  //       Swal.fire('Deleted!', 'Room has been deleted.', 'success');
  //     }
  //   });
  // };

  const handleStatusChange = (id, newStatus) => {
    const updatedRooms = rooms.map(room => 
      room.id === id ? { ...room, status: newStatus } : room
    );
    setRooms(updatedRooms);
    localStorage.setItem('rooms', JSON.stringify(updatedRooms));
    Swal.fire('Success!', `Room status updated to ${newStatus}`, 'success');
  };

  const getRoomType = (typeId) => {
    return roomTypes.find(rt => rt.id === typeId);
  };

  const getAllocatedStudents = (roomId) => {
    const allocations = JSON.parse(localStorage.getItem('roomAllocations') || '[]');
    return allocations.filter(allocation => allocation.roomId === roomId);
  };

  const filteredRooms = rooms.filter(room => {
    const roomType = getRoomType(room.typeId);
    const roomNumber = String(room.number || '');
    const roomTypeName = roomType && roomType.name ? String(roomType.name) : '';
    
    const matchesSearch = roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         roomTypeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || room.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'Available': return 'bg-green-100 text-green-800 border-green-200';
      case 'Occupied': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Maintenance': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Available': return <FaCheckCircle className="text-green-600" />;
      case 'Occupied': return <FaUser className="text-blue-600" />;
      case 'Maintenance': return <FaTools className="text-red-600" />;
      default: return <FaTimesCircle className="text-gray-600" />;
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <FaDoorOpen className="mr-3" />
              Room Management
            </h1>
            <p className="text-gray-600 mt-2">Manage rooms, occupancy, and maintenance status</p>
          </div>
           
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search rooms or room types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition appearance-none bg-white"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => {
            const roomType = getRoomType(room.typeId);
            const allocatedStudents = getAllocatedStudents(room.id);
            const currentStatus = allocatedStudents.length >= room.capacity ? 'Occupied' : room.status;
            
            return (
              <div key={room.id} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      {room.number}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">Room {room.number}</h3>
                      <p className="text-sm text-gray-600">{roomType ? roomType.name : 'Unknown Type'}</p>
                    </div>
                  </div>
                  {/* <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(room)}
                      className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(room.id)}
                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div> */}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-semibold text-gray-800">{roomType ? roomType.name : 'N/A'}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Floor:</span>
                    <span className="font-semibold text-gray-800">{room.floor}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Capacity:</span>
                    <span className="font-semibold text-gray-800">{room.capacity} Person{room.capacity > 1 ? 's' : ''}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Rent:</span>
                    <span className="font-bold text-green-600">₹{roomType ? roomType.monthlyRent.toLocaleString() : 'N/A'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Occupancy:</span>
                    <span className="font-semibold text-gray-800">{allocatedStudents.length}/{room.capacity}</span>
                  </div>

                  {allocatedStudents.length > 0 && (
                    <div>
                      <span className="text-gray-600 text-sm">Students:</span>
                      <div className="mt-1">
                        {allocatedStudents.map((allocation, index) => (
                          <div key={index} className="text-sm text-gray-800 bg-gray-100 px-2 py-1 rounded mb-1">
                            {allocation.studentName}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-700">Status:</span>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(currentStatus)}
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(currentStatus)}`}>
                        {currentStatus}
                      </span>
                    </div>
                  </div>
                  
                  <select
                    value={room.status}
                    onChange={(e) => handleStatusChange(room.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
                    disabled={allocatedStudents.length >= room.capacity}
                  >
                    <option value="Available">Available</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>

        {filteredRooms.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No rooms found. {roomTypes.length === 0 ? 'Please add room types first.' : 'Add your first room using the form above.'}
          </div>
        )}
      </div>

     
    </div>
  );
};

export default RoomManagement;