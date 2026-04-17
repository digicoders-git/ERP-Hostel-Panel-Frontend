import { useState, useEffect } from 'react';
import { 
  FaClipboardCheck, FaPlus, FaDownload, FaFilter, FaCheck, 
  FaTimes, FaCalendarAlt, FaUser, FaTrash, FaCoffee, FaSun, FaMoon,
  FaSearch, FaHistory, FaCheckCircle, FaExclamationCircle
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import { bedAllocationAPI, messAttendanceAPI } from '../services/api';
import toast from 'react-hot-toast';

const MessAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterMeal, setFilterMeal] = useState('all');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    date: new Date().toISOString().split('T')[0],
    breakfast: false,
    lunch: false,
    dinner: false
  });

  useEffect(() => {
    fetchInitialData();
  }, [selectedDate]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [studentsRes, attendanceRes] = await Promise.all([
        bedAllocationAPI.getAll(),
        messAttendanceAPI.getAll({ date: selectedDate })
      ]);

      if (studentsRes.data.success) setStudents(studentsRes.data.data);
      if (attendanceRes.data.success) setAttendanceData(attendanceRes.data.data);
    } catch (error) {
      console.error('Error fetching mess data:', error);
      toast.error('Failed to load mess records');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleStudentSelect = (e) => {
    const selectedId = e.target.value;
    const student = students.find(s => (s.studentId).toString() === selectedId);
    setFormData(prev => ({
      ...prev,
      studentId: selectedId,
      studentName: student ? student.studentName : ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.studentId) {
      toast.error('Please select a student');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await messAttendanceAPI.mark({
        studentId: formData.studentId,
        studentName: formData.studentName,
        date: formData.date,
        breakfast: formData.breakfast,
        lunch: formData.lunch,
        dinner: formData.dinner
      });

      if (response.data.success) {
        toast.success('Session Logged Successfully');
        fetchInitialData();
        resetForm();
      }
    } catch (error) {
      toast.error('Failed to record attendance');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMealToggle = async (record, meal) => {
    try {
      const payload = {
        studentId: record.studentId._id || record.studentId,
        date: record.date,
        [meal]: !record[meal]
      };
      await messAttendanceAPI.mark(payload);
      fetchInitialData();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const resetForm = () => {
    setFormData({
      studentId: '', studentName: '',
      date: new Date().toISOString().split('T')[0],
      breakfast: false, lunch: false, dinner: false
    });
    setShowForm(false);
  };

  const handleExport = () => {
    const headers = ['Student Name', 'Room', 'Date', 'Breakfast', 'Lunch', 'Dinner'];
    const rows = attendanceData.map(a => [
      a.studentName, a.roomNumber, a.date,
      a.breakfast ? 'YES' : 'NO', a.lunch ? 'YES' : 'NO', a.dinner ? 'YES' : 'NO'
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dining_presence_${selectedDate}.csv`;
    link.click();
  };

  const filteredData = attendanceData.filter(a => {
    const matchesSearch = a.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        a.roomNumber?.toString().includes(searchTerm);
    if (!matchesSearch) return false;
    if (filterMeal === 'all') return true;
    return a[filterMeal];
  });

  const stats = [
    { label: 'Total Diners', value: filteredData.length, icon: FaUser, color: 'indigo' },
    { label: 'Breakfast Served', value: filteredData.filter(a => a.breakfast).length, icon: FaCoffee, color: 'amber' },
    { label: 'Lunch Served', value: filteredData.filter(a => a.lunch).length, icon: FaSun, color: 'emerald' },
    { label: 'Dinner Served', value: filteredData.filter(a => a.dinner).length, icon: FaMoon, color: 'rose' }
  ];

  return (
    <div className="space-y-8 animate-in transition-all">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Dining Presence Register</h2>
          <p className="text-slate-500 font-medium tracking-tight">Official tracking of meal consumption for resident students.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-3 px-6 py-3 bg-white text-slate-600 border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
          >
            <FaDownload /> Export CSV
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200"
          >
            <FaPlus /> Log Meal Session
          </button>
        </div>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center mb-4`}>
              <stat.icon className="text-xl" />
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900 leading-none">{stat.value}</p>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

       {/* Filters Registry */}
       <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student or room number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-3 bg-slate-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-slate-900 outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-2 bg-slate-50 rounded-2xl px-4 py-2 border border-slate-100">
             <FaCalendarAlt className="text-slate-400 text-sm" />
             <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent border-none text-[11px] font-black uppercase tracking-widest text-slate-700 outline-none"
            />
          </div>
          <select
            value={filterMeal}
            onChange={(e) => setFilterMeal(e.target.value)}
            className="px-6 py-3 bg-slate-50 border-none rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 focus:ring-2 focus:ring-black outline-none transition-all"
          >
            <option value="all">Total Meal View</option>
            <option value="breakfast">Breakfast Tally</option>
            <option value="lunch">Lunch Tally</option>
            <option value="dinner">Dinner Tally</option>
          </select>
        </div>
      </div>

      {/* Attendance Table Ledger */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-900 border-b border-slate-800 text-white">
              <tr>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Resident Student</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Breakfast ☕</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Lunch ☀️</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Dinner 🌙</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-sans">
              {filteredData.length > 0 ? (
                filteredData.map(item => (
                  <tr key={item._id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                             <FaUser />
                          </div>
                          <div>
                             <p className="font-black text-slate-800 text-sm leading-tight">{item.studentName}</p>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Roll: {item.rollNumber} • Unit: {item.roomNumber}</p>
                          </div>
                       </div>
                    </td>
                    {[
                      { key: 'breakfast', color: 'amber', icon: <FaCoffee /> },
                      { key: 'lunch', color: 'emerald', icon: <FaSun /> },
                      { key: 'dinner', color: 'rose', icon: <FaMoon /> }
                    ].map(meal => (
                      <td key={meal.key} className="px-6 py-4">
                         <div className="flex justify-center">
                            <button 
                              onClick={() => handleMealToggle(item, meal.key)}
                              className={`flex items-center gap-2 p-2 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                                item[meal.key] ? `bg-${meal.color}-50 text-${meal.color}-600 border border-${meal.color}-100` : 'bg-slate-100 text-slate-400 border border-slate-100 opacity-50'
                              }`}
                            >
                              {item[meal.key] ? <FaCheck /> : <FaTimes />} {meal.key}
                            </button>
                         </div>
                      </td>
                    ))}
                    <td className="px-8 py-4 text-right">
                       <button className="p-3 bg-slate-50 text-slate-300 hover:bg-slate-100 hover:text-rose-500 rounded-xl transition-all"><FaTrash /></button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                     <div className="flex flex-col items-center gap-3">
                        <FaExclamationCircle className="text-slate-200 text-4xl" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">No dining logs identified for this period.</p>
                     </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

       {/* Premium Modal (Based on User Screenshot Request) */}
       {showForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[10000] p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-xl w-full border border-slate-100 overflow-hidden">
             <div className="bg-slate-900 p-8 text-white flex items-center justify-between">
                <div>
                   <h3 className="text-2xl font-black tracking-tight tracking-tight">Log Meal Session</h3>
                   <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Official Dining Registry</p>
                </div>
                <button onClick={() => setShowForm(false)} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xl hover:bg-slate-700 transition-all">×</button>
             </div>

             <form onSubmit={handleSubmit} className="p-10 space-y-6">
                <div className="space-y-4">
                   <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Target Resident</label>
                       <select 
                        required
                        value={formData.studentId} 
                        onChange={handleStudentSelect}
                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                       >
                          <option value="">Select Resident Student...</option>
                          {students.map(s => (
                            <option key={s.studentId} value={s.studentId}>
                              {s.studentName} ({s.roomNumber})
                            </option>
                          ))}
                       </select>
                   </div>

                   <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Session Date</label>
                       <input 
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                       />
                   </div>

                   <div className="space-y-3 pt-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Meals Served</label>
                      <div className="grid grid-cols-1 gap-3">
                         {[
                           { key: 'breakfast', label: 'Breakfast Session', icon: <FaCoffee /> },
                           { key: 'lunch', label: 'Lunch Session', icon: <FaSun /> },
                           { key: 'dinner', label: 'Dinner Session', icon: <FaMoon /> }
                         ].map(meal => (
                           <label key={meal.key} className={`flex items-center justify-between p-4 px-6 rounded-2xl border-2 cursor-pointer transition-all ${
                             formData[meal.key] ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-100 bg-slate-50 text-slate-400'
                           }`}>
                              <div className="flex items-center gap-4">
                                 <span className="text-lg">{meal.icon}</span>
                                 <span className="text-xs font-black uppercase tracking-widest">{meal.label}</span>
                              </div>
                              <input 
                                type="checkbox"
                                name={meal.key}
                                checked={formData[meal.key]}
                                onChange={handleInputChange}
                                className="hidden"
                              />
                              {formData[meal.key] && <FaCheckCircle className="text-xl" />}
                           </label>
                         ))}
                      </div>
                   </div>
                </div>

                <div className="flex gap-4 pt-4">
                   <button type="submit" className="flex-1 py-5 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-black shadow-xl hover:-translate-y-1 transition-all">Submit Session</button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessAttendance;
