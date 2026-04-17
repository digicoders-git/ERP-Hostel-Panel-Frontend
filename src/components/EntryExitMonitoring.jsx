import { useState, useEffect } from 'react';
import { 
  FaSignInAlt, FaSignOutAlt, FaSearch, FaCalendarAlt, FaClock, 
  FaChartBar, FaDownload, FaFilter, FaUser, FaPhone, FaIdCard, 
  FaMapMarkerAlt, FaCheckCircle, FaTimesCircle, FaExclamationCircle,
  FaArrowRight, FaArrowLeft, FaHistory, FaUserCircle
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import { entryExitAPI, bedAllocationAPI } from '../services/api';
import toast from 'react-hot-toast';

const EntryExitMonitoring = () => {
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [actionType, setActionType] = useState('exit'); // Default to exit since students start inside
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [filterDate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [allotmentsRes, recordRes] = await Promise.all([
        bedAllocationAPI.getAll(),
        entryExitAPI.getAll({ date: filterDate })
      ]);
      if (allotmentsRes.data.success) setStudents(allotmentsRes.data.data);
      if (recordRes.data.success) setRecords(recordRes.data.data);
    } catch (error) {
      console.error('Error fetching movement data:', error);
      toast.error('Failed to load records');
    } finally {
      setLoading(false);
    }
  };

  const handleRecordEntry = async () => {
    if (!selectedStudent) {
      toast.error('Please select a student');
      return;
    }

    const student = students.find(s => (s.studentId).toString() === selectedStudent.toString());
    
    const recordData = {
      studentId: selectedStudent,
      studentName: student?.studentName || 'Unknown',
      rollNumber: student?.rollNumber || 'N/A',
      action: actionType,
      room: student?.roomNumber || 'N/A'
    };

    setIsSubmitting(true);
    try {
      const response = await entryExitAPI.create(recordData);
      if (response.data.success) {
        toast.success(`${student?.studentName} ${actionType === 'entry' ? 'In' : 'Out'} recorded`);
        fetchData();
        setSelectedStudent('');
      }
    } catch (error) {
      toast.error('Failed to record movement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStudentCurrentStatus = (studentId) => {
    const studentRecords = records
      .filter(record => (record.studentId?._id || record.studentId || '').toString() === studentId.toString())
      .sort((a, b) => new Date(b.timestamp || b.createdAt) - new Date(a.timestamp || a.createdAt));
    
    if (studentRecords.length === 0) return 'Inside'; 
    return studentRecords[0].action === 'entry' ? 'Inside' : 'Outside';
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || record.action === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    entriesToday: records.filter(r => r.action === 'entry').length,
    exitsToday: records.filter(r => r.action === 'exit').length,
    totalResidents: students.length,
    currentlyInside: students.filter(s => getStudentCurrentStatus(s.studentId) === 'Inside').length,
  };

  return (
    <div className="space-y-8 animate-in transition-all">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Movement Tracking Ledger</h2>
          <p className="text-slate-500 font-medium tracking-tight">Real-time monitoring of student entry and exit movements.</p>
        </div>
        <div className="flex gap-3">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
          >
            <FaDownload /> Export CSV
          </button>
        </div>
      </div>

      {/* Occupancy Board */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all"></div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Current Occupancy</p>
          <div className="flex items-end gap-3">
            <h3 className="text-5xl font-black leading-none">{stats.currentlyInside}</h3>
            <span className="text-slate-400 font-bold text-lg mb-1">/ {stats.totalResidents}</span>
          </div>
          <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mt-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Residents Inside Now
          </p>
        </div>

        {[
          { label: 'Today\'s Check-Ins', value: stats.entriesToday, icon: FaSignInAlt, color: 'emerald' },
          { label: 'Today\'s Check-Outs', value: stats.exitsToday, icon: FaSignOutAlt, color: 'rose' },
          { label: 'Outside Campus', value: stats.totalResidents - stats.currentlyInside, icon: FaClock, color: 'blue' }
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Registration Panel */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl">
            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <FaHistory className="text-indigo-600" />
              Register Movement
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Select Student</label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                >
                  <option value="">Search Student...</option>
                  {students.map(s => (
                    <option key={s.studentId} value={s.studentId}>{s.studentName} ({s.roomNumber})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Movement Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setActionType('entry')}
                    className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border-2 ${actionType === 'entry' ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-emerald-200'}`}
                  >
                    <FaArrowLeft /> Entry (In)
                  </button>
                  <button
                    onClick={() => setActionType('exit')}
                    className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border-2 ${actionType === 'exit' ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-100' : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-rose-200'}`}
                  >
                    Exit (Out) <FaArrowRight />
                  </button>
                </div>
              </div>

              <button
                onClick={handleRecordEntry}
                disabled={!selectedStudent}
                className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl hover:-translate-y-1 disabled:opacity-50 disabled:translate-y-0 ${actionType === 'entry' ? 'bg-indigo-600 text-white shadow-indigo-100' : 'bg-rose-600 text-white shadow-rose-100'}`}
              >
                Confirm Movement
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl overflow-hidden">
            <h3 className="text-xl font-black text-slate-900 mb-6 font-black uppercase text-[10px] tracking-widest text-slate-400">Current Occupants</h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
              {students.map(s => {
                const status = getStudentCurrentStatus(s.studentId);
                return (
                  <div key={s.studentId} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${status === 'Inside' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                      <div>
                        <p className="text-xs font-black text-slate-800">{s.studentName}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Room {s.roomNumber}</p>
                      </div>
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${status === 'Inside' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detailed Records Ledger */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter movement logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-6 py-3 bg-slate-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="px-6 py-3 bg-slate-50 border-none rounded-2xl text-xs font-bold text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-900 border-b border-slate-800">
                  <tr>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Resident</th>
                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Movement</th>
                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Audit Time</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Unit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map(record => (
                      <tr key={record._id} className="hover:bg-slate-50/50 transition-all group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${record.action === 'entry' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                              {record.studentName?.charAt(0)}
                            </div>
                            <div>
                              <p className="font-black text-slate-800 text-sm leading-tight">{record.studentName}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Roll: {record.rollNumber}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${record.action === 'entry' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                            {record.action === 'entry' ? 'Check-In' : 'Check-Out'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <FaClock className="text-slate-300 text-sm" />
                            <div>
                              <p className="text-[11px] font-bold text-slate-700">{record.time}</p>
                              <p className="text-[9px] text-slate-400 font-medium uppercase">{record.date}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-4 text-right">
                          <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-600 uppercase tracking-tight">Room {record.room}</span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-20 text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">No movement logs found for this date.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntryExitMonitoring;
