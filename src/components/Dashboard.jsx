import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import RoomManagement from './RoomManagement';
import Attendance from './Attendance';
import MessManagement from './MessManagement';
import MenuManagement from './MenuManagement';
import MessAttendance from './MessAttendance';
import ComplaintsManagement from './ComplaintsManagement';
import MessComplaintQR from './MessComplaintQR';
import CheckInOut from './CheckInOut';
import StudentQueries from './StudentQueries';
import ChangePassword from './ChangePassword';
import { FaUsers, FaBed, FaClipboardCheck, FaUtensils, FaArrowUp, FaClock, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const Dashboard = ({ onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('currentPage') || 'dashboard';
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
    localStorage.setItem('currentPage', page);
  };

  const DashboardContent = () => {
    const wardenId = localStorage.getItem('wardenId') || 'WRD001';
    
    // Initialize default data if not exists
    if (!localStorage.getItem('students')) {
      const defaultStudents = [
        { id: 1, name: 'Rahul Kumar', rollNumber: 'CS001', email: 'rahul@email.com', phone: '9876543210', course: 'B.Tech', year: '2nd', status: 'Active', joinDate: '2024-01-15' },
        { id: 2, name: 'Priya Sharma', rollNumber: 'CS002', email: 'priya@email.com', phone: '9876543211', course: 'B.Tech', year: '1st', status: 'Active', joinDate: '2024-01-16' },
        { id: 3, name: 'Amit Singh', rollNumber: 'CS003', email: 'amit@email.com', phone: '9876543212', course: 'MCA', year: '1st', status: 'Active', joinDate: '2024-01-17' }
      ];
      localStorage.setItem('students', JSON.stringify(defaultStudents));
    }
    
    if (!localStorage.getItem('roomTypes')) {
      const defaultRoomTypes = [
        { id: 1, name: 'Single AC', capacity: 1, monthlyRent: 8000, securityDeposit: 5000, amenities: ['AC', 'WiFi', 'Study Table'], description: 'AC single room' },
        { id: 2, name: 'Double AC', capacity: 2, monthlyRent: 6000, securityDeposit: 4000, amenities: ['AC', 'WiFi', 'Study Tables'], description: 'AC double sharing' }
      ];
      localStorage.setItem('roomTypes', JSON.stringify(defaultRoomTypes));
    }
    
    if (!localStorage.getItem('rooms')) {
      const roomTypes = JSON.parse(localStorage.getItem('roomTypes'));
      const defaultRooms = [
        { id: 1, number: '101', typeId: roomTypes[0].id, floor: 1, capacity: roomTypes[0].capacity, status: 'Available' },
        { id: 2, number: '102', typeId: roomTypes[1].id, floor: 1, capacity: roomTypes[1].capacity, status: 'Available' },
        { id: 3, number: '201', typeId: roomTypes[0].id, floor: 2, capacity: roomTypes[0].capacity, status: 'Available' }
      ];
      localStorage.setItem('rooms', JSON.stringify(defaultRooms));
    }
    
    if (!localStorage.getItem('roomAllocations')) {
      const defaultAllocations = [
        { id: 1, studentId: 1, roomId: 1, studentName: 'Rahul Kumar', roomNumber: '101', allocatedDate: '2024-01-15', status: 'Active' },
        { id: 2, studentId: 2, roomId: 2, studentName: 'Priya Sharma', roomNumber: '102', allocatedDate: '2024-01-16', status: 'Active' }
      ];
      localStorage.setItem('roomAllocations', JSON.stringify(defaultAllocations));
    }
    
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const rooms = JSON.parse(localStorage.getItem('rooms') || '[]');
    const allocations = JSON.parse(localStorage.getItem('roomAllocations') || '[]');
    const queries = JSON.parse(localStorage.getItem('studentQueries') || '[]');
    
    const stats = [
      { icon: FaUsers, label: 'Total Students', value: students.length.toString(), change: '+2', color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50' },
      { icon: FaBed, label: 'Total Rooms', value: rooms.length.toString(), change: '+5', color: 'from-green-500 to-green-600', bgColor: 'bg-green-50' },
      { icon: FaClipboardCheck, label: 'Allocated Rooms', value: allocations.length.toString(), change: '+3', color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50' },
      { icon: FaUtensils, label: 'Mess Registered', value: JSON.parse(localStorage.getItem('messRegistrations') || '[]').length.toString(), change: '+1', color: 'from-orange-500 to-orange-600', bgColor: 'bg-orange-50' },
    ];

    return (
      <main className="p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Warden Dashboard</h2>
          <p className="text-gray-600 mt-2">Welcome back, {wardenId}! Here's your hostel overview.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className={`${stat.bgColor} rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 border border-white/50`}>
              <div className="flex items-center justify-between">
                <div className={`bg-gradient-to-r ${stat.color} p-4 rounded-xl shadow-lg`}>
                  <stat.icon className="text-white text-2xl" />
                </div>
                <div className="flex items-center text-green-600 text-sm font-semibold">
                  <FaArrowUp className="mr-1" />
                  {stat.change}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
            <h4 className="text-lg font-bold mb-2">Today's Check-ins</h4>
            <p className="text-3xl font-bold">{JSON.parse(localStorage.getItem('checkInOutRecords') || '[]').filter(r => r.date === new Date().toISOString().split('T')[0] && r.action === 'checkin').length}</p>
            <p className="text-indigo-200 text-sm">Students checked in today</p>
          </div>
          <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl shadow-xl p-6 text-white">
            <h4 className="text-lg font-bold mb-2">Present Today</h4>
            <p className="text-3xl font-bold">{(() => {
              const today = new Date().toISOString().split('T')[0];
              const morningAttendance = JSON.parse(localStorage.getItem(`attendance_${today}_morning`) || '{}');
              return Object.values(morningAttendance).filter(status => status === 'present').length;
            })()}</p>
            <p className="text-pink-200 text-sm">Morning attendance</p>
          </div>
          <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl shadow-xl p-6 text-white">
            <h4 className="text-lg font-bold mb-2">Room Occupancy</h4>
            <p className="text-3xl font-bold">{rooms.length > 0 ? Math.round((allocations.length / rooms.length) * 100) : 0}%</p>
            <p className="text-teal-200 text-sm">Current occupancy rate</p>
          </div>
        </div>
        <br />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Recent Activities</h3>
              <FaClock className="text-gray-400" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-l-4 border-green-500">
                <FaCheckCircle className="text-green-500 text-lg mr-4" />
                <div>
                  <p className="text-gray-800 font-medium">{allocations.length > 0 ? `${allocations[allocations.length-1].studentName} allocated to Room ${allocations[allocations.length-1].roomNumber}` : 'No recent allocations'}</p>
                  <p className="text-gray-500 text-sm">Recent activity</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-l-4 border-blue-500">
                <FaCheckCircle className="text-blue-500 text-lg mr-4" />
                <div>
                  <p className="text-gray-800 font-medium">Room {rooms.length > 0 ? rooms[rooms.length-1].number : 'N/A'} status updated</p>
                  <p className="text-gray-500 text-sm">Room management</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-l-4 border-orange-500">
                <FaExclamationTriangle className="text-orange-500 text-lg mr-4" />
                <div>
                  <p className="text-gray-800 font-medium">{queries.length} student queries pending</p>
                  <p className="text-gray-500 text-sm">Requires attention</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/50">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h3>
            <div className="space-y-4">
              <button 
                onClick={() => handlePageChange('roomManagement')}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
              >
                Manage Rooms
              </button>
              <button 
                onClick={() => handlePageChange('attendance')}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
              >
                Take Attendance
              </button>
              <button 
                onClick={() => handlePageChange('messManagement')}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
              >
                Mess Management
              </button>
              <button 
                onClick={() => handlePageChange('studentQueries')}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
              >
                View Queries
              </button>
            </div>
          </div>
        </div>
        
       
      </main>
    );
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'roomManagement':
        return <RoomManagement />;
      case 'attendance':
        return <Attendance />;
      case 'messManagement':
        return <MessManagement />;
      case 'menuManagement':
        return <MenuManagement />;
      case 'messAttendance':
        return <MessAttendance />;
      case 'complaintsManagement':
        return <ComplaintsManagement />;
      case 'messComplaintQR':
        return <MessComplaintQR />;
      case 'checkInOut':
        return <CheckInOut />;
      case 'studentQueries':
        return <StudentQueries />;
      case 'changePassword':
        return <ChangePassword onNavigate={setCurrentPage} />;
      case 'dashboard':
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <Sidebar 
        isOpen={sidebarOpen} 
        onLogout={onLogout}
        currentPage={currentPage}
        setCurrentPage={handlePageChange}
      />
      
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'} pt-20`}>
        <Navbar 
          sidebarOpen={sidebarOpen} 
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          role="Warden"
        />
        
        {renderPage()}
      </div>
    </div>
  );
};

export default Dashboard;