import React, { useState, useEffect } from 'react';
import { 
  FaQuestionCircle, FaCheckCircle, FaExclamationCircle, 
  FaHistory, FaSearch, FaUser, FaClock, FaCommentDots, FaSpinner
} from 'react-icons/fa';
import { complaintAPI } from '../services/api';
import toast from 'react-hot-toast';

const ComplaintsManagement = () => {
  const [complaintsData, setComplaintsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const response = await complaintAPI.getAll();
      if (response.data.success) {
        setComplaintsData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
      toast.error('Failed to load feedback records');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setIsSubmitting(true);
    try {
      const response = await complaintAPI.updateStatus(id, newStatus);
      if (response.data.success) {
        toast.success(`Feedback status synced to ${newStatus}`);
        fetchComplaints();
      }
    } catch (error) {
      console.error('Error updating complaint status:', error);
      toast.error('Failed to synchronize status');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredComplaints = complaintsData.filter(item => 
    (item.studentName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.complaint || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in transition-all">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Meal Feedback Registry</h2>
          <p className="text-slate-500 font-medium tracking-tight">Official log of dining hall grievances and resolved feedback.</p>
        </div>
        <div className="bg-slate-900 text-white px-8 py-4 rounded-[2rem] shadow-2xl flex items-center gap-6">
           <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Grievance Rate</p>
              <p className="text-xl font-black">{complaintsData.filter(c => c.status === 'pending').length} Pending</p>
           </div>
           <div className="w-px h-8 bg-slate-800"></div>
           <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Resolution Rate</p>
              <p className="text-xl font-black">
                {complaintsData.length > 0 ? Math.round((complaintsData.filter(c => c.status === 'resolved').length / complaintsData.length) * 100) : 100}%
              </p>
           </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl flex flex-wrap items-center gap-6">
        <div className="flex-1 min-w-[300px] relative group">
          <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
          <input
            type="text"
            placeholder="Search feedback or student name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-6 py-4 bg-slate-50 border-none rounded-[1.5rem] text-sm font-bold text-slate-800 focus:ring-2 focus:ring-slate-900 outline-none transition-all"
          />
        </div>
        <button 
          onClick={fetchComplaints} 
          className="p-4 bg-white text-slate-400 hover:bg-slate-900 hover:text-white rounded-2xl border border-slate-200 transition-all shadow-sm"
          title="Refresh History"
        >
          <FaHistory />
        </button>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-900 border-b border-slate-800 text-white">
              <tr>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Resident</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Grievance Statement</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Submission Date</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-24 text-center">
                    <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Syncing Grievance Archives...</p>
                  </td>
                </tr>
              ) : filteredComplaints.length > 0 ? (
                filteredComplaints.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm font-black">
                          {item.studentName?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-sm leading-tight">{item.studentName}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Authorized Profile</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex gap-3 max-w-md">
                         <FaCommentDots className="text-slate-200 mt-1 flex-shrink-0" />
                         <p className="text-sm font-bold text-slate-600 leading-relaxed italic">"{item.complaint}"</p>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                         <FaClock className="text-slate-300" />
                         <span className="text-xs font-black text-slate-600">{item.date}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                       <div className="flex justify-end items-center gap-3">
                          <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border transition-all ${
                            item.status === 'resolved' 
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                              : 'bg-amber-50 text-amber-600 border-amber-100'
                          }`}>
                             {isSubmitting ? <FaSpinner className="animate-spin" /> : (item.status === 'resolved' ? <FaCheckCircle /> : <FaExclamationCircle />)}
                             <select
                                value={item.status}
                                onChange={(e) => handleStatusChange(item._id || item.id, e.target.value)}
                                className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest cursor-pointer disabled:opacity-50"
                                disabled={isSubmitting}
                             >
                                <option value="pending">Pending</option>
                                <option value="resolved">Resolved</option>
                             </select>
                          </div>
                       </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-32 text-center">
                     <div className="p-8 bg-white rounded-full w-fit mx-auto shadow-2xl mb-6">
                        <FaQuestionCircle className="text-5xl text-slate-100" />
                     </div>
                     <h3 className="text-2xl font-black text-slate-800 tracking-tight">No Grievances Detected</h3>
                     <p className="text-slate-400 font-medium italic mt-2">The dining hall quality archives are currently clear.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComplaintsManagement;