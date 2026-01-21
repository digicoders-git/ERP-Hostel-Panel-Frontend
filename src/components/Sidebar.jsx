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
      title: 'Are you sure?',
      text: 'You will be logged out of your account',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Logged Out!',
          'You have been successfully logged out.',
          'success'
        ).then(() => {
          onLogout();
        });
      }
    });
  };

  const menuItems = [
    { icon: FaTachometerAlt, label: 'Dashboard', page: 'dashboard' },
    { icon: FaCogs, label: 'Room Management', page: 'roomManagement' },
    { icon: FaClipboardCheck, label: 'Attendance', page: 'attendance' },
    { icon: FaSignInAlt, label: 'Check In/Out', page: 'checkInOut' },
    { icon: FaQuestionCircle, label: 'Student Queries', page: 'studentQueries' },
    
    { icon: FaKey, label: 'Change Password', page: 'changePassword' },
  ];

  const messSubItems = [
    { icon: FaPlus, label: 'Menu Management', page: 'menuManagement' },
    { icon: FaClipboardCheck, label: 'Mess Attendance', page: 'messAttendance' },
    { icon: FaQuestionCircle, label: 'Complaints', page: 'complaintsManagement' },
    { icon: FaQrcode, label: 'QR for Complaints', page: 'messComplaintQR' },
  ];
  
  return (
    <div className={`fixed left-0 top-0 h-full bg-gray-900 text-white transition-all duration-300 z-50 overflow-y-auto flex flex-col ${
      isOpen ? 'w-64' : 'w-16'
    }`}>
      <div className="p-4 flex flex-col flex-shrink-0  ">
        <h2 className={`font-bold text-xl ${isOpen ? 'block' : 'hidden'} flex items-center justify-center`}>
          <FaBed className="mr-2" />
          Hostel Panel
        </h2>
        <span className={`text-sm ${isOpen ? 'block' : 'hidden'} flex items-center justify-center`}>ERP SCHOOL SYSTEM</span>
      </div>
      
      <nav className="mt-4 flex-1 pb-20">
        {menuItems.map((item, index) => (
          <div
            key={index}
            onClick={() => setCurrentPage(item.page)}
            className={`flex items-center px-4 py-3 hover:bg-gray-800 cursor-pointer transition-colors ${
              currentPage === item.page ? 'bg-blue-600 border-r-4 border-blue-400' : ''
            }`}
          >
            <item.icon className="text-xl" />
            <span className={`ml-4 ${isOpen ? 'block' : 'hidden'}`}>
              {item.label}
            </span>
          </div>
        ))}
        
        {/* Mess Management Dropdown */}
        <div>
          <div
            onClick={() => setMessDropdownOpen(!messDropdownOpen)}
            className={`flex items-center justify-between px-4 py-3 hover:bg-gray-800 cursor-pointer transition-colors ${
              currentPage.includes('mess') || currentPage === 'menuManagement' || currentPage === 'messAttendance' || currentPage === 'complaintsManagement' ? 'bg-blue-600 border-r-4 border-blue-400' : ''
            }`}
          >
            <div className="flex items-center">
              <FaUtensils className="text-xl" />
              <span className={`ml-4 ${isOpen ? 'block' : 'hidden'}`}>
                Mess Management
              </span>
            </div>
            {isOpen && (
              messDropdownOpen ? 
                <FaChevronDown className="text-sm" /> : 
                <FaChevronRight className="text-sm" />
            )}
          </div>
          
          {messDropdownOpen && isOpen && (
            <div className="bg-gray-800">
              {messSubItems.map((subItem, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentPage(subItem.page)}
                  className="flex items-center px-8 py-2 hover:bg-gray-700 cursor-pointer transition-colors text-sm"
                >
                  <subItem.icon className="text-base mr-3" />
                  {subItem.label}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div
          onClick={handleLogout}
          className="flex items-center px-4 py-3 hover:bg-red-600 cursor-pointer transition-colors mt-4 flex-shrink-0"
        >
          <FaSignOutAlt className="text-xl" />
          <span className={`ml-4 ${isOpen ? 'block' : 'hidden'}`}>
            Logout
          </span>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;