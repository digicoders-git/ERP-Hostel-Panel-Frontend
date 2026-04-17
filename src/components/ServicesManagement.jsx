import { useState, useEffect } from 'react';
import { 
  FaCut, FaTshirt, FaMagic, FaPlus, FaHistory, FaCheckCircle, 
  FaSearch, FaUser, FaEllipsisH, FaCalendarAlt, FaTimes,
  FaDownload, FaInfoCircle, FaFileAlt, FaSpinner, FaTools
} from 'react-icons/fa';
import { hostelServiceAPI, bedAllocationAPI } from '../services/api';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const SERVICE_TYPES = [
  { id: 'Laundry',      name: 'Laundry Service',      icon: FaTshirt,      color: 'blue' },
  { id: 'Hair Cutting', name: 'Barber Support',      icon: FaCut,         color: 'indigo' },
  { id: 'Shoe Polish',  name: 'Shoe Grooming',       icon: FaMagic,       color: 'amber' },
  { id: 'Other',        name: 'Special Request',     icon: FaTools,       color: 'slate' },
];

const EMPTY_FORM = {
  studentId: '',
  studentName: '',
  serviceType: 'Laundry',
  customServiceName: '',
  description: '',
  serviceDate: new Date().toISOString().split('T')[0],
};

const ServicesManagement = () => {
  const [services, setServices]     = useState([]);
  const [students, setStudents]     = useState([]);
  const [showForm, setShowForm]     = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [studentView, setStudentView] = useState(null); 
  const [formData, setFormData]     = useState(EMPTY_FORM);
  const [loading, setLoading]       = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [servicesRes, studentsRes] = await Promise.all([
        hostelServiceAPI.getAll(),
        bedAllocationAPI.getAll()
      ]);

      if (servicesRes.data.success) setServices(servicesRes.data.data);
      if (studentsRes.data.success) setStudents(studentsRes.data.data);
    } catch (error) {
      console.error('Error fetching services data:', error);
      toast.error('Failed to load services data');
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSelect = (e) => {
    const sId = e.target.value;
    const student = students.find(s => (s.studentId).toString() === sId);
    setFormData(p => ({
      ...p,
      studentId: sId,
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
    const student = students.find(s => (s.studentId).toString() === formData.studentId.toString());
    const displayService = formData.serviceType === 'Other'
      ? formData.customServiceName.trim()
      : formData.serviceType;

    try {
      const response = await hostelServiceAPI.create({
        studentId: formData.studentId,
        studentName: formData.studentName,
        serviceType: displayService,
        serviceCategory: formData.serviceType,
        description: formData.description,
        date: formData.serviceDate,
        status: 'Pending',
      });

      if (response.data.success) {
        toast.success(`${displayService} service recorded successfully`);
        fetchData();
        setShowForm(false);
        setFormData(EMPTY_FORM);
      }
    } catch (error) {
      toast.error('Failed to record utility service');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await hostelServiceAPI.update(id, { status: newStatus });
      fetchData();
      toast.success(`Service marked as ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Remove record?',
      text: 'This will permanently delete the utility log.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Delete Entry',
      cancelButtonText: 'Cancel'
    }).then(async (r) => {
      if (r.isConfirmed) {
        try {
          await hostelServiceAPI.remove(id);
          fetchData();
          toast.success('Record deleted');
        } catch (error) {
          toast.error('Failed to delete record');
        }
      }
    });
  };

  const filtered = services.filter(s => {
    const sName = (s.studentName || '').toLowerCase();
    const sType = (s.serviceType || '').toLowerCase();
    const sRoom = (s.roomNumber || '').toString();
    const matchSearch = sName.includes(searchTerm.toLowerCase()) ||
                        sType.includes(searchTerm.toLowerCase()) ||
                        sRoom.includes(searchTerm);
    const matchType   = filterType === 'All' || s.serviceType === filterType || s.serviceCategory === filterType;
    const matchStatus = filterStatus === 'All' || s.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  const stats = [
    { label: 'Total Utility Logs', value: services.length, color: 'indigo', icon: FaHistory },
    { label: 'Pending Works',     value: services.filter(s => s.status === 'Pending').length, color: 'amber', icon: FaCalendarAlt },
    { label: 'Finalized Today',   value: services.filter(s => s.status === 'Completed').length, color: 'emerald', icon: FaCheckCircle },
    { label: 'Laundry Cycle',     value: services.filter(s => s.serviceCategory === 'Laundry').length, color: 'blue', icon: FaTshirt },
  ];

  return (
    <div className="space-y-8 animate-in transition-all">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Student Utility Services</h2>
          <p className="text-slate-500 font-medium tracking-tight">Managing resident utility demands and staff assistance logs.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { setShowForm(!showForm); setStudentView(null); }}
            className={`flex items-center gap-3 px-8 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all shadow-xl ${
              showForm 
                ? 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50' 
                : 'bg-slate-900 text-white hover:bg-black shadow-slate-200'
            }`}
          >
            {showForm ? <><FaHistory /> View Ledger</> : <><FaPlus /> Log New Service</>}
          </button>
        </div>
      </div>

      {/* Stats Board */}
      {!showForm && (
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
      )}

      {/* Records Hub */}
      {!showForm && (
        <div className="space-y-6">
           {/* Filters Registry */}
           <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by resident, room or service type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-6 py-3 bg-slate-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                  />
                </div>
                <select
                  value={filterType}
                  onChange={e => setFilterType(e.target.value)}
                  className="px-6 py-3 bg-slate-50 border-none rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 focus:ring-2 focus:ring-black outline-none transition-all"
                >
                  <option value="All">All Categories</option>
                  {SERVICE_TYPES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  className="px-6 py-3 bg-slate-50 border-none rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 focus:ring-2 focus:ring-black outline-none transition-all"
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Waiting</option>
                  <option value="Completed">Processed</option>
                </select>
              </div>
            </div>

            {/* Utility Table Ledger */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-900 border-b border-slate-800 text-white">
                      <tr>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Resident Details</th>
                        <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Service Type</th>
                        <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Request Note</th>
                        <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Logged Date</th>
                        <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-sans">
                      {filtered.length > 0 ? (
                        filtered.map(item => (
                          <tr key={item._id} className="hover:bg-slate-50/50 transition-all group">
                            <td className="px-8 py-6">
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                     <FaUser />
                                  </div>
                                  <div>
                                     <p className="font-black text-slate-800 text-sm leading-tight">{item.studentName}</p>
                                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Roll: {item.rollNumber} • RM: {item.roomNumber}</p>
                                  </div>
                               </div>
                            </td>
                            <td className="px-6 py-4">
                               <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-50 text-slate-600 border border-slate-100`}>
                                  {item.serviceType}
                               </span>
                            </td>
                            <td className="px-6 py-4">
                               <p className="text-xs text-slate-500 max-w-[150px] truncate italic font-medium">"{item.description || 'No notes provided'}"</p>
                            </td>
                            <td className="px-6 py-4">
                               <div className="flex items-center gap-2 text-slate-400">
                                  <FaCalendarAlt className="text-[10px]" />
                                  <span className="text-[11px] font-bold">{item.date}</span>
                               </div>
                            </td>
                            <td className="px-6 py-4">
                               <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                                 item.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600 animate-pulse'
                               }`}>
                                 {item.status}
                               </span>
                            </td>
                            <td className="px-8 py-4 text-right">
                               <div className="flex items-center justify-end gap-2">
                                  {item.status === 'Pending' ? (
                                    <button
                                      onClick={() => handleStatusChange(item._id, 'Completed')}
                                      className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                                    >
                                      Finalize
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleStatusChange(item._id, 'Pending')}
                                      className="bg-slate-100 text-slate-400 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                                    >
                                      Re-Open
                                    </button>
                                  )}
                                  <button onClick={() => handleDelete(item._id)} className="p-3 bg-slate-50 text-slate-300 hover:bg-rose-50 hover:text-rose-500 rounded-xl transition-all"><FaTimes /></button>
                               </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="py-20 text-center">
                             <div className="flex flex-col items-center gap-3">
                                <FaFileAlt className="text-slate-200 text-4xl" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">No service logs identified in this register.</p>
                             </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
               </div>
            </div>
        </div>
      )}

      {/* New Service Form (The "Screenshot" Form) */}
      {showForm && (
        <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-2xl max-w-3xl mx-auto animate-in zoom-in duration-300">
          <div className="flex items-center gap-4 mb-10">
             <div className="w-14 h-14 rounded-3xl bg-indigo-600 text-white flex items-center justify-center text-2xl shadow-xl shadow-indigo-100">
                <FaTools />
             </div>
             <div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Log Utility Record</h3>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Official School Utility Registry</p>
             </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Resident Selection */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Target Resident Student</label>
                <div className="relative group">
                  <FaUser className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600" />
                  <select
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleStudentSelect}
                    className="w-full pl-16 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] focus:border-indigo-600 focus:bg-white text-sm font-bold text-slate-800 outline-none transition-all appearance-none"
                    required
                  >
                    <option value="">Choose Student From Registry...</option>
                    {students.map(s => (
                      <option key={s.studentId} value={s.studentId}>{s.studentName} — RM {s.roomNumber}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Service Date */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Execution Date</label>
                <div className="relative group">
                  <FaCalendarAlt className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600" />
                  <input
                    type="date"
                    name="serviceDate"
                    value={formData.serviceDate}
                    onChange={p => setFormData(v => ({...v, serviceDate: p.target.value}))}
                    className="w-full pl-16 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] focus:border-indigo-600 focus:bg-white text-sm font-bold text-slate-800 outline-none transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Service Type - Iconic Boxes */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Service Classification</label>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {SERVICE_TYPES.map(type => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, serviceType: type.id }))}
                    className={`flex flex-col items-center justify-center p-6 rounded-[1.5rem] border-2 transition-all duration-300 ${
                      formData.serviceType === type.id
                        ? `border-indigo-600 bg-indigo-600 text-white shadow-xl shadow-indigo-100 scale-105`
                        : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200'
                    }`}
                  >
                    <type.icon className={`text-2xl mb-3 ${formData.serviceType === type.id ? 'text-white' : ''}`} />
                    <span className="text-[9px] font-black uppercase tracking-widest">{type.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Description */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Request Notes (Internal)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={p => setFormData(v => ({...v, description: p.target.value}))}
                placeholder="e.g. Ironing urgently required, Hair trimming for annual function..."
                className="w-full px-8 py-6 bg-slate-50 border-2 border-transparent rounded-[1.5rem] focus:border-indigo-600 focus:bg-white text-sm font-bold text-slate-800 outline-none transition-all h-32 resize-none"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:bg-slate-400 disabled:shadow-none disabled:translate-y-0"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin text-lg" />
                    Syncing Utility Hub...
                  </>
                ) : (
                  <>
                    <FaCheckCircle className="text-lg" />
                    Commit & Record Service
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ServicesManagement;
