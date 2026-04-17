import { useState, useEffect } from 'react';
import { 
  FaQuestionCircle, FaReply, FaCheck, FaTimes, FaSearch, 
  FaFilter, FaUser, FaClipboardList, FaClock, FaExclamationTriangle,
  FaCheckCircle, FaTools, FaUtensils, FaBed, FaArrowRight,
  FaPaperPlane, FaHistory
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import { studentQueryAPI } from '../services/api';
import toast from 'react-hot-toast';

const StudentQueries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    setLoading(true);
    try {
      const response = await studentQueryAPI.getAll();
      if (response.data.success) setQueries(response.data.data);
    } catch (error) {
      console.error('Error fetching queries:', error);
      toast.error('Failed to load queries');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (queryId) => {
    if (!replyText.trim()) {
      toast.error('Please enter a resolution note');
      return;
    }

    setIsSubmitting(true);
    try {
      await studentQueryAPI.update(queryId, {
        reply: replyText,
        status: 'Resolved',
        repliedDate: new Date().toISOString().split('T')[0]
      });
      toast.success('Resolution sent successfully');
      setSelectedQuery(null);
      setReplyText('');
      fetchQueries();
    } catch (error) {
      toast.error('Failed to send reply');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (queryId, newStatus) => {
    try {
      await studentQueryAPI.updateStatus(queryId, newStatus);
      toast.success(`Tracked as ${newStatus}`);
      fetchQueries();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredQueries = queries.filter(query => {
    const studentName = query.studentName || '';
    const subject = query.subject || '';
    const rollNumber = query.rollNumber || '';

    const matchesSearch = studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || query.status === filterStatus;
    const matchesCategory = filterCategory === 'All' || query.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Maintenance': return <FaTools />;
      case 'Mess': return <FaUtensils />;
      case 'Room': return <FaBed />;
      default: return <FaQuestionCircle />;
    }
  };

  const stats = {
    total: queries.length,
    pending: queries.filter(q => q.status === 'Pending').length,
    inProgress: queries.filter(q => q.status === 'In Progress').length,
    resolved: queries.filter(q => q.status === 'Resolved').length,
  };

  return (
    <div className="space-y-8 animate-in transition-all">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Support & Grievance Desk</h2>
          <p className="text-slate-500 font-medium tracking-tight">Systematic resolution of student concerns and maintenance requests.</p>
        </div>
      </div>

      {/* Occupancy Stats Board */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Pending Requests', value: stats.pending, icon: FaExclamationTriangle, color: 'rose' },
          { label: 'In Analysis', value: stats.inProgress, icon: FaHistory, color: 'amber' },
          { label: 'Successfully Resolved', value: stats.resolved, icon: FaCheckCircle, color: 'emerald' },
          { label: 'Total Tickets', value: stats.total, icon: FaClipboardList, color: 'indigo' }
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

      {/* Filters Ledger */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student, roll or subject..."
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
            <option value="All">All Ticket Status</option>
            <option value="Pending">New / Pending</option>
            <option value="In Progress">Allocated / In Progress</option>
            <option value="Resolved">Resolved / Closed</option>
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-6 py-3 bg-slate-50 border-none rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 focus:ring-2 focus:ring-black outline-none transition-all"
          >
            <option value="All">All Categories</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Mess">Mess / Food</option>
            <option value="Room">Room Allotment</option>
            <option value="General">General Query</option>
          </select>
        </div>
      </div>

      {/* Tickets Table Ledger */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-900 border-b border-slate-800 text-white">
              <tr>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Resident Student</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type & Issue</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Ticket Status</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Submitted On</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredQueries.length > 0 ? (
                filteredQueries.map(q => (
                  <tr key={q._id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${q.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                          {q.studentName?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-slate-800 text-sm leading-tight">{q.studentName}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Roll: {q.rollNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="p-2 bg-slate-100 text-slate-600 rounded-lg text-xs">
                          {getCategoryIcon(q.category)}
                        </span>
                        <div>
                          <p className="text-[11px] font-black text-slate-800 leading-none">{q.subject}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight mt-1 truncate max-w-[200px]">{q.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex justify-center">
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border ${
                            q.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                            q.status === 'In Progress' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                            'bg-rose-50 text-rose-600 border-rose-100'
                          }`}>
                            {q.status}
                          </span>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-[11px] font-bold text-slate-500">
                      {q.submittedDate}
                    </td>
                    <td className="px-8 py-4 text-right">
                       <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => setSelectedQuery(q)}
                            className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-black transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-4"
                          >
                            <FaReply /> Resolve
                          </button>
                          {q.status === 'Pending' && (
                            <button 
                              onClick={() => handleStatusChange(q._id, 'In Progress')}
                              className="p-2.5 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-600 hover:text-white transition-all"
                            >
                              <FaClock />
                            </button>
                          )}
                       </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">No concerns in the desk repository.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

       {/* Official Resolution Modal */}
       {selectedQuery && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[10000] p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full border border-slate-100 overflow-hidden">
             <div className="bg-slate-900 p-8 text-white flex items-center justify-between">
                <div>
                   <h3 className="text-2xl font-black tracking-tight">Official Resolution Note</h3>
                   <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Ticket ID: {selectedQuery._id.substring(18).toUpperCase()}</p>
                </div>
                <button onClick={() => setSelectedQuery(null)} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xl hover:bg-slate-700 transition-all">×</button>
             </div>

             <div className="p-10 space-y-8">
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                   <div className="flex items-center gap-3 mb-4">
                     <span className="p-2 bg-white text-slate-900 rounded-lg text-sm shadow-sm">
                       {getCategoryIcon(selectedQuery.category)}
                     </span>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedQuery.category} Request</p>
                   </div>
                   <h4 className="text-lg font-black text-slate-900">{selectedQuery.subject}</h4>
                   <p className="text-sm text-slate-500 mt-2 font-medium leading-relaxed">{selectedQuery.description}</p>
                   <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-[10px] font-black">
                          {selectedQuery.studentName?.charAt(0)}
                        </div>
                        <p className="text-xs font-black text-slate-800">{selectedQuery.studentName}</p>
                      </div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Unit: {selectedQuery.roomNumber}</p>
                   </div>
                </div>

                {selectedQuery.reply && (
                  <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 relative">
                     <div className="absolute -top-3 left-6 flex items-center gap-2 bg-emerald-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                        <FaHistory /> Resolution History
                     </div>
                     <p className="text-sm text-emerald-800 font-medium leading-relaxed italic">"{selectedQuery.reply}"</p>
                     <p className="text-[9px] text-emerald-600 font-black uppercase tracking-widest mt-2">— Replied on {selectedQuery.repliedDate}</p>
                  </div>
                )}

                <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Final Resolution Message</label>
                   <div className="relative">
                      <textarea 
                        value={replyText} 
                        onChange={(e) => setReplyText(e.target.value)}
                        className="w-full px-6 py-5 bg-slate-50 border-none rounded-3xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-slate-900 outline-none transition-all min-h-[120px]" 
                        placeholder="Detail the actions taken to resolve this concern..." 
                      />
                      <FaPaperPlane className="absolute right-6 bottom-6 text-slate-300" />
                   </div>
                </div>

                <div className="flex gap-4">
                   <button 
                    onClick={() => handleReply(selectedQuery._id)} 
                    disabled={isSubmitting}
                    className="flex-1 py-5 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-black hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:bg-slate-400 disabled:shadow-none disabled:translate-y-0"
                   >
                    {isSubmitting ? 'Processing Resolution...' : 'Submit Resolution'} <FaArrowRight />
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentQueries;