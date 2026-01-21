import { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = ({ sidebarOpen, toggleSidebar, role = "hostel" }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  return (
    <nav className={`bg-white shadow-lg border-b border-gray-200 px-4 py-3 fixed top-0 right-0 z-40 transition-all duration-300 ${
      sidebarOpen ? 'left-64' : 'left-16'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="text-gray-600 px-3 py-3 bg-zinc-200 cursor-pointer rounded-md shadow-2xl hover:text-gray-900 focus:outline-none mr-4"
          >
            {sidebarOpen ? <FaTimes className="text-xl  shadow-2xl" /> : <FaBars className="text-xl shadow-2xl" />}
          </button>
        
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="text-right">
            <div className="text-lg font-bold text-gray-800">{formatTime(currentTime)}</div>
            <div className="text-sm text-gray-600">{formatDate(currentTime)}</div>
          </div>
          <div className="flex items-center space-x-2 bg-zinc-100 shadow-xl py-3 px-5 rounded-2xl">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {role.charAt(0).toUpperCase()}
            </div>
            <span className="text-gray-700 font-medium">{role} Panel</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;