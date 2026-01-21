import { useState } from 'react';
import toast from 'react-hot-toast';
import { FaBed, FaRupeeSign, FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';

const RoomTypeCharge = ({ onNavigate }) => {
  const [roomTypes, setRoomTypes] = useState([
    { id: 1, type: 'Single AC', capacity: 1, rent: 8000, deposit: 15000, facilities: ['AC', 'WiFi', 'Attached Bathroom'] },
    { id: 2, type: 'Single Non-AC', capacity: 1, rent: 6000, deposit: 12000, facilities: ['WiFi', 'Attached Bathroom'] },
    { id: 3, type: 'Double Sharing AC', capacity: 2, rent: 5000, deposit: 10000, facilities: ['AC', 'WiFi', 'Shared Bathroom'] },
    { id: 4, type: 'Triple Sharing', capacity: 3, rent: 4000, deposit: 8000, facilities: ['WiFi', 'Shared Bathroom'] },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    type: '',
    capacity: '',
    rent: '',
    deposit: '',
    facilities: []
  });

  const facilityOptions = ['AC', 'WiFi', 'Attached Bathroom', 'Shared Bathroom', 'Study Table', 'Wardrobe', 'Balcony'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFacilityChange = (facility) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setRoomTypes(prev => prev.map(room => 
        room.id === editingId ? { ...formData, id: editingId } : room
      ));
      toast.success('Room type updated successfully!');
    } else {
      setRoomTypes(prev => [...prev, { ...formData, id: Date.now() }]);
      toast.success('Room type created successfully!');
    }
    resetForm();
    setTimeout(() => {
      onNavigate('roomType');
    }, 1500);
  };

  const resetForm = () => {
    setFormData({ type: '', capacity: '', rent: '', deposit: '', facilities: [] });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (room) => {
    setFormData(room);
    setEditingId(room.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setRoomTypes(prev => prev.filter(room => room.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center">
                  <FaBed className="mr-3" />
                  Room Type & Charges
                </h1>
                <p className="text-purple-100 mt-2">Manage room types and pricing structure</p>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center space-x-2"
              >
                <FaPlus />
                <span>Add Room Type</span>
              </button>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roomTypes.map((room) => (
                <div key={room.id} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800">{room.type}</h3>
                    <div className="flex space-x-2">
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
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Capacity:</span>
                      <span className="font-semibold text-gray-800">{room.capacity} Person(s)</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Monthly Rent:</span>
                      <span className="font-bold text-green-600 flex items-center">
                        <FaRupeeSign className="mr-1" />
                        {room.rent.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Security Deposit:</span>
                      <span className="font-bold text-orange-600 flex items-center">
                        <FaRupeeSign className="mr-1" />
                        {room.deposit.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Facilities:</h4>
                    <div className="flex flex-wrap gap-2">
                      {room.facilities.map((facility, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs rounded-full border border-purple-200"
                        >
                          {facility}
                        </span>
                      ))}
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
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
                <h2 className="text-2xl font-bold text-white">
                  {editingId ? 'Edit Room Type' : 'Add New Room Type'}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto scrollbar-hide">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Room Type</label>
                    <input
                      type="text"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      placeholder="e.g., Single AC"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Capacity</label>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      placeholder="Number of persons"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
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
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Security Deposit (₹)</label>
                    <input
                      type="number"
                      name="deposit"
                      value={formData.deposit}
                      onChange={handleInputChange}
                      placeholder="Security deposit amount"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Facilities</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {facilityOptions.map((facility) => (
                      <label key={facility} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.facilities.includes(facility)}
                          onChange={() => handleFacilityChange(facility)}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <span className="text-gray-700 text-sm">{facility}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-300 flex items-center space-x-2"
                  >
                    <FaTimes />
                    <span>Cancel</span>
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
                  >
                    <FaSave />
                    <span>{editingId ? 'Update' : 'Save'}</span>
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

export default RoomTypeCharge;