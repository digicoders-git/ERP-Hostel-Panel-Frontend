import { useState, useEffect } from 'react';
import { FaBed, FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';

const RoomTypes = () => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    monthlyRent: '',
    securityDeposit: '',
    amenities: '',
    description: ''
  });

  useEffect(() => {
    const savedRoomTypes = JSON.parse(localStorage.getItem('roomTypes') || '[]');
    
    // Add default room types if none exist
    if (savedRoomTypes.length === 0) {
      const defaultRoomTypes = [
        {
          id: 1,
          name: 'Single AC',
          capacity: 1,
          monthlyRent: 8000,
          securityDeposit: 5000,
          amenities: ['AC', 'Attached Bathroom', 'Study Table', 'Wardrobe', 'WiFi'],
          description: 'Fully air-conditioned single occupancy room with all modern amenities'
        },
        {
          id: 2,
          name: 'Single Non-AC',
          capacity: 1,
          monthlyRent: 5000,
          securityDeposit: 3000,
          amenities: ['Fan', 'Attached Bathroom', 'Study Table', 'Wardrobe', 'WiFi'],
          description: 'Single occupancy room with basic amenities'
        },
        {
          id: 3,
          name: 'Double AC',
          capacity: 2,
          monthlyRent: 6000,
          securityDeposit: 4000,
          amenities: ['AC', 'Attached Bathroom', 'Study Tables', 'Wardrobes', 'WiFi'],
          description: 'Air-conditioned double occupancy room with shared amenities'
        },
        {
          id: 4,
          name: 'Double Non-AC',
          capacity: 2,
          monthlyRent: 4000,
          securityDeposit: 2500,
          amenities: ['Fan', 'Attached Bathroom', 'Study Tables', 'Wardrobes', 'WiFi'],
          description: 'Double occupancy room with basic amenities'
        }
      ];
      setRoomTypes(defaultRoomTypes);
      localStorage.setItem('roomTypes', JSON.stringify(defaultRoomTypes));
    } else {
      setRoomTypes(savedRoomTypes);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.capacity || !formData.monthlyRent) {
      Swal.fire('Error', 'Please fill all required fields', 'error');
      return;
    }

    const amenitiesArray = formData.amenities.split(',').map(item => item.trim()).filter(item => item);
    
    if (isEditing) {
      const updatedRoomTypes = roomTypes.map(roomType => {
        if (roomType.id === editingId) {
          return {
            ...roomType,
            name: formData.name,
            capacity: parseInt(formData.capacity),
            monthlyRent: parseFloat(formData.monthlyRent),
            securityDeposit: parseFloat(formData.securityDeposit) || 0,
            amenities: amenitiesArray,
            description: formData.description
          };
        }
        return roomType;
      });
      
      setRoomTypes(updatedRoomTypes);
      localStorage.setItem('roomTypes', JSON.stringify(updatedRoomTypes));
      Swal.fire('Success!', 'Room type updated successfully', 'success');
    } else {
      const newRoomType = {
        id: Date.now(),
        name: formData.name,
        capacity: parseInt(formData.capacity),
        monthlyRent: parseFloat(formData.monthlyRent),
        securityDeposit: parseFloat(formData.securityDeposit) || 0,
        amenities: amenitiesArray,
        description: formData.description
      };
      
      const updatedRoomTypes = [...roomTypes, newRoomType];
      setRoomTypes(updatedRoomTypes);
      localStorage.setItem('roomTypes', JSON.stringify(updatedRoomTypes));
      Swal.fire('Success!', 'Room type added successfully', 'success');
    }
    
    resetForm();
  };

  const handleEdit = (roomType) => {
    setFormData({
      name: roomType.name,
      capacity: roomType.capacity.toString(),
      monthlyRent: roomType.monthlyRent.toString(),
      securityDeposit: roomType.securityDeposit.toString(),
      amenities: roomType.amenities.join(', '),
      description: roomType.description
    });
    setIsEditing(true);
    setEditingId(roomType.id);
  };

  const handleDelete = (roomTypeId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will delete the room type permanently',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete!'
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedRoomTypes = roomTypes.filter(roomType => roomType.id !== roomTypeId);
        setRoomTypes(updatedRoomTypes);
        localStorage.setItem('roomTypes', JSON.stringify(updatedRoomTypes));
        Swal.fire('Deleted!', 'Room type has been deleted.', 'success');
      }
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      capacity: '',
      monthlyRent: '',
      securityDeposit: '',
      amenities: '',
      description: ''
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            {isEditing ? 'Edit Room Type' : 'Add Room Type'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Type Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Single AC"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacity *
              </label>
              <select
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Capacity</option>
                <option value="1">1 Person</option>
                <option value="2">2 Persons</option>
                <option value="3">3 Persons</option>
                <option value="4">4 Persons</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Rent (₹) *
              </label>
              <input
                type="number"
                name="monthlyRent"
                value={formData.monthlyRent}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="5000"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Security Deposit (₹)
              </label>
              <input
                type="number"
                name="securityDeposit"
                value={formData.securityDeposit}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="3000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amenities (comma separated)
              </label>
              <input
                type="text"
                name="amenities"
                value={formData.amenities}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="AC, WiFi, Study Table"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description of the room type"
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaSave className="mr-2" />
                {isEditing ? 'Update' : 'Add'} Room Type
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <FaTimes className="mr-2" />
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Room Types List */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Room Types</h2>
            <div className="text-sm text-gray-600">
              Total Types: {roomTypes.length}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roomTypes.map((roomType) => (
              <div key={roomType.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <FaBed className="text-blue-600 text-xl mr-3" />
                    <h3 className="text-lg font-semibold text-gray-800">{roomType.name}</h3>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(roomType)}
                      className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(roomType.id)}
                      className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Capacity:</span>
                    <span className="font-medium">{roomType.capacity} Person{roomType.capacity > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Rent:</span>
                    <span className="font-medium text-green-600">₹{roomType.monthlyRent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Security Deposit:</span>
                    <span className="font-medium">₹{roomType.securityDeposit.toLocaleString()}</span>
                  </div>
                </div>

                {roomType.amenities && roomType.amenities.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Amenities:</p>
                    <div className="flex flex-wrap gap-1">
                      {roomType.amenities.map((amenity, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {roomType.description && (
                  <p className="text-sm text-gray-600">{roomType.description}</p>
                )}
              </div>
            ))}
          </div>

          {roomTypes.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No room types added yet. Add your first room type using the form.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomTypes;