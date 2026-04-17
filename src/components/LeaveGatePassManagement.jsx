import { 
  FaPlus, FaCheck, FaTimes, FaEye, FaEdit, FaTrash, 
  FaFilter, FaDownload, FaClock, FaCheckCircle, 
  FaTimesCircle, FaHourglassHalf, FaPrint, FaUserGraduate, 
  FaCalendarAlt, FaMapMarkerAlt, FaPhoneAlt, FaShieldAlt
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import { leaveGatePassAPI, hostelStudentAPI, bedAllocationAPI, authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useState, useEffect, useRef } from 'react';

const LeaveGatePassManagement = () => {
  const [requests, setRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [students, setStudents] = useState([]);
  const [wardenInfo, setWardenInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    studentId: '',
    requestType: 'leave',
    leaveType: 'casual',
    startDate: '',
    endDate: '',
    reason: '',
    destination: '',
    parentContact: '',
    status: 'pending'
  });

  const printRef = useRef(null);

  useEffect(() => {
    fetchData();
    fetchWardenProfile();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [requestsRes, allotmentsRes] = await Promise.all([
        leaveGatePassAPI.getAll(),
        bedAllocationAPI.getAll()
      ]);
      if (requestsRes.data.success) setRequests(requestsRes.data.data);
      if (allotmentsRes.data.success) {
        setStudents(allotmentsRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.studentId || !formData.startDate || !formData.reason) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingId) {
        const response = await leaveGatePassAPI.update(editingId, formData);
        if (response.data.success) toast.success('Pass updated');
      } else {
        const response = await leaveGatePassAPI.create(formData);
        if (response.data.success) toast.success('Pass registered successfully');
      }
      fetchData();
      resetForm();
    } catch (error) {
      toast.error('Failed to save pass');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      studentName: '',
      studentId: '',
      requestType: 'leave',
      leaveType: 'casual',
      startDate: '',
      endDate: '',
      reason: '',
      destination: '',
      parentContact: '',
      status: 'pending'
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleStatusUpdate = (id, newStatus) => {
    const actionText = newStatus === 'approved' ? 'Authorize' : 'Decline';
    Swal.fire({
      title: `${actionText} Pass?`,
      text: `Are you sure you want to ${actionText.toLowerCase()} this student request?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: newStatus === 'approved' ? '#4F46E5' : '#F43F5E',
      confirmButtonText: `Yes, ${actionText}`
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await leaveGatePassAPI.updateStatus(id, newStatus);
          if (response.data.success) {
            toast.success(`Pass ${newStatus === 'approved' ? 'Authorized' : 'Declined'}`);
            fetchData();
          }
        } catch (error) {
          toast.error('Operation failed');
        }
      }
    });
  };

  const handlePrint = (request) => {
    const hostelName = wardenInfo?.assignedHostel?.hostelName || 'Official School Hostel';
    const hostelCode = wardenInfo?.assignedHostel?.hostelCode || 'HS-REC';
    
    const printContent = `
      <html>
        <head>
          <title>Official Gate Pass - ${request.studentName}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&display=swap');
            body { 
              font-family: 'Montserrat', sans-serif; 
              padding: 50px; 
              background: #f8fafc;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .pass-card { 
              border: 10px double #1e293b; 
              padding: 40px; 
              border-radius: 30px; 
              max-width: 600px; 
              background: white;
              box-shadow: 0 20px 50px rgba(0,0,0,0.1);
              position: relative;
              overflow: hidden;
            }
            .watermark {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-45deg);
              font-size: 80px;
              color: rgba(226, 232, 240, 0.4);
              font-weight: 900;
              z-index: 0;
              pointer-events: none;
              text-transform: uppercase;
            }
            .header { 
              text-align: center; 
              border-bottom: 3px solid #1e293b; 
              padding-bottom: 25px; 
              margin-bottom: 30px; 
              position: relative;
              z-index: 1;
            }
            .school-badge {
              font-size: 10px;
              font-weight: 900;
              background: #f59e0b;
              color: #1e293b;
              padding: 4px 12px;
              border-radius: 50px;
              letter-spacing: 2px;
              display: inline-block;
              margin-bottom: 15px;
            }
            .school-name { 
              font-size: 28px; 
              font-weight: 900; 
              text-transform: uppercase; 
              color: #1e293b; 
              line-height: 1;
            }
            .hostel-sub {
              font-size: 14px;
              font-weight: 700;
              color: #64748b;
              margin-top: 5px;
            }
            .pass-type-badge { 
              background: #1e293b; 
              color: white; 
              padding: 8px 25px; 
              border-radius: 50px; 
              font-size: 14px; 
              font-weight: 900; 
              display: inline-block; 
              margin-top: 20px;
              letter-spacing: 1px;
            }
            .content {
              position: relative;
              z-index: 1;
              display: grid;
              grid-template-cols: 1fr 1fr;
              gap: 25px;
            }
            .field-group {
              border-bottom: 1px solid #f1f5f9;
              padding-bottom: 8px;
            }
            .label { 
              color: #94a3b8; 
              font-weight: bold; 
              text-transform: uppercase; 
              font-size: 9px; 
              letter-spacing: 1.5px;
              margin-bottom: 4px;
            }
            .value { 
              color: #1e293b; 
              font-weight: 800; 
              font-size: 16px; 
            }
            .reason-box {
              grid-column: span 2;
              background: #f8fafc;
              padding: 20px;
              border-radius: 15px;
              margin-top: 10px;
            }
            .footer { 
              margin-top: 50px; 
              display: flex; 
              justify-content: space-between; 
              align-items: flex-end;
              position: relative;
              z-index: 1;
            }
            .qr-mock {
              width: 80px;
              height: 80px;
              background: #1e293b;
              border-radius: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 10px;
              font-weight: 900;
              text-align: center;
              padding: 10px;
            }
            .sign-area {
              text-align: center;
            }
            .sign-line {
              border-top: 2px solid #1e293b;
              width: 200px;
              padding-top: 8px;
              font-size: 11px;
              font-weight: 900;
              color: #1e293b;
              letter-spacing: 1px;
            }
            .security-key {
              font-family: monospace;
              font-size: 8px;
              color: #cbd5e1;
              margin-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="pass-card">
            <div class="watermark">OFFICIAL</div>
            <div class="header">
              <div class="school-badge">SECURED MOVEMENT</div>
              <div class="school-name">${hostelName}</div>
              <div class="hostel-sub">Verification Unit | ${hostelCode}</div>
              <div class="pass-type-badge">${request.requestType === 'leave' ? 'LEAVE AUTHORIZATION' : 'OUT-STATION PASS'}</div>
            </div>
            
            <div class="content">
              <div class="field-group">
                <div class="label">Resident Student</div>
                <div class="value">${request.studentName}</div>
              </div>
              <div class="field-group">
                <div class="label">Student Roll No</div>
                <div class="value">${request.rollNumber || 'N/A'}</div>
              </div>
              <div class="field-group">
                <div class="label">Residency Unit</div>
                <div class="value">Room ${request.roomNumber || 'N/A'} (Bed ${request.bedNumber || 'A'})</div>
              </div>
              <div class="field-group">
                <div class="label">Expiry Date</div>
                <div class="value">${request.endDate || 'Same Day'}</div>
              </div>
              <div class="field-group">
                <div class="label">Authorization Date</div>
                <div class="value">${request.startDate}</div>
              </div>
               <div class="field-group">
                <div class="label">Movement Status</div>
                <div class="value" style="color: #10b981;">VERIFIED</div>
              </div>

              <div class="reason-box">
                <div class="label">Official Purpose</div>
                <div class="value" style="font-weight: 600; font-size: 14px; height: 40px; overflow: hidden;">${request.reason}</div>
              </div>
            </div>

            <div class="footer">
              <div class="qr-mock">
                AUTHO<br/>RIZED
              </div>
              <div class="sign-area">
                <div class="sign-line">WARDEN SIGNATURE</div>
                <div class="security-key">REF: ${request._id.substring(18).toUpperCase()}-${Math.floor(Date.now()/1000)}</div>
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

  const filteredRequests = requests.filter(r => 
    (filterStatus === 'all' || r.status === filterStatus) &&
    (filterType === 'all' || r.requestType === filterType)
  );

  return (
    <div className="space-y-8 animate-in transition-all">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Gate Pass Ledger</h2>
          <p className="text-slate-500 font-medium tracking-tight">Register and authorize student leaves and movement.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-3 px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 hover:-translate-y-0.5"
          >
            <FaPlus /> Register New Pass
          </button>
        </div>
      </div>

      {/* Modern Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Issued', value: requests.length, icon: FaClock, color: 'indigo' },
          { label: 'Pending Approval', value: requests.filter(r => r.status === 'pending').length, icon: FaHourglassHalf, color: 'blue' },
          { label: 'Authorized', value: requests.filter(r => r.status === 'approved').length, icon: FaCheckCircle, color: 'emerald' },
          { label: 'Declined', value: requests.filter(r => r.status === 'rejected').length, icon: FaTimesCircle, color: 'rose' }
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center mb-4`}>
              <stat.icon className="text-xl" />
            </div>
            <p className="text-3xl font-black text-slate-900 leading-none">{stat.value}</p>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters & Actions Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-6 py-2.5 bg-slate-50 border-none rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Authorized</option>
            <option value="rejected">Declined</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-6 py-2.5 bg-slate-50 border-none rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
          >
            <option value="all">All Types</option>
            <option value="leave">Leave Pass</option>
            <option value="gatepass">Out-Station</option>
          </select>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900 border-b border-slate-800">
              <tr>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Resident Details</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pass Category</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Auth Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredRequests.length > 0 ? (
                filteredRequests.map(req => (
                  <tr key={req._id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                          {req.studentName?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-slate-800 text-sm leading-tight">{req.studentName}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Roll: {req.rollNumber || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-700 uppercase tracking-tight">
                          {req.requestType === 'leave' ? `${req.leaveType} Leave` : 'Out-Station'}
                        </span>
                        <span className="text-[9px] text-slate-400 font-medium truncate max-w-[150px]">{req.reason}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <FaCalendarAlt className="text-slate-300 text-sm" />
                        <div>
                          <p className="text-[11px] font-bold text-slate-700">{req.startDate}</p>
                          {req.endDate && <p className="text-[9px] text-slate-400 font-medium">Til {req.endDate}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border ${
                          req.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          req.status === 'rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                          'bg-blue-50 text-blue-600 border-blue-100'
                        }`}>
                          {req.status === 'approved' ? 'Authorized' : req.status === 'rejected' ? 'Declined' : 'Pending'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex justify-end items-center gap-2 transition-opacity">
                        {req.status === 'pending' && (
                          <>
                            <button onClick={() => handleStatusUpdate(req._id, 'approved')} className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"><FaCheck /></button>
                            <button onClick={() => handleStatusUpdate(req._id, 'rejected')} className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all"><FaTimes /></button>
                          </>
                        )}
                        {req.status === 'approved' && (
                          <button onClick={() => handlePrint(req)} className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all" title="Print Pass"><FaPrint /></button>
                        )}
                        <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all"><FaEdit /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">No passes registered in this ledger.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registration Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[10000] p-4 p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full border border-slate-100 overflow-hidden">
            <div className="bg-slate-900 p-8 text-white flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black tracking-tight">{editingId ? 'Modify Record' : 'Register New Pass'}</h3>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Authorized Entry Required</p>
              </div>
              <button onClick={resetForm} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xl hover:bg-slate-700 transition-all">×</button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Select Student</label>
                  <select
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  >
                    <option value="">Search Student...</option>
                    {students.map(s => (
                      <option key={s.studentId} value={s.studentId}>{s.studentName} (Roll: {s.rollNumber})</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Category</label>
                  <select
                    name="requestType"
                    value={formData.requestType}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  >
                    <option value="leave">Long Leave (Out of Station)</option>
                    <option value="gatepass">Short Pass (Day Outing)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Start Date/Time</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Return Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Reason for Movement</label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all min-h-[100px]"
                  placeholder="Official reason for leave..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                 <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all hover:-translate-y-1 flex items-center justify-center gap-2 disabled:bg-slate-400 disabled:shadow-none disabled:translate-y-0"
                >
                  {isSubmitting ? 'Syncing Register...' : 'Confirm & Register'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-8 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveGatePassManagement;
