import { useState } from 'react';
import toast from 'react-hot-toast';
import { FaBuilding, FaMapMarkerAlt, FaPhone, FaEnvelope, FaUser, FaRupeeSign, FaImage, FaSave, FaTimes } from 'react-icons/fa';

const CreateHostel = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    hostelName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    email: '',
    wardenName: '',
    capacity: '',
    rentPerMonth: '',
    securityDeposit: '',
    facilities: [],
    description: '',
    image: null
  });

  const facilityOptions = [
    'WiFi', 'AC', 'Mess', 'Laundry', 'Parking', 'Security', 'Generator', 'Water Cooler'
  ];

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
    console.log('Hostel Data:', formData);
    toast.success('Hostel created successfully!');
    setTimeout(() => {
      onNavigate('dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
            <h1 className="text-3xl font-bold text-white flex items-center">
              <FaBuilding className="mr-3" />
              Create New Hostel
            </h1>
            <p className="text-blue-100 mt-2">Add a new hostel to your management system</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-hide">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <FaBuilding className="mr-2 text-blue-600" />
                    Basic Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="relative">
                      <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="hostelName"
                        placeholder="Hostel Name"
                        value={formData.hostelName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        required
                      />
                    </div>

                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                      <textarea
                        name="address"
                        placeholder="Complete Address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        required
                      />
                      <input
                        type="text"
                        name="state"
                        placeholder="State"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        required
                      />
                    </div>

                    <input
                      type="text"
                      name="pincode"
                      placeholder="Pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      required
                    />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <FaPhone className="mr-2 text-green-600" />
                    Contact Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="relative">
                      <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                        required
                      />
                    </div>

                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                        required
                      />
                    </div>

                    <div className="relative">
                      <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="wardenName"
                        placeholder="Warden Name"
                        value={formData.wardenName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <FaRupeeSign className="mr-2 text-purple-600" />
                    Pricing & Capacity
                  </h3>
                  
                  <div className="space-y-4">
                    <input
                      type="number"
                      name="capacity"
                      placeholder="Total Capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                      required
                    />

                    <div className="relative">
                      <FaRupeeSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        name="rentPerMonth"
                        placeholder="Rent Per Month"
                        value={formData.rentPerMonth}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                        required
                      />
                    </div>

                    <div className="relative">
                      <FaRupeeSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        name="securityDeposit"
                        placeholder="Security Deposit"
                        value={formData.securityDeposit}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-2xl border border-orange-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Facilities</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {facilityOptions.map((facility) => (
                      <label key={facility} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.facilities.includes(facility)}
                          onChange={() => handleFacilityChange(facility)}
                          className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="text-gray-700">{facility}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-2xl border border-teal-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Description</h3>
                  <textarea
                    name="description"
                    placeholder="Hostel Description..."
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-300 flex items-center space-x-2"
              >
                <FaTimes />
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
              >
                <FaSave />
                <span>Create Hostel</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateHostel;