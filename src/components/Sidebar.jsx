import {
  FaTachometerAlt,
  FaUserPlus,
  FaUsers,
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
  FaQrcode
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useState } from 'react';

const Sidebar = ({ isOpen, onLogout, currentPage, setCurrentPage }) => {
  const [messDropdownOpen, setMessDropdownOpen] = useState(false);

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

  const menuItems = [
    { icon: FaTachometerAlt, label: 'Dashboard', page: 'dashboard' },
    { icon: FaCogs, label: 'Room Management', page: 'roomManagement' },
    { icon: FaClipboardCheck, label: 'Attendance', page: 'attendance' },
    { icon: FaSignInAlt, label: 'Check In/Out', page: 'checkInOut' },
    { icon: FaQuestionCircle, label: 'Student Queries', page: 'studentQueries' },
  ];

  const messSubItems = [
    { icon: FaPlus, label: 'Menu List', page: 'menuManagement' },
    { icon: FaClipboardCheck, label: 'Daily Attendance', page: 'messAttendance' },
    { icon: FaQuestionCircle, label: 'Complaints', page: 'complaintsManagement' },
    { icon: FaQrcode, label: 'Complaint QR', page: 'messComplaintQR' },
  ];

  return (
    <div className={`bg-[#0f172a] text-slate-300 h-screen flex flex-col shadow-2xl transition-all duration-300 ease-in-out border-r border-slate-800 fixed left-0 top-0 z-50 ${isOpen ? 'w-64' : 'w-20'}`}>
      {/* Brand Header */}
      <div className={`h-20 flex items-center ${isOpen ? 'px-6' : 'justify-center'} border-b border-slate-800/50 bg-[#1e293b]/30 flex-shrink-0`}>
        {isOpen ? (
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 flex-shrink-0">
              <FaBed className="text-xl" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-lg tracking-tight leading-tight uppercase">Hostel</span>
              <span className="text-indigo-400 text-[10px] uppercase font-bold tracking-widest leading-none">Management</span>
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <FaBed className="text-xl" />
          </div>
        )}
      </div>

      {/* Navigation Area */}
      <nav className="flex-1 px-3 py-6 overflow-y-auto custom-scrollbar space-y-1.5">
        {/* Main Menu Label */}
        {isOpen && <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">Main Menu</p>}

        {menuItems.map((item, index) => (
          <div
            key={index}
            onClick={() => setCurrentPage(item.page)}
            className={`flex items-center ${isOpen ? 'px-4' : 'justify-center'} py-3 rounded-xl transition-all duration-200 group cursor-pointer ${currentPage === item.page
                ? 'bg-indigo-600/10 text-indigo-400 border-l-4 border-indigo-600'
                : 'hover:bg-slate-800/50 hover:text-white border-l-4 border-transparent'
              }`}
            title={!isOpen ? item.label : ''}
          >
            <item.icon className={`text-lg flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${isOpen ? 'mr-4' : ''}`} />
            {isOpen && <span className="font-semibold text-[14px]">{item.label}</span>}
          </div>
        ))}

        {/* Mess Section Label */}
        <div className="pt-4">
          {isOpen && <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">Dining Services</p>}
          <div
            onClick={() => {
              if (!isOpen) setCurrentPage('menuManagement');
              setMessDropdownOpen(!messDropdownOpen);
            }}
            className={`flex items-center justify-between ${isOpen ? 'px-4' : 'justify-center'} py-3 rounded-xl transition-all duration-200 group cursor-pointer ${(currentPage.includes('mess') || currentPage === 'menuManagement' || currentPage === 'complaintsManagement' || currentPage === 'messAttendance')
                ? 'bg-indigo-600/10 text-indigo-400 border-l-4 border-indigo-600'
                : 'hover:bg-slate-800/50 hover:text-white border-l-4 border-transparent'
              }`}
          >
            <div className="flex items-center">
              <FaUtensils className={`text-lg flex-shrink-0 group-hover:scale-110 duration-200 ${isOpen ? 'mr-4' : ''}`} />
              {isOpen && <span className="font-semibold text-[14px]">Mess Admin</span>}
            </div>
            {isOpen && (
              messDropdownOpen ? <FaChevronDown className="text-[10px]" /> : <FaChevronRight className="text-[10px]" />
            )}
          </div>

          {messDropdownOpen && isOpen && (
            <div className="mt-1 ml-4 space-y-1 border-l border-slate-800/50 pl-2">
              {messSubItems.map((subItem, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentPage(subItem.page)}
                  className={`flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 cursor-pointer text-[13px] ${currentPage === subItem.page
                      ? 'text-indigo-400 font-bold bg-indigo-600/5'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                    }`}
                >
                  <subItem.icon className="mr-3 text-[12px]" />
                  {subItem.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Bottom Profile Area */}
      <div className="mt-auto p-4 border-t border-slate-800 bg-[#1e293b]/20 flex-shrink-0">
        <div className="space-y-1">
          <button
            onClick={() => setCurrentPage('changePassword')}
            className={`flex items-center w-full cursor-pointer ${isOpen ? 'px-4' : 'justify-center'} py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-all duration-200 group`}
            title={!isOpen ? 'Security Settings' : ''}
          >
            <FaKey className={`text-lg flex-shrink-0 group-hover:rotate-12 duration-200 ${isOpen ? 'mr-4' : ''}`} />
            {isOpen && <span className="font-medium text-[14px]">Security</span>}
          </button>

          <button
            onClick={handleLogout}
            className={`flex items-center w-full cursor-pointer ${isOpen ? 'px-4' : 'justify-center'} py-3 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 rounded-xl transition-all duration-200 group`}
            title={!isOpen ? 'Sign Out' : ''}
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