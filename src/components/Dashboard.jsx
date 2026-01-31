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
import FeeManagement from './FeeManagement';
import ChangePassword from './ChangePassword';
import Analytics from './Analytics';
import { FaUsers, FaBed, FaClipboardCheck, FaUtensils, FaArrowUp, FaClock, FaCheckCircle, FaExclamationTriangle, FaCogs, FaQuestionCircle, FaMoneyBillWave } from 'react-icons/fa';

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

    // Data fetching (existing logic preserved)
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const rooms = JSON.parse(localStorage.getItem('rooms') || '[]');
    const allocations = JSON.parse(localStorage.getItem('roomAllocations') || '[]');
    const queries = JSON.parse(localStorage.getItem('studentQueries') || '[]');

    const stats = [
      { icon: FaUsers, label: 'Resident Students', value: students.length.toString(), change: '+2', trend: 'up', color: 'indigo' },
      { icon: FaBed, label: 'Total Capacity', value: rooms.length.toString(), change: '+5', trend: 'up', color: 'blue' },
      { icon: FaClipboardCheck, label: 'Active Allotments', value: allocations.length.toString(), change: '+12%', trend: 'up', color: 'emerald' },
      { icon: FaUtensils, label: 'Mess Registered', value: JSON.parse(localStorage.getItem('messRegistrations') || '[]').length.toString(), change: '+1', trend: 'up', color: 'rose' },
    ];

    return (
      <div className="animate-in space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Hostel Overview</h2>
            <p className="text-slate-500 font-medium">Monitoring system active for <span className="text-indigo-600 font-bold">{wardenId}</span></p>
          </div>
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
              data-tooltip="Download Today's Report"
            >
              Today's Report
            </button>
            <button
              onClick={() => handlePageChange('analytics')}
              className="px-4 py-2 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all cursor-pointer"
              data-tooltip="View Detailed Analytics"
            >
              Analytics
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all group card-hover">
              <div className="flex items-start justify-between">
                <div className={`p-4 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="text-2xl" />
                </div>
                <span className={`flex items-center text-[11px] font-bold px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600`}>
                  <FaArrowUp className="mr-1 text-[8px]" /> {stat.change}
                </span>
              </div>
              <div className="mt-6">
                <p className="text-3xl font-black text-slate-900 leading-none">{stat.value}</p>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-2">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Activity Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Live Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200 relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
                  <FaUsers size={120} />
                </div>
                <h4 className="text-indigo-100 text-xs font-black uppercase tracking-widest mb-4">Daily Check-ins</h4>
                <p className="text-4xl font-black mb-1">
                  {JSON.parse(localStorage.getItem('checkInOutRecords') || '[]').filter(r => r.date === new Date().toISOString().split('T')[0] && r.action === 'checkin').length}
                </p>
                <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">LIVE UPDATES</span>
              </div>

              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-slate-200 relative overflow-hidden group border border-slate-700">
                <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
                  <FaClipboardCheck size={120} />
                </div>
                <h4 className="text-slate-400 text-xs font-black uppercase tracking-widest mb-4">Attendance Rank</h4>
                <p className="text-4xl font-black mb-1">94%</p>
                <span className="text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded-full text-slate-300">High Attendance</span>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm overflow-hidden relative group">
                <h4 className="text-slate-400 text-xs font-black uppercase tracking-widest mb-4">Room Occupancy</h4>
                <div className="flex items-end gap-2">
                  <p className="text-4xl font-black text-slate-900">
                    {rooms.length > 0 ? Math.round((allocations.length / rooms.length) * 100) : 0}%
                  </p>
                </div>
                <div className="mt-4 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${rooms.length > 0 ? (allocations.length / rooms.length) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Recent Logs Table/List */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-black text-slate-800 tracking-tight flex items-center">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full mr-3 animate-pulse"></span>
                  Activity Logs
                </h3>
                <button
                  className="text-indigo-600 text-xs font-bold hover:underline"
                  data-tooltip="View All Activity Logs"
                >
                  View All
                </button>
              </div>
              <div className="p-2">
                {[
                  { title: 'New Allotment', desc: allocations.length > 0 ? `${allocations[allocations.length - 1].studentName} coded to ${allocations[allocations.length - 1].roomNumber}` : 'Syncing...', time: '2m ago', icon: FaCheckCircle, color: 'emerald' },
                  { title: 'Maintenance Update', desc: `Room ${rooms.length > 0 ? rooms[rooms.length - 1].number : 'NA'} inspection completed`, time: '45m ago', icon: FaCogs, color: 'blue' },
                  { title: 'Student Queries', desc: `${queries.length} requests awaiting warden approval`, time: '1h ago', icon: FaExclamationTriangle, color: 'rose' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center p-4 hover:bg-slate-50 rounded-2xl transition-all group cursor-pointer">
                    <div className={`w-12 h-12 rounded-xl bg-${item.color}-50 text-${item.color}-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <item.icon className="text-lg" />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-bold text-slate-900">{item.title}</p>
                      <p className="text-xs text-slate-500 font-medium truncate max-w-[200px]">{item.desc}</p>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-6">
            <div className="bg-[#0f172a] rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <FaCogs size={80} />
              </div>
              <h3 className="text-xl font-black mb-2">Smart Actions</h3>
              <p className="text-slate-400 text-xs font-medium mb-8">Execute administrative tasks instantly</p>

              <div className="grid grid-cols-1 gap-3">
                {[
                  { label: 'Room Audit', icon: FaBed, page: 'roomManagement', color: 'indigo' },
                  { label: 'Mark Attendance', icon: FaClipboardCheck, page: 'attendance', color: 'emerald' },
                  { label: 'Fee Tracking', icon: FaMoneyBillWave, page: 'feeManagement', color: 'indigo' },
                  { label: 'Mess Control', icon: FaUtensils, page: 'messManagement', color: 'rose' },
                  { label: 'All Queries', icon: FaQuestionCircle, page: 'studentQueries', color: 'amber' },
                ].map((act, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(act.page)}
                    className="flex items-center justify-between w-full bg-slate-800/50 hover:bg-white hover:text-slate-900 p-4 rounded-2xl transition-all group border border-slate-700/50 hover:border-white shadow-lg"
                    data-tooltip={`Go to ${act.label}`}
                  >
                    <span className="font-bold text-sm tracking-tight">{act.label}</span>
                    <act.icon className="text-slate-500 group-hover:text-indigo-600 transition-colors" />
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-black text-slate-800 text-sm">Mess Complaints</h4>
                <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs">{queries.length}</div>
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed mb-6 font-medium">New complaints registered via QR system. Review and take action to maintain mess quality standards.</p>
              <button
                onClick={() => handlePageChange('complaintsManagement')}
                className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
              >
                Review Complaints
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'roomManagement': return <RoomManagement />;
      case 'attendance': return <Attendance />;
      case 'messManagement': return <MessManagement />;
      case 'menuManagement': return <MenuManagement />;
      case 'messAttendance': return <MessAttendance />;
      case 'complaintsManagement': return <ComplaintsManagement />;
      case 'messComplaintQR': return <MessComplaintQR />;
      case 'checkInOut': return <CheckInOut />;
      case 'feeManagement': return <FeeManagement />;
      case 'studentQueries': return <StudentQueries />;
      case 'changePassword': return <ChangePassword onNavigate={setCurrentPage} />;
      case 'analytics': return <Analytics onBack={() => handlePageChange('dashboard')} />;
      case 'dashboard':
      default: return <DashboardContent />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar - Fixed Width */}
      <div className={`flex-shrink-0 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <Sidebar
          isOpen={sidebarOpen}
          onLogout={onLogout}
          currentPage={currentPage}
          setCurrentPage={handlePageChange}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Navbar */}
        <Navbar
          sidebarOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          role="Warden"
        />

        {/* Page Content - Independent Scroll */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 custom-scrollbar bg-slate-50">
          <div className="max-w-7xl mx-auto pb-10">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;