import { useState, useEffect } from 'react';
import { 
  FaCalendarAlt, FaClipboardCheck, FaSave, FaSearch, 
  FaCheckCircle, FaTimesCircle, FaBed, FaMoon, FaSun,
  FaMapMarkerAlt, FaUsers, FaUserClock
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import { hostelAttendanceAPI, bedAllocationAPI } from '../services/api';
import toast from 'react-hot-toast';

const Attendance = () => {
  const [residents, setResidents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceType, setAttendanceType] = useState('morning');
  const [attendance, setAttendance] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchActiveResidents();
  }, [selectedDate, attendanceType]);

  const fetchActiveResidents = async () => {
    setLoading(true);
    try {
      // 1. Fetch Active Residents from Bed Allocation
      const res = await bedAllocationAPI.getAll({ status: 'active' });
      if (res.data.success) {
        setResidents(res.data.data);
      }

      // 2. Fetch existing attendance for this date/type
      const attendanceRes = await hostelAttendanceAPI.getAll({ 
        date: selectedDate, 
        attendanceType: attendanceType 
      });
      
      if (attendanceRes.data.success) {
        const existingAttendance = {};
        attendanceRes.data.data.forEach(record => {
          existingAttendance[record.studentId] = record.status;
        });
        setAttendance(existingAttendance);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load resident records');
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const saveAttendance = async () => {
    setIsSubmitting(true);
    try {
      const records = Object.entries(attendance).map(([studentId, status]) => {
        const resident = residents.find(r => r.studentId === studentId);
        return {
          studentId,
          studentName: resident?.studentName || 'Resident',
          rollNumber: resident?.rollNumber || 'N/A',
          roomId: resident?.roomId,
          roomNumber: resident?.roomNumber,
          bedNumber: resident?.bedNumber,
          status,
          date: selectedDate,
          attendanceType: attendanceType
        };
      });

      if (records.length === 0) {
        return toast.error('No attendance marked to save');
      }

      const response = await hostelAttendanceAPI.mark({
        date: selectedDate,
        attendanceType: attendanceType,
        records
      });

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Records Synchronized',
          text: `${attendanceType.charAt(0).toUpperCase() + attendanceType.slice(1)} shift updated.`,
          timer: 1500,
          showConfirmButton: false,
          confirmButtonColor: '#6366f1'
        });
      }
    } catch (error) {
      toast.error('Failed to save attendance');
    } finally {
      setIsSubmitting(false);
    }
  };

  const markAllStatus = (status) => {
    const newAttendance = {};
    filteredResidents.forEach(res => {
      newAttendance[res.studentId] = status;
    });
    setAttendance(prev => ({ ...prev, ...newAttendance }));
  };

  const filteredResidents = residents.filter(res => {
    const name = res.studentName || '';
    const roll = res.rollNumber || '';
    const room = res.roomNumber || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           roll.toLowerCase().includes(searchTerm.toLowerCase()) ||
           room.toString().includes(searchTerm);
  });

  const stats = {
    present: Object.values(attendance).filter(s => s === 'present').length,
    absent: Object.values(attendance).filter(s => s === 'absent').length,
    total: residents.length,
    marked: Object.keys(attendance).length
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* Header & Stats */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-100">
              <FaClipboardCheck className="text-white" />
            </div>
            Resident Roll Call
          </h1>
          <p className="text-slate-500 font-medium mt-2">Manage daily shifts for active hostel residents.</p>
        </div>

        <div className="flex gap-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6 min-w-[200px]">
            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
              <FaUsers size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase">Present Today</p>
              <p className="text-2xl font-black text-slate-900">{stats.present}<span className="text-slate-300 text-sm"> / {stats.total}</span></p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6 min-w-[200px]">
            <div className="p-3 bg-rose-50 rounded-2xl text-rose-600">
              <FaUserClock size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase">Absent / Late</p>
              <p className="text-2xl font-black text-slate-900">{stats.absent}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm mb-10 flex flex-wrap items-center gap-6">
        <div className="flex-1 min-w-[250px] relative">
          <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            placeholder="Search name, roll no or room..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-3xl focus:border-indigo-600 outline-none transition-all font-bold text-slate-700"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-600" />
            <input 
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-3xl font-bold text-slate-700 outline-none focus:border-indigo-600 transition-all"
            />
          </div>

          <div className="flex bg-slate-50 p-1.5 rounded-3xl border-2 border-slate-100">
            <button 
              onClick={() => setAttendanceType('morning')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${attendanceType === 'morning' ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <FaSun className={attendanceType === 'morning' ? 'text-amber-500' : ''} /> Morning
            </button>
            <button 
              onClick={() => setAttendanceType('evening')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${attendanceType === 'evening' ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <FaMoon className={attendanceType === 'evening' ? 'text-indigo-400' : ''} /> Evening
            </button>
          </div>

          <button 
            onClick={saveAttendance}
            disabled={isSubmitting}
            className="px-8 py-4 bg-indigo-600 text-white rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center gap-2 disabled:bg-slate-400 disabled:shadow-none disabled:translate-y-0"
          >
            {isSubmitting ? <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Syncing...</> : <><FaSave /> Save Changes</>}
          </button>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      <div className="flex items-center justify-between mb-6 px-4">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Bulk Records</p>
        <div className="flex gap-3">
          <button 
            onClick={() => markAllStatus('present')}
            className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-100 transition-all"
          >
            All Present
          </button>
          <button 
            onClick={() => markAllStatus('absent')}
            className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-100 transition-all"
          >
            All Absent
          </button>
        </div>
      </div>

      {/* Residents Grid */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-900 border-b border-slate-800">
              <tr>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Resident</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Room Details</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Attendance Shift</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="3" className="py-24 text-center">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Syncing Resident List...</p>
                  </td>
                </tr>
              ) : filteredResidents.map((res) => (
                <tr key={res.studentId} className="hover:bg-slate-50 transition-all group border-l-4 border-l-transparent hover:border-l-indigo-600">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:scale-105 transition-transform">
                        {res.studentName?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-base">{res.studentName}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Roll: {res.rollNumber || 'N/A'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-100 rounded-full text-slate-600 border border-slate-200 shadow-sm">
                        <FaBed size={12} className="text-indigo-600" />
                        <span className="text-xs font-black uppercase tracking-tight">Room {res.roomNumber}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        <FaMapMarkerAlt size={8} /> Bed {res.bedNumber}
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex justify-end items-center gap-4">
                      <button 
                        onClick={() => handleAttendanceChange(res.studentId, 'present')}
                        className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-300 font-black text-[10px] uppercase tracking-widest border-2 ${attendance[res.studentId] === 'present' ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-emerald-200 hover:text-emerald-600'}`}
                      >
                        <FaCheckCircle className={attendance[res.studentId] === 'present' ? 'animate-bounce' : ''} /> Present
                      </button>
                      <button 
                        onClick={() => handleAttendanceChange(res.studentId, 'absent')}
                        className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-300 font-black text-[10px] uppercase tracking-widest border-2 ${attendance[res.studentId] === 'absent' ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-100' : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-rose-200 hover:text-rose-600'}`}
                      >
                        <FaTimesCircle className={attendance[res.studentId] === 'absent' ? 'animate-pulse' : ''} /> Absent
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && filteredResidents.length === 0 && (
          <div className="text-center py-32 bg-slate-50/50">
            <div className="p-8 bg-white rounded-full w-fit mx-auto shadow-xl mb-6">
              <FaUsers className="text-5xl text-slate-200" />
            </div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">No Residents Found</h3>
            <p className="text-slate-500 font-medium max-w-sm mx-auto mt-2 italic">Ensure students have been allocated to rooms before marking attendance.</p>
          </div>
        )}
      </div>

      {/* Footer Support */}
      <div className="mt-8 flex justify-between items-center px-6">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Warden Panel • Compliance v3.1</p>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Morning Shift</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Evening Shift</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;