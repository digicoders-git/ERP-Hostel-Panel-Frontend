import { useState, useEffect } from 'react';
import { 
  FaPlus, FaSearch, FaEdit, FaTrash, FaDownload, 
  FaFilter, FaCalendarAlt, FaClock, FaUser, FaPhone, 
  FaMapMarkerAlt, FaCheckCircle, FaTimesCircle, FaEye,
  FaPrint, FaUserShield, FaIdCard, FaClipboardList
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { visitorAPI, bedAllocationAPI, authAPI } from '../services/api';

const VisitorManagement = () => {
  const [visitors, setVisitors] = useState([]);
  const [students, setStudents] = useState([]);
  const [wardenInfo, setWardenInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    purpose: 'Family Visit',
    studentId: '',
    studentName: '',
    roomNumber: '',
    checkInTime: new Date().toISOString().slice(0, 16),
    status: 'checked-in',
    notes: ''
  });

  useEffect(() => {
    fetchData();
    fetchWardenProfile();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [visitorRes, allotmentsRes] = await Promise.all([
        visitorAPI.getAll(),
        bedAllocationAPI.getAll()
      ]);
      if (visitorRes.data.success) setVisitors(visitorRes.data.data);
      if (allotmentsRes.data.success) setStudents(allotmentsRes.data.data);
    } catch (error) {
      console.error('Error fetching visitor data:', error);
      toast.error('Failed to load records');
    } finally {
      setLoading(false);
    }
  };

  const fetchWardenProfile = async () => {
    try {
      const res = await authAPI.getProfile();
      if (res.data.success) setWardenInfo(res.data.data);
    } catch (error) {
      console.error('Profile fetch failed');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'studentId') {
      const student = students.find(s => (s.studentId).toString() === value.toString());
      setFormData(prev => ({ 
        ...prev, 
        studentId: value,
        studentName: student ? student.studentName : '',
        roomNumber: student ? student.roomNumber : ''
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      purpose: 'Family Visit',
      studentId: '',
      studentName: '',
      roomNumber: '',
      checkInTime: new Date().toISOString().slice(0, 16),
      status: 'checked-in',
      notes: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (visitor) => {
    setFormData({
      ...visitor,
      studentId: visitor.studentId || ''
    });
    setEditingId(visitor._id || visitor.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.studentId) {
      toast.error('Name and Student selection required');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingId) {
        await visitorAPI.update(editingId, formData);
        toast.success('Record updated');
      } else {
        await visitorAPI.create(formData);
        toast.success('Visitor registered');
      }
      fetchData();
      resetForm();
    } catch (error) {
      toast.error('Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckOut = async (id) => {
    Swal.fire({
      title: 'Checkout Visitor?',
      text: 'Record exit time for this visitor?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Checkout',
      confirmButtonColor: '#10B981'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await visitorAPI.update(id, { status: 'checked-out', checkOutTime: new Date().toISOString().slice(0, 16) });
          toast.success('Visitor Checked Out');
          fetchData();
        } catch (error) {
          toast.error('Check-out failed');
        }
      }
    });
  };

  const handlePrint = (visitor) => {
    const hostelName = wardenInfo?.assignedHostel?.hostelName || 'Official School Hostel';
    
    const printContent = `
      <html>
        <head>
          <title>Visitor Badge - ${visitor.name}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');
            body { 
              font-family: 'Outfit', sans-serif; 
              padding: 0; margin: 0;
              display: flex; justify-content: center; align-items: center;
              height: 100vh; background: #f1f5f9;
            }
            .pass-container {
              width: 580px; height: 320px;
              background: white; border: 2px solid #0f172a;
              border-radius: 24px; overflow: hidden;
              display: flex; box-shadow: 0 15px 40px rgba(0,0,0,0.1);
              position: relative;
            }
            .sidebar {
              width: 140px; background: #0f172a;
              display: flex; flex-direction: column; align-items: center;
              justify-content: center; color: white; gap: 15px;
            }
            .main-content {
              flex: 1; padding: 25px 30px;
              display: flex; flex-direction: column; justify-content: space-between;
            }
            .qr-mock {
              width: 80px; height: 80px;
              background: white; color: #0f172a;
              border-radius: 12px; display: flex;
              align-items: center; justify-content: center;
              font-size: 8px; font-weight: 900; text-align: center;
            }
            .badge-type {
              writing-mode: vertical-rl; transform: rotate(180deg);
              font-weight: 900; letter-spacing: 4px; font-size: 14px;
              opacity: 0.8;
            }
            .header {
              display: flex; justify-content: space-between; align-items: flex-start;
              border-bottom: 2px solid #f1f5f9; padding-bottom: 12px;
            }
            .hostel-name {
              font-size: 20px; font-weight: 900; color: #0f172a;
              text-transform: uppercase; line-height: 1;
            }
            .pass-ref {
              font-size: 9px; font-weight: 700; color: #64748b;
              margin-top: 4px; letter-spacing: 1px;
            }
            .data-grid {
              display: grid; grid-template-columns: 1.5fr 1fr;
              gap: 15px; margin-top: 15px;
            }
            .field { margin-bottom: 10px; }
            .label { font-size: 8px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; }
            .value { font-size: 14px; font-weight: 700; color: #0f172a; }
            .footer {
              display: flex; justify-content: space-between; align-items: flex-end;
              margin-top: auto;
            }
            .stamp {
              border: 2px solid #10b981; color: #10b981;
              padding: 4px 12px; border-radius: 8px;
              font-weight: 900; font-size: 12px;
              transform: rotate(-5deg); text-transform: uppercase;
            }
            .sig-area { text-align: right; }
            .sig-line { border-top: 1px solid #0f172a; width: 140px; margin-top: 30px; font-size: 9px; font-weight: 800; color: #0f172a; }
          </style>
        </head>
        <body>
          <div class="pass-container">
            <div class="sidebar">
              <div class="badge-type">VISITOR PASS</div>
              <div class="qr-mock">SECURITY<br/>VERIFIED</div>
            </div>
            <div class="main-content">
              <div class="header">
                <div>
                  <div class="hostel-name">${hostelName}</div>
                  <div class="pass-ref">OFFICIAL ENTRY TOKEN | ID: ${visitor._id.substring(18).toUpperCase()}</div>
                </div>
                <div class="stamp">Verified</div>
              </div>
              
              <div class="data-grid">
                <div class="field">
                  <div class="label">Guest Full Name</div>
                  <div class="value">${visitor.name}</div>
                </div>
                <div class="field">
                  <div class="label">Visiting Student</div>
                  <div class="value">${visitor.studentName}</div>
                </div>
                <div class="field">
                  <div class="label">Entry Timestamp</div>
                  <div class="value">${new Date(visitor.checkInTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</div>
                </div>
                <div class="field">
                  <div class="label">Unit / Room</div>
                  <div class="value">Room ${visitor.roomNumber}</div>
                </div>
                <div class="field" style="grid-column: span 2;">
                  <div class="label">Visit Purpose</div>
                  <div class="value" style="font-size: 12px;">${visitor.purpose}</div>
                </div>
              </div>

              <div class="footer">
                <div class="label" style="color: #cbd5e1; font-size: 7px;">* KEEP THIS PASS VISIBLE AT ALL TIMES</div>
                <div class="sig-area">
                  <div class="sig-line">SECURITY SIGNATURE</div>
                </div>
              </div>
            </div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const filteredVisitors = visitors.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         v.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || v.status === filterStatus;
    const matchesDate = !filterDate || v.date === filterDate;
    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <div className="space-y-8 animate-in transition-all">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Official Visitor Logbook</h2>
          <p className="text-slate-500 font-medium tracking-tight">Digital register for hostel guest movement and security.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-3 px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl hover:-translate-y-0.5"
          >
            <FaPlus /> Register Guest
          </button>
        </div>
      </div>

       {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Guests', value: visitors.length, icon: FaUser, color: 'indigo' },
          { label: 'Active (Inside)', value: visitors.filter(v => v.status === 'checked-in').length, icon: FaCheckCircle, color: 'emerald' },
          { label: 'Visitors Today', value: visitors.filter(v => v.date === new Date().toISOString().split('T')[0]).length, icon: FaCalendarAlt, color: 'blue' },
          { label: 'Security Alerts', value: 0, icon: FaUserShield, color: 'rose' }
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-center">
             <div className="flex items-center justify-between mb-4">
               <div className={`w-10 h-10 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center`}>
                  <stat.icon />
               </div>
               <span className="text-3xl font-black text-slate-900">{stat.value}</span>
             </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters Ledger */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search visitor log..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-3 bg-slate-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-slate-900 outline-none transition-all"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-6 py-3 bg-slate-50 border-none rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 focus:ring-2 focus:ring-black outline-none transition-all"
          >
            <option value="all">All Status</option>
            <option value="checked-in">Inside</option>
            <option value="checked-out">Exited</option>
          </select>
        </div>
      </div>

      {/* Modern Table Ledger */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-900 border-b border-slate-800 text-white">
              <tr>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Guest Details</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Purpose</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Resident student</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredVisitors.length > 0 ? (
                filteredVisitors.map(v => (
                  <tr key={v._id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                          <FaUser />
                        </div>
                        <div>
                          <p className="font-black text-slate-800 text-sm leading-tight">{v.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{v.phone || 'No Mobile'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[9px] font-black uppercase tracking-tight">{v.purpose}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                         <div className="text-indigo-600"><FaUser /></div>
                         <div>
                            <p className="text-[11px] font-black text-slate-700">{v.studentName}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Room {v.roomNumber}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex justify-center">
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border ${
                            v.status === 'checked-in' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                          }`}>
                            {v.status === 'checked-in' ? 'Inside' : 'Exited'}
                          </span>
                       </div>
                    </td>
                    <td className="px-8 py-4 text-right">
                       <div className="flex justify-end gap-2">
                          {v.status === 'checked-in' && (
                            <>
                              <button onClick={() => handleCheckOut(v._id)} className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all" title="Checkout Guest"><FaCheckCircle /></button>
                              <button onClick={() => handlePrint(v)} className="p-2.5 bg-slate-50 text-slate-900 rounded-xl hover:bg-slate-900 hover:text-white transition-all" title="Print Pass"><FaPrint /></button>
                            </>
                          )}
                          <button onClick={() => handleEdit(v)} className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"><FaEdit /></button>
                       </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">No guest entries in this logbook.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

       {/* Register Form Modal */}
       {showForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[10000] p-4 p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full border border-slate-100 overflow-hidden">
             <div className="bg-slate-900 p-8 text-white flex items-center justify-between">
                <div>
                   <h3 className="text-2xl font-black tracking-tight">{editingId ? 'Modify Entry' : 'Register Guest'}</h3>
                   <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Official Security Registration</p>
                </div>
                <button onClick={resetForm} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xl hover:bg-slate-700 transition-all">×</button>
             </div>

             <form onSubmit={handleSubmit} className="p-10 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Guest Full Name</label>
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-slate-900 outline-none transition-all" placeholder="Enter guest name" required />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Mobile Number</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-slate-900 outline-none transition-all" placeholder="Enter phone" />
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Visit Purpose</label>
                      <select name="purpose" value={formData.purpose} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-slate-900 outline-none transition-all">
                         <option value="Family Visit">Family Visit</option>
                         <option value="Official Work">Official Work</option>
                         <option value="Delivery">Delivery / Courier</option>
                         <option value="Maintenance">Maintenance / Repair</option>
                         <option value="Academic">Academic / Study</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Meeting Student</label>
                      <select name="studentId" value={formData.studentId} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-slate-900 outline-none transition-all" required>
                         <option value="">Select Resident...</option>
                         {students.map(s => (
                           <option key={s.studentId} value={s.studentId}>{s.studentName} ({s.roomNumber})</option>
                         ))}
                      </select>
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Security Notes</label>
                   <textarea name="notes" value={formData.notes} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-slate-900 outline-none transition-all min-h-[100px]" placeholder="Any additional identification info..." />
                </div>

                <div className="flex gap-4 pt-4">
                   <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-black hover:-translate-y-1 transition-all flex items-center justify-center gap-2 disabled:bg-slate-400 disabled:shadow-none disabled:translate-y-0"
                   >
                    {isSubmitting ? 'Syncing Ledger...' : 'Confirm Entry'}
                   </button>
                   <button type="button" onClick={resetForm} className="px-8 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitorManagement;
