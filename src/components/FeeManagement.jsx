import { useState, useEffect } from 'react';
import { FaMoneyBillWave, FaSearch, FaFilter, FaCheckCircle, FaExclamationCircle, FaHistory, FaUser, FaWallet, FaChartLine } from 'react-icons/fa';
import Swal from 'sweetalert2';

const FeeManagement = () => {
    const [feeRecords, setFeeRecords] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    useEffect(() => {
        const savedFees = JSON.parse(localStorage.getItem('hostelFees') || '[]');

        if (savedFees.length === 0) {
            const students = JSON.parse(localStorage.getItem('students') || '[]');
            const sampleFees = students.length > 0 ? students.map(s => ({
                id: Date.now() + Math.random(),
                studentId: s.id,
                studentName: s.name,
                rollNumber: s.rollNumber,
                totalAmount: 5000,
                paidAmount: Math.random() > 0.5 ? 5000 : 2000,
                dueDate: '2026-02-10',
                status: Math.random() > 0.5 ? 'Paid' : 'Pending',
                lastPaymentDate: '2026-01-05'
            })) : [
                { id: 1, studentName: 'Rahul Kumar', rollNumber: 'HOST001', totalAmount: 5000, paidAmount: 5000, dueDate: '2026-02-10', status: 'Paid', lastPaymentDate: '2026-01-05' },
                { id: 2, studentName: 'Amit Singh', rollNumber: 'HOST002', totalAmount: 5000, paidAmount: 0, dueDate: '2026-02-10', status: 'Pending', lastPaymentDate: '-' },
                { id: 3, studentName: 'Priya Sharma', rollNumber: 'HOST003', totalAmount: 5500, paidAmount: 3000, dueDate: '2026-02-10', status: 'Partial', lastPaymentDate: '2026-01-10' },
            ];
            setFeeRecords(sampleFees);
            localStorage.setItem('hostelFees', JSON.stringify(sampleFees));
        } else {
            setFeeRecords(savedFees);
        }
    }, []);

    const handleCollectFee = (record) => {
        Swal.fire({
            title: 'Collect Fee',
            html: `
        <div class="text-left">
          <p><b>Student:</b> ${record.studentName}</p>
          <p><b>Pending:</b> ₹${record.totalAmount - record.paidAmount}</p>
          <input id="amount" type="number" class="swal2-input" placeholder="Enter amount">
        </div>
      `,
            showCancelButton: true,
            confirmButtonText: 'Collect',
            preConfirm: () => {
                const amount = document.getElementById('amount').value;
                if (!amount || amount <= 0) {
                    Swal.showValidationMessage('Please enter a valid amount');
                }
                return amount;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const amount = parseFloat(result.value);
                const updatedRecords = feeRecords.map(r => {
                    if (r.id === record.id) {
                        const newPaid = r.paidAmount + amount;
                        return {
                            ...r,
                            paidAmount: newPaid,
                            status: newPaid >= r.totalAmount ? 'Paid' : 'Partial',
                            lastPaymentDate: new Date().toISOString().split('T')[0]
                        };
                    }
                    return r;
                });
                setFeeRecords(updatedRecords);
                localStorage.setItem('hostelFees', JSON.stringify(updatedRecords));
                Swal.fire('Success', 'Payment recorded successfully', 'success');
            }
        });
    };

    const filteredRecords = feeRecords.filter(record => {
        const studentName = record.studentName || '';
        const rollNumber = record.rollNumber || '';
        const matchesSearch = studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || record.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedRecords = filteredRecords.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    const stats = [
        { label: 'Total Revenue', value: '₹' + feeRecords.reduce((acc, curr) => acc + curr.paidAmount, 0).toLocaleString(), icon: FaWallet, color: 'indigo' },
        { label: 'Pending Dues', value: '₹' + feeRecords.reduce((acc, curr) => acc + (curr.totalAmount - curr.paidAmount), 0).toLocaleString(), icon: FaExclamationCircle, color: 'rose' },
        { label: 'Collections', value: feeRecords.filter(r => r.status === 'Paid').length, icon: FaCheckCircle, color: 'emerald' },
        { label: 'Avg Payment', value: '₹' + (feeRecords.length > 0 ? Math.round(feeRecords.reduce((acc, curr) => acc + curr.paidAmount, 0) / feeRecords.length) : 0).toLocaleString(), icon: FaChartLine, color: 'blue' },
    ];

    return (
        <div className="animate-in space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                        <FaMoneyBillWave className="text-indigo-600" />
                        Fee Management
                    </h2>
                    <p className="text-slate-500 font-medium text-lg">Track and manage student hostel fees</p>
                </div>
                <button
                    className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2"
                    data-tooltip="View All Past Transactions"
                >
                    <FaHistory /> Transaction History
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                        <div className="flex items-start justify-between">
                            <div className={`p-4 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform duration-300`}>
                                <stat.icon className="text-2xl" />
                            </div>
                        </div>
                        <div className="mt-6">
                            <p className="text-3xl font-black text-slate-900 leading-none">{stat.value}</p>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-2">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="relative flex-1">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by student name or roll number..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                        />
                    </div>
                    <div className="flex gap-2">
                        {['All', 'Paid', 'Pending', 'Partial'].map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${statusFilter === status
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-[11px] font-black uppercase tracking-widest">
                                <th className="px-6 py-4">Student Info</th>
                                <th className="px-6 py-4">Total Fee</th>
                                <th className="px-6 py-4">Paid</th>
                                <th className="px-6 py-4">Balance</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Due Date</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {paginatedRecords.map((record) => (
                                <tr key={record.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center font-bold">
                                                {record.studentName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{record.studentName}</p>
                                                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-tighter">{record.rollNumber}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-900">₹{record.totalAmount}</td>
                                    <td className="px-6 py-4 font-bold text-emerald-600">₹{record.paidAmount}</td>
                                    <td className="px-6 py-4 font-bold text-rose-600">₹{record.totalAmount - record.paidAmount}</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${record.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' :
                                                record.status === 'Partial' ? 'bg-amber-50 text-amber-600' :
                                                    'bg-rose-50 text-rose-600 border border-rose-100'
                                                }`}
                                            data-tooltip={`Fee Status: ${record.status}`}
                                        >
                                            {record.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-sm font-medium">{record.dueDate}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => handleCollectFee(record)}
                                                className="p-2 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                                                data-tooltip="Collect Payment"
                                            >
                                                <FaWallet />
                                            </button>
                                            <button
                                                className="p-2 text-slate-400 bg-slate-50 rounded-lg hover:bg-slate-200 transition-all"
                                                data-tooltip="View Student History"
                                            >
                                                <FaHistory />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Show</span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => setItemsPerPage(Number(e.target.value))}
                            className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
                        >
                            <option value={5}>5 Rows</option>
                            <option value={10}>10 Rows</option>
                            <option value={20}>20 Rows</option>
                        </select>
                        <span className="text-xs font-bold text-slate-400">
                            {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredRecords.length)} of {filteredRecords.length}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:bg-white hover:text-indigo-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all group"
                            data-tooltip="Previous Page"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                        </button>

                        <div className="flex gap-1">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-8 h-8 rounded-xl text-xs font-black transition-all ${currentPage === i + 1
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                        : 'text-slate-500 hover:bg-white hover:text-indigo-600'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:bg-white hover:text-indigo-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all group"
                            data-tooltip="Next Page"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeeManagement;
