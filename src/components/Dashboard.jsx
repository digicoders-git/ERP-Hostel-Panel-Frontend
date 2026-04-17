import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { dashboardAPI } from '../services/api';
import toast from 'react-hot-toast';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import RoomManagement from './RoomManagement';
import RoomFloorTracking from './RoomFloorTracking';
import BedAllocation from './BedAllocation';
import HostelFeeManagement from './HostelFeeManagement';
import Attendance from './Attendance';
import MessManagement from './MessManagement';
import MenuManagement from './MenuManagement';
import MessAttendance from './MessAttendance';
import ComplaintsManagement from './ComplaintsManagement';
import MessComplaintQR from './MessComplaintQR';
import CheckInOut from './CheckInOut';
import EntryExitMonitoring from './EntryExitMonitoring';
import StudentQueries from './StudentQueries';
import FeeManagement from './FeeManagement';
import ChangePassword from './ChangePassword';
import Analytics from './Analytics';
import ServicesManagement from './ServicesManagement';
import VisitorManagement from './VisitorManagement';
import LeaveGatePassManagement from './LeaveGatePassManagement';
import Profile from './Profile';
import { FaUsers, FaBed, FaClipboardCheck, FaUtensils, FaArrowUp, FaClock, FaCheckCircle, FaExclamationTriangle, FaCogs, FaQuestionCircle, FaMoneyBillWave, FaUserTie } from 'react-icons/fa';

