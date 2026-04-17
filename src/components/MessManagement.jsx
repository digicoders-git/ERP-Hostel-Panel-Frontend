import { useState, useEffect } from 'react';
import { 
  FaUtensils, FaPlus, FaEdit, FaTrash, FaCheckCircle, 
  FaTimesCircle, FaCalendarAlt, FaClock, FaUser, 
  FaSearch, FaFilter, FaHistory, FaConciergeBell,
  FaCoffee, FaSun, FaMoon, FaChartBar, FaDownload
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { hostelMenuAPI, messAttendanceAPI, messManagementAPI, complaintAPI, bedAllocationAPI } from '../services/api';

const MessManagement = () => {
  const [messData, setMessData] = useState({
    menu: [],
    attendance: [],
    complaints: []
  });
  const [students, setStudents] = useState([]);
  const [activeTab, setActiveTab] = useState('menu');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    day: '',
    breakfast: '',
    lunch: '',
    dinner: '',
    studentId: '',
    studentName: '',
    breakfast_status: 'Present',
    lunch_status: 'Present',
    dinner_status: 'Present',
    complaint: '',
    status: 'pending'
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    fetchData();
    fetchStudents();
  }, [activeTab]);

  const fetchStudents = async () => {
    try {
      const response = await bedAllocationAPI.getAll();
      if (response.data.success) setStudents(response.data.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'menu') {
        const response = await hostelMenuAPI.getAll();
        const menus = response.data.menus || response.data.data || response.data;
        if (Array.isArray(menus)) {
          // Sort by days order
          const sortedMenu = menus.sort((a, b) => days.indexOf(a.day) - days.indexOf(b.day));
          setMessData(prev => ({ ...prev, menu: sortedMenu }));
        }
      } else if (activeTab === 'attendance' || activeTab === 'complaints') {
        const response = await messManagementAPI.getAll();
        if (response.data.success) {
          setMessData(prev => ({
            ...prev,
            attendance: response.data.data.attendance || [],
            complaints: response.data.data.complaints || []
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching mess data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === 'menu') {
        const payload = { day: formData.day, breakfast: formData.breakfast, lunch: formData.lunch, dinner: formData.dinner };
        if (editingItem) await hostelMenuAPI.update(editingItem._id || editingItem.id, payload);
        else await hostelMenuAPI.create(payload);
      } else if (activeTab === 'attendance') {
        const payload = {
          studentId: formData.studentId,
          studentName: formData.studentName,
          date: new Date().toISOString().split('T')[0],
          breakfast: formData.breakfast_status === 'Present',
          lunch: formData.lunch_status === 'Present',
          dinner: formData.dinner_status === 'Present'
        };
        await messAttendanceAPI.mark(payload);
      } else if (activeTab === 'complaints') {
        const payload = { studentName: formData.studentName, complaint: formData.complaint, category: 'Mess', status: formData.status };
        if (editingItem) await complaintAPI.update(editingItem._id || editingItem.id, payload);
        else await complaintAPI.create(payload);
      }
      
      toast.success('Record saved successfully');
      fetchData();
      resetForm();
    } catch (error) {
      toast.error('Failed to save data');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    if (activeTab === 'menu') {
      setFormData({
        day: item.day,
        breakfast: item.breakfast,
        lunch: item.lunch,
        dinner: item.dinner
      });
    } else if (activeTab === 'attendance') {
      setFormData({
        studentId: item.studentId?._id || item.studentId,
        studentName: item.studentName,
        breakfast_status: item.breakfast ? 'Present' : 'Absent',
        lunch_status: item.lunch ? 'Present' : 'Absent',
        dinner_status: item.dinner ? 'Present' : 'Absent'
      });
    } else if (activeTab === 'complaints') {
      setFormData({ studentName: item.studentName, complaint: item.complaint, status: item.status });
    }
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Delete this record?',
      text: 'This cannot be reversed',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0f172a'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (activeTab === 'menu') await hostelMenuAPI.remove(id);
          else if (activeTab === 'complaints') await complaintAPI.remove(id);
          fetchData();
          toast.success('Deleted');
        } catch (error) {
          toast.error('Deletion failed');
        }
      }
    });
  };

  const resetForm = () => {
    setFormData({
      day: '', breakfast: '', lunch: '', dinner: '',
      studentId: '', studentName: '',
      breakfast_status: 'Present', lunch_status: 'Present', dinner_status: 'Present',
      complaint: '', status: 'pending'
    });
    setEditingItem(null);
    setShowAddForm(false);
  };

  const stats = {
    weeklyItems: messData.menu.length,
    todayAttendance: messData.attendance.length,
    openComplaints: messData.complaints.filter(c => c.status === 'pending').length
  };

  return (
    <div className="space-y-8 animate-in transition-all">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Dining & Mess Registry</h2>
          <p className="text-slate-500 font-medium tracking-tight">Managing nutritional wellness and dietary schedules.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-3 px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl hover:-translate-y-0.5"
          >
            <FaPlus /> New Entry
          </button>
        </div>
      </div>

       {/* Occupancy Stats Board */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Weekly Menu Days', value: stats.weeklyItems, icon: FaCalendarAlt, color: 'indigo' },
          { label: 'Today Records', value: stats.todayAttendance, icon: FaHistory, color: 'emerald' },
          { label: 'Open Issues', value: stats.openComplaints, icon: FaConciergeBell, color: 'rose' }
        ].map((stat, i) => (
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

      {/* Navigation Tabs */}
      <div className="flex bg-slate-100 p-2 rounded-3xl w-fit">
        {['menu', 'attendance', 'complaints'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
              activeTab === tab ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 gap-8">
        {activeTab === 'menu' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {messData.menu.map(item => (
              <div key={item._id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden group hover:border-slate-300 transition-all">
                <div className="bg-slate-900 p-6 flex justify-between items-center">
                  <h3 className="text-white font-black text-lg tracking-tight">{item.day}</h3>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => handleEdit(item)} className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg"><FaEdit /></button>
                    <button onClick={() => handleDelete(item._id)} className="p-2 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-lg"><FaTrash /></button>
                  </div>
                </div>
                <div className="p-8 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0"><FaCoffee /></div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Breakfast</p>
                      <p className="text-sm font-bold text-slate-800 leading-tight">{item.breakfast}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0"><FaSun /></div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Lunch</p>
                      <p className="text-sm font-bold text-slate-800 leading-tight">{item.lunch}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0"><FaMoon /></div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Dinner</p>
                      <p className="text-sm font-bold text-slate-800 leading-tight">{item.dinner}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-900 border-b border-slate-800 text-white">
                    <tr>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                      <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Breakfast</th>
                      <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Lunch</th>
                      <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Dinner</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {messData.attendance.map(item => (
                      <tr key={item._id} className="hover:bg-slate-50/50 transition-all">
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><FaUser /></div>
                              <div>
                                 <p className="font-black text-slate-800 text-sm leading-tight">{item.studentName}</p>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Room {item.roomNumber}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex justify-center">
                              <span className={`p-2 px-4 rounded-full text-[9px] font-black uppercase tracking-widest ${item.breakfast ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                {item.breakfast ? 'Served' : 'Missed'}
                              </span>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex justify-center">
                              <span className={`p-2 px-4 rounded-full text-[9px] font-black uppercase tracking-widest ${item.lunch ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                {item.lunch ? 'Served' : 'Missed'}
                              </span>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex justify-center">
                              <span className={`p-2 px-4 rounded-full text-[9px] font-black uppercase tracking-widest ${item.dinner ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                {item.dinner ? 'Served' : 'Missed'}
                              </span>
                           </div>
                        </td>
                        <td className="px-8 py-4 text-right">
                           <button onClick={() => handleEdit(item)} className="p-3 bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white rounded-xl transition-all"><FaEdit /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        )}

        {activeTab === 'complaints' && (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-900 border-b border-slate-800 text-white">
                    <tr>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Concern Raised By</th>
                      <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Feedback / Issue</th>
                      <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {messData.complaints.map(item => (
                      <tr key={item._id} className="hover:bg-slate-50/50 transition-all">
                        <td className="px-8 py-6 font-black text-slate-800 text-sm">{item.studentName}</td>
                        <td className="px-6 py-4">
                           <p className="text-sm font-medium text-slate-600">{item.complaint}</p>
                           <p className="text-[9px] font-black text-amber-600 uppercase mt-1">Status: {item.status}</p>
                        </td>
                        <td className="px-8 py-4 text-right">
                            <button onClick={() => handleDelete(item._id)} className="p-3 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all"><FaTrash /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        )}
      </div>

       {/* Form Modal */}
       {showAddForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[10000] p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full border border-slate-100 overflow-hidden">
             <div className="bg-slate-900 p-8 text-white flex items-center justify-between">
                <div>
                   <h3 className="text-2xl font-black tracking-tight">{editingItem ? 'Edit' : 'Register'} {activeTab}</h3>
                   <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Official Mess Operations</p>
                </div>
                <button onClick={resetForm} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xl hover:bg-slate-700 transition-all">×</button>
             </div>

             <form onSubmit={handleSubmit} className="p-10 space-y-6">
                {activeTab === 'menu' && (
                  <>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Target Day</label>
                       <select name="day" value={formData.day} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-slate-900 outline-none transition-all">
                          <option value="">Select Day...</option>
                          {days.map(d => <option key={d} value={d}>{d}</option>)}
                       </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Breakfast</label>
                          <input type="text" name="breakfast" value={formData.breakfast} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-slate-900" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Lunch</label>
                          <input type="text" name="lunch" value={formData.lunch} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-slate-900" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Dinner</label>
                          <input type="text" name="dinner" value={formData.dinner} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-slate-900" />
                       </div>
                    </div>
                  </>
                )}

                {activeTab === 'attendance' && (
                  <>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Student</label>
                       <select 
                        name="studentId" 
                        value={formData.studentId} 
                        onChange={(e) => {
                          const s = students.find(s => (s.studentId).toString() === e.target.value);
                          setFormData(prev => ({ ...prev, studentId: e.target.value, studentName: s ? s.studentName : '' }));
                        }}
                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-slate-900"
                       >
                          <option value="">Select Resident...</option>
                          {students.map(s => <option key={s.studentId} value={s.studentId}>{s.studentName}</option>)}
                       </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       {['breakfast_status', 'lunch_status', 'dinner_status'].map(field => (
                         <div key={field} className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">{field.split('_')[0]}</label>
                            <select name={field} value={formData[field]} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-slate-900">
                               <option value="Present">Present</option>
                               <option value="Absent">Absent</option>
                            </select>
                         </div>
                       ))}
                    </div>
                  </>
                )}

                {activeTab === 'complaints' && (
                  <>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Student Name</label>
                       <input type="text" name="studentName" value={formData.studentName} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Your Complaint</label>
                       <textarea name="complaint" value={formData.complaint} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 min-h-[100px]" />
                    </div>
                  </>
                )}

                <div className="flex gap-4 pt-4">
                   <button type="submit" className="flex-1 py-4 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-black shadow-xl hover:-translate-y-1 transition-all">Save Changes</button>
                   <button type="button" onClick={resetForm} className="px-8 py-4 bg-slate-100 text-slate-500 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessManagement;