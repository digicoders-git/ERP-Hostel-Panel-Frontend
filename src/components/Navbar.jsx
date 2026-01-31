import { useEffect, useState } from "react";
import { FaBars, FaTachometerAlt } from "react-icons/fa";

const Navbar = ({ sidebarOpen, toggleSidebar, role = "Warden" }) => {
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
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 h-20 flex items-center shrink-0">
      <div className="w-full px-6 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2.5 rounded-xl cursor-pointer text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200 group"
          >
            <FaBars className={`text-xl transition-transform duration-300 ${sidebarOpen ? '' : 'rotate-180'}`} />
          </button>
        </div>

        <div className="flex items-center space-x-6">
          {/* DateTime Display */}
          <div className="hidden md:flex items-center space-x-4 border-r border-slate-100 pr-6">
            <div className="flex flex-col items-end">
              <span className="text-slate-900 font-bold text-sm tracking-tight">{formatTime(currentTime)}</span>
              <span className="text-slate-400 text-[11px] font-medium uppercase tracking-wider">{formatDate(currentTime)}</span>
            </div>
            <div className="bg-indigo-50 p-2 rounded-lg text-indigo-500">
              <FaTachometerAlt className="text-lg" />
            </div>
          </div>

          <div className="flex items-center space-x-3 pl-2">
            <div className="flex flex-col items-end text-right">
              <span className="text-slate-900 font-bold text-sm leading-tight">Hostel Admin</span>
              <span className="text-indigo-500 text-[11px] font-bold uppercase tracking-wider">{role} Panel</span>
            </div>
            <div className="relative group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200">
                {role.charAt(0).toUpperCase()}
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;