const Dashboard = ({ onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await dashboardAPI.getStats();
      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const DashboardContent = () => {
    const wardenId = localStorage.getItem('wardenId') || 'Warden';
    const stats = dashboardData?.stats;
    const recentActivity = dashboardData?.recentActivity || [];

    const statCards = [
      { 
        icon: FaUsers, 
        label: 'Total Students', 
        value: stats?.totalAllocations?.toString() || '0', 
        change: stats?.totalAllocations > 0 ? 'On Campus' : 'None', 
        trend: 'up', 
        color: 'indigo' 
      },
      { 
        icon: FaBed, 
        label: 'Total Rooms', 
        value: stats?.totalRooms?.toString() || '0', 
        change: 'Inventory', 
        trend: 'up', 
        color: 'blue' 
      },
      { 
        icon: FaClipboardCheck, 
        label: 'Occupied Beds', 
        value: stats?.totalAllocations?.toString() || '0', 
        change: stats?.totalRooms > 0 ? `${Math.round((stats.totalAllocations / (stats.totalRooms * 2)) * 100)}%` : '0%',
        trend: 'up', 
        color: 'emerald' 
      },
      { 
        icon: FaMoneyBillWave, 
        label: 'Pending Dues', 
        value: `₹${(stats?.pendingFees || 0).toLocaleString()}`, 
        change: stats?.pendingFees > 0 ? 'Action Needed' : 'Clear', 
        trend: 'down', 
        color: 'rose' 
      },
    ];

    if (loading && !dashboardData) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }

    return (
      <div className="animate-in space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Main Dashboard</h2>
            <p className="text-slate-500 font-medium tracking-tight">Hostel Monitoring for <span className="text-indigo-600 font-bold">{wardenId}</span></p>
          </div>
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
            <button
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
            >
              School Report
            </button>
            <button
              onClick={() => navigate('/reports')}
              className="px-4 py-2 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all cursor-pointer"
            >
              Stats
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all group card-hover">
              <div className="flex items-start justify-between">
                <div className={`p-4 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="text-2xl" />
                </div>
                <span className={`flex items-center text-[10px] font-black px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600 uppercase tracking-widest`}>
                  {stat.change}
                </span>
              </div>
              <div className="mt-6">
                <p className="text-3xl font-black text-slate-900 leading-none">{stat.value}</p>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-3">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200 relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
                  <FaUsers size={120} />
                </div>
                <h4 className="text-indigo-100 text-xs font-black uppercase tracking-widest mb-4">Daily Check-ins</h4>
                <p className="text-4xl font-black mb-1">
                  {stats?.todayCheckIns || 0}
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
                    {stats?.totalRooms > 0 ? Math.round(((stats.totalRooms - stats.availableRooms) / stats.totalRooms) * 100) : 0}%
                  </p>
                </div>
                <div className="mt-4 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${stats?.totalRooms > 0 ? ((stats.totalRooms - stats.availableRooms) / stats.totalRooms) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-black text-slate-800 tracking-tight flex items-center">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full mr-3 animate-pulse"></span>
                  Resident Movement Logs
                </h3>
                <button
                  className="text-indigo-600 text-xs font-bold hover:underline uppercase tracking-widest"
                >
                  History
                </button>
              </div>
              <div className="p-2">
                {recentActivity.length > 0 ? (
                  recentActivity.map((item, i) => (
                    <div key={i} className="flex items-center p-4 hover:bg-slate-50 rounded-2xl transition-all group cursor-pointer">
                      <div className={`w-12 h-12 rounded-xl bg-${item.action === 'checkin' ? 'emerald' : 'rose'}-50 text-${item.action === 'checkin' ? 'emerald' : 'rose'}-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        {item.action === 'checkin' ? <FaCheckCircle className="text-lg" /> : <FaClock className="text-lg" />}
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-bold text-slate-900">{item.studentName}</p>
                        <p className="text-xs text-slate-500 font-medium truncate max-w-[200px]">{item.action === 'checkin' ? 'Entered Campus' : 'Exit Registered'}</p>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{item.time || new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-400 text-sm font-medium italic">
                    No movement logs for this shift.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#0f172a] rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <FaCogs size={80} />
              </div>
              <h3 className="text-xl font-black mb-1">Quick Tasks</h3>
              <p className="text-slate-400 text-xs font-medium mb-8">Essential warden operations</p>

              <div className="grid grid-cols-1 gap-3">
                {[
                  { label: 'Allot New Room', icon: FaBed, path: '/assign-room', color: 'indigo' },
                  { label: 'Morning Roll Call', icon: FaClipboardCheck, path: '/attendance', color: 'emerald' },
                  { label: 'Collect Monthly Fee', icon: FaMoneyBillWave, path: '/fees', color: 'indigo' },
                  { label: 'Visit Log', icon: FaUserTie, path: '/visitors', color: 'blue' },
                  { label: 'Dining Hall', icon: FaUtensils, path: '/mess/menu', color: 'rose' },
                ].map((act, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(act.path)}
                    className="flex items-center justify-between w-full bg-slate-800/50 hover:bg-white hover:text-slate-900 p-4 rounded-2xl transition-all group border border-slate-700/50 hover:border-white shadow-lg"
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
                <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs">{stats?.pendingComplaints || 0}</div>
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed mb-6 font-medium">New complaints registered via QR system.</p>
              <button
                onClick={() => navigate('/mess/complaints')}
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

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <div className={`flex-shrink-0 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <Sidebar
          isOpen={sidebarOpen}
          onLogout={onLogout}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar
          sidebarOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          role="Warden"
        />

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 custom-scrollbar bg-slate-50">
          <div className="max-w-7xl mx-auto pb-10">
            <Routes>
              <Route path="/" element={<DashboardContent />} />
              <Route path="/manage-rooms" element={<RoomManagement />} />
              <Route path="/building-layout" element={<RoomFloorTracking />} />
              <Route path="/assign-room" element={<BedAllocation />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/gate-pass" element={<LeaveGatePassManagement />} />
              <Route path="/entry-exit" element={<EntryExitMonitoring />} />
              <Route path="/visitors" element={<VisitorManagement />} />
              <Route path="/help-desk" element={<StudentQueries />} />
              <Route path="/fees" element={<HostelFeeManagement />} />
              <Route path="/mess/menu" element={<MenuManagement />} />
              <Route path="/mess/attendance" element={<MessAttendance />} />
              <Route path="/mess/complaints" element={<ComplaintsManagement />} />
              <Route path="/mess/qr" element={<MessComplaintQR />} />
              <Route path="/services" element={<ServicesManagement />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/reports" element={<Analytics onBack={() => navigate('/')} />} />
              <Route path="/security" element={<ChangePassword onNavigate={(path) => navigate(path)} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;