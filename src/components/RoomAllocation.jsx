import { useState, useEffect } from 'react';
import { FaBed, FaUser, FaSave, FaSearch } from 'react-icons/fa';
import Swal from 'sweetalert2';

const RoomAllocation = () => {
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const savedStudents = JSON.parse(localStorage.getItem('students') || '[]');
    const savedRooms = JSON.parse(localStorage.getItem('rooms') || '[]');
    const savedAllocations = JSON.parse(localStorage.getItem('roomAllocations') || '[]');
    
    setStudents(savedStudents);
    setRooms(savedRooms);
    setAllocations(savedAllocations);
  }, []);

  const availableStudents = students.filter(student => 
    !allocations.some(allocation => allocation.studentId === student.id)
  );

  const availableRooms = rooms.filter(room => {
    const roomAllocations = allocations.filter(allocation => allocation.roomId === room.id);
    return roomAllocations.length < room.capacity;
  });

  const handleAllocate = () => {
    if (!selectedStudent || !selectedRoom) {
      Swal.fire('Error', 'Please select both student and room', 'error');
      return;
    }

    const student = students.find(s => s.id === parseInt(selectedStudent));
    const room = rooms.find(r => r.id === parseInt(selectedRoom));

    const newAllocation = {
      id: Date.now(),
      studentId: student.id,
      roomId: room.id,
      studentName: student.name,
      roomNumber: room.number,
      allocatedDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    };

    const updatedAllocations = [...allocations, newAllocation];
    setAllocations(updatedAllocations);
    localStorage.setItem('roomAllocations', JSON.stringify(updatedAllocations));

    Swal.fire('Success!', 'Room allocated successfully', 'success');
    setSelectedStudent('');
    setSelectedRoom('');
  };

  const handleDeallocate = (allocationId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will remove the student from the room',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, deallocate!'
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedAllocations = allocations.filter(allocation => allocation.id !== allocationId);
        setAllocations(updatedAllocations);
        localStorage.setItem('roomAllocations', JSON.stringify(updatedAllocations));
        Swal.fire('Deallocated!', 'Room has been deallocated.', 'success');
      }
    });
  };

  const filteredAllocations = allocations.filter(allocation =>
    allocation.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    allocation.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Allocation Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Room Allocation</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaUser className="inline mr-2" />
                Select Student
              </label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a student...</option>
                {availableStudents.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.name} ({student.rollNumber})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaBed className="inline mr-2" />
                Select Room
              </label>
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a room...</option>
                {availableRooms.map(room => {
                  const currentOccupancy = allocations.filter(a => a.roomId === room.id).length;
                  return (
                    <option key={room.id} value={room.id}>
                      Room {room.number} - {room.type} ({currentOccupancy}/{room.capacity})
                    </option>
                  );
                })}
              </select>
            </div>

            <button
              onClick={handleAllocate}
              className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaSave className="mr-2" />
              Allocate Room
            </button>
          </div>
        </div>

        {/* Current Allocations */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Current Allocations</h2>
            <div className="text-sm text-gray-600">
              Total: {allocations.length}
            </div>
          </div>

          <div className="relative mb-4">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search allocations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredAllocations.map(allocation => (
              <div key={allocation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{allocation.studentName}</p>
                  <p className="text-sm text-gray-600">Room {allocation.roomNumber}</p>
                  <p className="text-xs text-gray-500">Allocated: {allocation.allocatedDate}</p>
                </div>
                <button
                  onClick={() => handleDeallocate(allocation.id)}
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                >
                  Deallocate
                </button>
              </div>
            ))}
            
            {filteredAllocations.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No allocations found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomAllocation;