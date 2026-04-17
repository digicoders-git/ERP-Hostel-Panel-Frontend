import { useState, useEffect } from 'react';
import { 
  FaMoneyBillWave, FaUtensils, FaBed, FaFilter, FaSearch, 
  FaCheckCircle, FaTimesCircle, FaClock, FaMagic, FaDownload, 
  FaPlus, FaChevronRight, FaCalendarAlt, FaReceipt, FaExclamationTriangle
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import { hostelFeeAPI, hostelStudentAPI } from '../services/api';
import toast from 'react-hot-toast';

const HostelFeeManagement = () => {
  const [students, setStudents] = useState([]);
  const [feeRecords, setFeeRecords] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingDues: 0,
    paidCount: 0,
    avgPayment: 0
  });
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('default', { month: 'long', year: 'numeric' }));
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ].map(m => `${m} ${new Date().getFullYear()}`);

  useEffect(() => {
    fetchData();
  }, [selectedMonth]); // Refresh on month change

  const fetchData = async () => {
    setLoading(true);
    try {
      const [feeRes, studentRes, statsRes] = await Promise.all([
        hostelFeeAPI.getAll({ month: selectedMonth }),
        hostelStudentAPI.getAll({ status: 'Active' }),
        hostelFeeAPI.getStats({ month: selectedMonth })
      ]);
      
      if (feeRes.data.success) setFeeRecords(feeRes.data.data);
      if (studentRes.data.success) setStudents(studentRes.data.data);
      if (statsRes.data.success) setStats(statsRes.data.data);
    } catch (error) {
      console.error('Error fetching fee data:', error);
      toast.error('Failed to load fee records');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBills = async () => {
    const { value: month } = await Swal.fire({
      title: 'Generate Monthly Bills',
      text: 'This will automatically create fee records for all currently allocated students.',
      input: 'select',
      inputOptions: months.reduce((acc, m) => ({ ...acc, [m]: m }), {}),
      inputPlaceholder: 'Select Month',
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
      inputValidator: (value) => !value && 'Please select a month'
    });

    if (month) {
      setGenerating(true);
      try {
        const res = await hostelFeeAPI.generate({ month });
        Swal.fire({
          icon: 'success',
          title: 'System Synchronized',
          text: `${res.data.data.createdCount} records created, ${res.data.data.skippedCount} students already had records.`,
          confirmButtonColor: '#6366f1'
        });
        fetchData();
      } catch (error) {
        toast.error('Failed to generate bills');
      } finally {
        setGenerating(false);
      }
    }
  };

  const handleMarkAsPaid = (record) => {
    Swal.fire({
      title: 'Collect Payment',
      html: `
        <div class="text-left space-y-4">
          <div class="p-4 bg-indigo-50 rounded-xl border border-indigo-100 mb-4">
            <p class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-1">Student</p>
            <p class="font-bold text-slate-800">${record.studentName}</p>
            <p class="text-xs text-slate-500">Amount Due: ₹${record.totalAmount.toLocaleString()}</p>
          </div>
          <label class="block text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Payment Mode</label>
          <select id="paymentMode" class="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-indigo-600 outline-none transition-all font-bold">
            <option value="Online">UPI / Online Transfer</option>
            <option value="Cash">Physical Cash</option>
            <option value="Card">Credit/Debit Card</option>
            <option value="Cheque">Bank Cheque</option>
          </select>
        </div>
      `,
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      confirmButtonText: 'Confirm Payment',
      preConfirm: () => ({
        paymentMode: document.getElementById('paymentMode').value
      })
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsSubmitting(true);
        try {
          await hostelFeeAPI.markPaid(record._id, {
            paymentMode: result.value.paymentMode
          });
          toast.success('Payment recorded successfully');
          fetchData();
        } catch (error) {
          toast.error('Failed to update payment');
        } finally {
          setIsSubmitting(false);
        }
      }
    });
  };

  const filteredRecords = feeRecords.filter(record => {
    const studentName = record.studentName || '';
    const studentId = record.studentId || '';
    const monthMatch = selectedMonth === 'all' || record.month === selectedMonth;
    const statusMatch = selectedStatus === 'all' || record.status === selectedStatus;
    const searchMatch = studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       studentId.toString().includes(searchTerm);
    return monthMatch && statusMatch && searchMatch;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Paid': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Overdue': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-indigo-200 shadow-xl">
              <FaMoneyBillWave className="text-white" />
            </div>
            Financial Ledger
          </h1>
          <p className="text-slate-500 font-medium mt-2">Manage hostel revenue, room rents, and mess billing systems.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={handleGenerateBills}
            disabled={generating}
            className={`flex items-center gap-2 px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 ${generating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {generating ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : <FaMagic />}
            Auto-Generate Bills
          </button>
          <button className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
            <FaDownload />
            Export Ledger
          </button>
        </div>
      </div>

      {/* Modern Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Total Revenue', value: stats.totalRevenue, icon: FaMoneyBillWave, color: 'indigo' },
          { label: 'Pending Dues', value: stats.pendingDues, icon: FaClock, color: 'amber' },
          { label: 'Paid Profiles', value: stats.paidCount, icon: FaCheckCircle, color: 'emerald', suffix: '' },
          { label: 'Avg Collection', value: stats.avgPayment, icon: FaReceipt, color: 'purple' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-${stat.color}-50 rounded-2xl group-hover:scale-110 transition-transform`}>
                <stat.icon className={`text-xl text-${stat.color}-600`} />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Aggregates</span>
            </div>
            <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900">
              {stat.suffix === '' ? stat.value : `₹${stat.value.toLocaleString()}`}
            </p>
          </div>
        ))}
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm mb-8 flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[300px] relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            placeholder="Search student ledger..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-bold text-slate-700"
          />
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:border-indigo-600 transition-all"
          >
            <option value="all">All Cycles</option>
            {months.map(m => <option key={m} value={m}>{m}</option>)}
          </select>

          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:border-indigo-600 transition-all"
          >
            <option value="all">Every Status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-900 border-b border-slate-800">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student / ID</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Location</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Cycle</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Breakdown</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Amount</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-20 text-center">
                    <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading Ledger...</p>
                  </td>
                </tr>
              ) : filteredRecords.map((record) => (
                <tr key={record._id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        {record.studentName?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{record.studentName}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase">Roll: {record.rollNumber || 'N/A'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="inline-flex flex-col items-center p-2 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-black text-indigo-600 uppercase tracking-tight">Room {record.roomNumber || 'N/A'}</p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Bed {record.bedNumber || 'N/A'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex items-center justify-center gap-2 text-slate-600">
                      <FaCalendarAlt size={12} className="text-indigo-600" />
                      <span className="font-bold text-sm">{record.month}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex items-center justify-center gap-4">
                      <div className="text-center group/tooltip relative">
                        <FaBed className="mx-auto text-slate-300 group-hover:text-indigo-500 transition-colors" />
                        <p className="text-[8px] font-black text-slate-400 mt-1">₹{record.roomRent}</p>
                      </div>
                      <div className="text-center">
                        <FaUtensils className="mx-auto text-slate-300" />
                        <p className="text-[8px] font-black text-slate-400 mt-1">₹{record.messCharges}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-base font-black text-slate-900 tracking-tight">₹{record.totalAmount?.toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${getStatusStyle(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    {record.status !== 'Paid' ? (
                      <button 
                        onClick={() => handleMarkAsPaid(record)}
                        disabled={isSubmitting}
                        className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm disabled:bg-slate-100 disabled:text-slate-300"
                      >
                        {isSubmitting ? <FaSpinner className="animate-spin text-lg" /> : <FaCheckCircle className="text-lg text-inherit" />}
                      </button>
                    ) : (
                      <div className="flex items-center justify-end gap-2 text-emerald-600">
                        <p className="text-[10px] font-black uppercase">{record.paymentMode}</p>
                        <FaReceipt size={14} className="opacity-50" />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRecords.length === 0 && !loading && (
          <div className="text-center py-32 bg-slate-50/50">
            <div className="p-6 bg-white rounded-full w-fit mx-auto shadow-xl mb-6">
              <FaExclamationTriangle className="text-4xl text-amber-500" />
            </div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">No Transactions Recorded</h3>
            <p className="text-slate-500 font-medium max-w-sm mx-auto mt-2 italic">Refine your search parameters or synchronize the ledger using the Auto-Generate tool.</p>
          </div>
        )}
      </div>

      {/* Helper Legend */}
      <div className="mt-8 p-6 bg-white rounded-3xl border border-slate-100 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-200 animate-pulse"></div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500 shadow-lg shadow-amber-200"></div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pending Collections</span>
          </div>
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Warden Panel • Integrated Billing System v2.0</p>
      </div>
    </div>
  );
};

export default HostelFeeManagement;
