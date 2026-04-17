import {
  FaTachometerAlt,
  FaBed,
  FaCogs,
  FaClipboardCheck,
  FaUtensils,
  FaSignInAlt,
  FaQuestionCircle,
  FaKey,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronRight,
  FaPlus,
  FaQrcode,
  FaMoneyBillWave,
  FaBuilding,
  FaUserTie,
  FaFileAlt,
  FaChartLine,
  FaUserPlus,
  FaMagic,
  FaUser,
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, onLogout }) => {
  const [messDropdownOpen, setMessDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    Swal.fire({
      title: 'Sign Out?',
      text: 'Are you sure you want to log out?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4F46E5',
      cancelButtonColor: '#F43F5E',
      confirmButtonText: 'Yes, Logout',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        onLogout();
      }
    });
  };

  const NavItem = ({ icon: Icon, label, path, active = false }) => {
    const isActive = location.pathname === path;
    
    return (
      <div
        onClick={() => navigate(path)}
        className={`flex items-center ${isOpen ? 'px-4' : 'justify-center'} py-2.5 rounded-xl transition-all duration-200 group cursor-pointer mb-1 ${isActive
          ? 'bg-indigo-600/10 text-indigo-400 border-l-4 border-indigo-600'
          : 'hover:bg-slate-800/50 hover:text-white border-l-4 border-transparent'
          }`}
      >
        <Icon className={`text-lg flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${isOpen ? 'mr-4' : ''}`} />
        {isOpen && <span className="font-semibold text-[14px]">{label}</span>}
      </div>
    );
  };

  const SectionLabel = ({ label }) => (
    isOpen ? <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 mt-6">{label}</p> : <div className="h-px bg-slate-800/50 mx-4 my-6" />
  );

  return (
    <div className={`bg-[#0f172a] text-slate-300 h-screen flex flex-col shadow-2xl transition-all duration-300 ease-in-out border-r border-slate-800 fixed left-0 top-0 z-50 ${isOpen ? 'w-64' : 'w-20'}`}>
      {/* Brand Header */}
      <div className={`h-24 flex items-center ${isOpen ? 'px-6' : 'justify-center'} border-b border-slate-800/50 bg-[#1e293b]/30 flex-shrink-0`}>
        {isOpen ? (
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 flex-shrink-0">
              <FaBed className="text-2xl" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-black text-xl tracking-tight leading-none uppercase">Hostel</span>
              <span className="text-indigo-400 text-[10px] uppercase font-black tracking-widest mt-1">School System</span>
            </div>
          </div>
        ) : (
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
            <FaBed className="text-2xl" />
          </div>
        )}
      </div>

      {/* Navigation Area */}
      <nav className="flex-1 px-3 py-6 overflow-y-auto custom-scrollbar">
        <NavItem icon={FaTachometerAlt} label="Main Dashboard" path="/" />
        <NavItem icon={FaUser} label="My Profile" path="/profile" />
        
        <SectionLabel label="Hostel Admission" />
        <NavItem icon={FaCogs} label="Rooms List" path="/manage-rooms" />
        <NavItem icon={FaBuilding} label="Building View" path="/building-layout" />
        <NavItem icon={FaUserPlus} label="Assign Room" path="/assign-room" />
        
        <SectionLabel label="School Life" />
        <NavItem icon={FaClipboardCheck} label="Daily Attendance" path="/attendance" />
        <NavItem icon={FaFileAlt} label="Gate Pass" path="/gate-pass" />
        <NavItem icon={FaSignInAlt} label="In/Out Log" path="/entry-exit" />
        <NavItem icon={FaUserTie} label="Visitor Book" path="/visitors" />
        <NavItem icon={FaQuestionCircle} label="Help / Requests" path="/help-desk" />

        <SectionLabel label="Student Fees" />
        <NavItem icon={FaMoneyBillWave} label="Fee Collection" path="/fees" />

        <SectionLabel label="Dining Hall" />
        <div
            onClick={() => {
              if (!isOpen) navigate('/mess/menu');
              setMessDropdownOpen(!messDropdownOpen);
            }}
            className={`flex items-center justify-between ${isOpen ? 'px-4' : 'justify-center'} py-3 rounded-xl transition-all duration-200 group cursor-pointer ${location.pathname.startsWith('/mess')
              ? 'bg-indigo-600/10 text-indigo-400 border-l-4 border-indigo-600'
              : 'hover:bg-slate-800/50 hover:text-white border-l-4 border-transparent'
              }`}
          >
            <div className="flex items-center">
              <FaUtensils className={`text-lg flex-shrink-0 group-hover:scale-110 duration-200 ${isOpen ? 'mr-4' : ''}`} />
              {isOpen && <span className="font-semibold text-[14px]">Mess Hall</span>}
            </div>
            {isOpen && (
              messDropdownOpen ? <FaChevronDown className="text-[10px]" /> : <FaChevronRight className="text-[10px]" />
            )}
          </div>

          {messDropdownOpen && isOpen && (
            <div className="mt-1 ml-4 space-y-1 border-l border-slate-800/50 pl-2 animate-in slide-in-from-top-2">
              {[
                { label: 'Today\'s Menu', icon: FaPlus, path: '/mess/menu' },
                { label: 'Food Attendance', icon: FaClipboardCheck, path: '/mess/attendance' },
                { label: 'Meal Feedback', icon: FaQuestionCircle, path: '/mess/complaints' },
                { label: 'Scanner Code', icon: FaQrcode, path: '/mess/qr' },
              ].map((subItem, index) => (
                <div
                  key={index}
                  onClick={() => navigate(subItem.path)}
                  className={`flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 cursor-pointer text-[13px] ${location.pathname === subItem.path
                    ? 'text-indigo-400 font-bold bg-indigo-600/10'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                    }`}
                >
                  <subItem.icon className="mr-3 text-[12px]" />
                  {subItem.label}
                </div>
              ))}
            </div>
          )}

        <SectionLabel label="Reports" />
        <NavItem icon={FaChartLine} label="Work Analytics" path="/reports" />
        <NavItem icon={FaMagic} label="Other Services" path="/services" />
      </nav>

      {/* Bottom Profile Area */}
      <div className="mt-auto p-4 border-t border-slate-800 bg-[#1e293b]/50">
        <div className="space-y-1">
          <button
            onClick={() => navigate('/security')}
            className={`flex items-center w-full cursor-pointer ${isOpen ? 'px-4' : 'justify-center'} py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-all duration-200 group`}
          >
            <FaKey className={`text-lg flex-shrink-0 group-hover:rotate-12 duration-200 ${isOpen ? 'mr-4' : ''}`} />
            {isOpen && <span className="font-medium text-[14px]">Security</span>}
          </button>

          <button
            onClick={handleLogout}
            className={`flex items-center w-full cursor-pointer ${isOpen ? 'px-4' : 'justify-center'} py-3 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 rounded-xl transition-all duration-200 group`}
          >
            <FaSignOutAlt className={`text-lg flex-shrink-0 group-hover:translate-x-1 duration-200 ${isOpen ? 'mr-4' : ''}`} />
            {isOpen && <span className="font-medium text-[14px]">Sign Out</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;