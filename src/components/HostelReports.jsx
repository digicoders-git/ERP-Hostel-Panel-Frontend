import { useState } from 'react';
import { FaChartBar, FaDownload, FaCalendar, FaFilter, FaUsers, FaBed, FaRupeeSign, FaBuilding, FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';

const HostelReports = () => {
  const [reportType, setReportType] = useState('overview');
  const [dateRange, setDateRange] = useState('thisMonth');

  const overviewStats = [
    { title: 'Total Students', value: '186', change: '+12', trend: 'up', color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50' },
    { title: 'Total Rooms', value: '248', change: '+8', trend: 'up', color: 'from-green-500 to-green-600', bgColor: 'bg-green-50' },
    { title: 'Occupancy Rate', value: '75%', change: '+5%', trend: 'up', color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50' },
    { title: 'Monthly Revenue', value: '₹12.4L', change: '+15%', trend: 'up', color: 'from-orange-500 to-orange-600', bgColor: 'bg-orange-50' },
  ];

  const hostelData = [
    { name: 'Boys Hostel A', students: 65, capacity: 80, revenue: '₹3.2L', occupancy: '81%' },
    { name: 'Boys Hostel B', students: 48, capacity: 60, revenue: '₹2.4L', occupancy: '80%' },
    { name: 'Girls Hostel A', students: 42, capacity: 54, revenue: '₹3.8L', occupancy: '78%' },
    { name: 'Girls Hostel B', students: 31, capacity: 54, revenue: '₹3.0L', occupancy: '57%' },
  ];

  const monthlyData = [
    { month: 'Jan', students: 165, revenue: 980000 },
    { month: 'Feb', students: 172, revenue: 1020000 },
    { month: 'Mar', students: 180, revenue: 1080000 },
    { month: 'Apr', students: 186, revenue: 1240000 },
  ];

  const roomTypeData = [
    { type: 'Single AC', count: 45, occupied: 38, revenue: '₹3.04L' },
    { type: 'Single Non-AC', count: 35, occupied: 28, revenue: '₹1.68L' },
    { type: 'Double Sharing AC', count: 80, occupied: 65, revenue: '₹3.25L' },
    { type: 'Double Sharing', count: 60, occupied: 42, revenue: '₹1.68L' },
    { type: 'Triple Sharing', count: 28, occupied: 13, revenue: '₹0.52L' },
  ];

  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'up': return <FaArrowUp className="text-green-500" />;
      case 'down': return <FaArrowDown className="text-red-500" />;
      default: return <FaMinus className="text-gray-500" />;
    }
  };

  const generateReport = () => {
    alert('Report generated successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          <div className="bg-gradient-to-r from-rose-600 to-pink-600 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center">
                  <FaChartBar className="mr-3" />
                  Hostel Reports
                </h1>
                <p className="text-rose-100 mt-2">Comprehensive analytics and reporting dashboard</p>
              </div>
              <div className="flex space-x-4">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-4 py-2 bg-white/20 text-white rounded-xl border border-white/30 focus:outline-none"
                >
                  <option value="thisMonth">This Month</option>
                  <option value="lastMonth">Last Month</option>
                  <option value="thisYear">This Year</option>
                </select>
                <button
                  onClick={generateReport}
                  className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-xl transition-all duration-300 flex items-center space-x-2"
                >
                  <FaDownload />
                  <span>Export</span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="flex flex-wrap gap-4 mb-8">
              {['overview', 'hostels', 'rooms', 'revenue'].map((type) => (
                <button
                  key={type}
                  onClick={() => setReportType(type)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    reportType === type
                      ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            {reportType === 'overview' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {overviewStats.map((stat, index) => (
                    <div key={index} className={`${stat.bgColor} rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 border border-white/50`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-xl shadow-lg`}>
                          <FaChartBar className="text-white text-xl" />
                        </div>
                        <div className="flex items-center space-x-1">
                          {getTrendIcon(stat.trend)}
                          <span className="text-sm font-semibold text-green-600">{stat.change}</span>
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                      <p className="text-gray-600 text-sm">{stat.title}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-6 border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Monthly Trends</h3>
                    <div className="space-y-4">
                      {monthlyData.map((data, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl">
                          <div>
                            <p className="font-semibold text-gray-800">{data.month}</p>
                            <p className="text-sm text-gray-600">{data.students} Students</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">₹{(data.revenue / 100000).toFixed(1)}L</p>
                            <p className="text-sm text-gray-600">Revenue</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-6 border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Stats</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <FaUsers className="text-blue-600 text-xl" />
                          <span className="font-semibold text-gray-800">New Admissions</span>
                        </div>
                        <span className="text-2xl font-bold text-blue-600">24</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <FaBed className="text-green-600 text-xl" />
                          <span className="font-semibold text-gray-800">Available Rooms</span>
                        </div>
                        <span className="text-2xl font-bold text-green-600">62</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <FaRupeeSign className="text-purple-600 text-xl" />
                          <span className="font-semibold text-gray-800">Pending Payments</span>
                        </div>
                        <span className="text-2xl font-bold text-purple-600">₹2.1L</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {reportType === 'hostels' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {hostelData.map((hostel, index) => (
                  <div key={index} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-800">{hostel.name}</h3>
                      <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <FaBuilding className="text-white text-xl" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Students:</span>
                        <span className="font-bold text-gray-800">{hostel.students}/{hostel.capacity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Occupancy:</span>
                        <span className="font-bold text-blue-600">{hostel.occupancy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Revenue:</span>
                        <span className="font-bold text-green-600">{hostel.revenue}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-rose-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: hostel.occupancy }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {reportType === 'rooms' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roomTypeData.map((room, index) => (
                  <div key={index} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-800">{room.type}</h3>
                      <FaBed className="text-rose-500 text-xl" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Rooms:</span>
                        <span className="font-bold text-gray-800">{room.count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Occupied:</span>
                        <span className="font-bold text-blue-600">{room.occupied}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Revenue:</span>
                        <span className="font-bold text-green-600">{room.revenue}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-rose-500 to-pink-500 h-2 rounded-full"
                          style={{ width: `${(room.occupied / room.count) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {reportType === 'revenue' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white">
                    <h3 className="text-lg font-bold mb-2">Total Revenue</h3>
                    <p className="text-3xl font-bold">₹12.4L</p>
                    <p className="text-green-200 text-sm">This Month</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-xl p-6 text-white">
                    <h3 className="text-lg font-bold mb-2">Pending Amount</h3>
                    <p className="text-3xl font-bold">₹2.1L</p>
                    <p className="text-blue-200 text-sm">Outstanding</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-xl p-6 text-white">
                    <h3 className="text-lg font-bold mb-2">Collection Rate</h3>
                    <p className="text-3xl font-bold">85%</p>
                    <p className="text-purple-200 text-sm">This Month</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-6 border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Revenue Breakdown</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {hostelData.map((hostel, index) => (
                      <div key={index} className="p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-800">{hostel.name}</span>
                          <span className="text-xl font-bold text-green-600">{hostel.revenue}</span>
                        </div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-rose-500 to-pink-500 h-2 rounded-full"
                            style={{ width: `${(parseFloat(hostel.revenue.replace('₹', '').replace('L', '')) / 12.4) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostelReports;