import { useState, useEffect } from 'react';
import { 
  FaEdit, FaTrash, FaEye, FaSearch, FaUserCheck, FaUserTimes, 
  FaUserGraduate, FaFilter, FaHistory, FaUsers, FaPlus, FaSpinner
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import { hostelStudentAPI } from '../services/api';
import toast from 'react-hot-toast';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, [filterStatus]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await hostelStudentAPI.getAll({ status: filterStatus !== 'All' ? filterStatus : undefined });
      setStudents(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load student registry');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = (student.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (student.rollNumber || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleStatusChange = async (studentId) => {
    setIsSubmitting(true);
    try {
      await hostelStudentAPI.toggleStatus(studentId);
      toast.success('Resident status updated');
      fetchStudents();
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (studentId) => {
    Swal.fire({
      title: 'Remove Resident Record?',
      text: 'This will permanently delete the student from the hostel ledger.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Delete Record',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsSubmitting(true);
        try {
          await hostelStudentAPI.remove(studentId);
          toast.success('Record purged from registry');
          fetchStudents();
        } catch (error) {
          toast.error('Failed to delete student');
        } finally {
          setIsSubmitting(false);
        }
      }
    });
  };

  return (
    <div className="space-y-8 animate-in transition-all">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Resident Registry</h2>
          <p className="text-slate-500 font-medium tracking-tight">Manage official profiles and enrollment status of hostel residents.</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-slate-900 text-white px-8 py-4 rounded-[2rem] shadow-2xl flex items-center gap-6">
              <div>
                 <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Total Residents</p>
                 <p className="text-xl font-black">{students.length}</p>
              </div>
              <div className="w-px h-8 bg-slate-800"></div>
              <div>
                 <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Active Profile</p>
                 <p className="text-xl font-black">{students.filter(s => s.status === 'Active').length}</p>
              </div>
           </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl flex flex-wrap items-center gap-6">
        <div className="flex-1 min-w-[300px] relative group">
          <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
          <input
            type="text"
            placeholder="Search by name, roll number, or course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-6 py-4 bg-slate-50 border-none rounded-[1.5rem] text-sm font-bold text-slate-800 focus:ring-2 focus:ring-slate-900 outline-none transition-all"
          />
        </div>
        
        <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100 shadow-inner">
           {['All', 'Active', 'Inactive'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-8 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                  filterStatus === status ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {status}
              </button>
           ))}
        </div>

        <button 
          onClick={fetchStudents} 
          className="p-4 bg-white text-slate-400 hover:bg-slate-900 hover:text-white rounded-2xl border border-slate-200 transition-all shadow-sm"
          title="Refresh Registry"
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
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Resident Profile</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Enrollment Details</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Contact</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-24 text-center">
                    <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Synchronizing Resident Database...</p>
                  </td>
                </tr>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-400 font-black text-xl group-hover:from-indigo-600 group-hover:to-indigo-800 group-hover:text-white transition-all shadow-sm">
                          {student.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-base leading-tight">{student.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Roll: {student.rollNumber || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className="inline-flex flex-col items-center">
                         <p className="text-sm font-bold text-slate-800">{student.course}</p>
                         <p className="px-3 py-1 bg-slate-100 rounded-lg text-[9px] font-black text-slate-500 uppercase mt-1">Year {student.year}</p>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <p className="text-sm font-bold text-slate-700">{student.phone}</p>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Primary Contact</p>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border-2 ${
                        student.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                          : 'bg-rose-50 text-rose-600 border-rose-100'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleStatusChange(student._id)}
                          disabled={isSubmitting}
                          className={`p-3 rounded-xl transition-all shadow-sm disabled:opacity-50 ${
                            student.status === 'Active' 
                              ? 'bg-rose-50 text-rose-500 hover:bg-rose-600 hover:text-white' 
                              : 'bg-emerald-50 text-emerald-500 hover:bg-emerald-600 hover:text-white'
                          }`}
                          title={student.status === 'Active' ? 'Archive Resident' : 'Activate Profile'}
                        >
                          {isSubmitting ? <FaSpinner className="animate-spin" /> : (student.status === 'Active' ? <FaUserTimes /> : <FaUserCheck />)}
                        </button>
                        <button
                          onClick={() => handleDelete(student._id)}
                          disabled={isSubmitting}
                          className="p-3 bg-slate-50 text-slate-300 hover:bg-slate-900 hover:text-white rounded-xl transition-all shadow-sm disabled:opacity-50"
                        >
                          {isSubmitting ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-32 text-center">
                     <div className="p-8 bg-white rounded-full w-fit mx-auto shadow-2xl mb-6">
                        <FaUsers className="text-5xl text-slate-100" />
                     </div>
                     <h3 className="text-2xl font-black text-slate-800 tracking-tight">Registry Clean</h3>
                     <p className="text-slate-400 font-medium italic mt-2">No resident records identified in the active ledger.</p>
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

export default ManageStudents;