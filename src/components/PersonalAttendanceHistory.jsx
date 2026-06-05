import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaSearch, FaCircleNotch } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const PersonalAttendanceHistory = () => {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token') || localStorage.getItem('wardenToken');
            const apiBase = import.meta.env.VITE_API_BASE_URL || 'https://erp-backend-0ab5.onrender.com';
            const { data } = await axios.get(`${apiBase}/api/staff-panel/attendance-staff/my-history`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                setAttendance(data.data);
            }
        } catch (error) {
            toast.error('Failed to load attendance history');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'present': return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
            case 'absent': return 'bg-rose-500/10 text-rose-500 border border-rose-500/20';
            case 'late': return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
            default: return 'bg-slate-500/10 text-slate-500 border border-slate-500/20';
        }
    };

    const filtered = attendance.filter(a => 
        new Date(a.date).toLocaleDateString().includes(searchTerm)
    );

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-screen bg-[#0f172a]">
            <FaCircleNotch className="animate-spin text-4xl text-indigo-500 mb-4" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Compiling Attendance Logs...</p>
        </div>
    );

    return (
        <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-4xl font-black text-slate-800 tracking-tight uppercase italic">Work Log Registry</h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2 italic">Detailed history of your staff presence</p>
                </div>
                <div className="relative group">
                    <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input 
                        placeholder="FILTER BY DATE..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-white border border-slate-200 rounded-[2rem] py-4 pl-14 pr-8 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-indigo-500/10 w-full md:w-80 shadow-sm transition-all"
                    />
                </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-800 text-white">
                                <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.25em]">Registry Date</th>
                                <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.25em]">Presence Status</th>
                                <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.25em]">Clock In</th>
                                <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.25em]">Clock Out</th>
                                <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.25em]">Verification</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filtered.map((item, idx) => (
                                <tr key={idx} className="hover:bg-indigo-50/40 transition-colors">
                                    <td className="px-10 py-6 font-black text-slate-700">
                                        {new Date(item.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest inline-block ${getStatusColor(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6 text-sm font-black text-slate-500">{item.timeIn ? new Date(item.timeIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                                    <td className="px-10 py-6 text-sm font-black text-slate-500">{item.timeOut ? new Date(item.timeOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                                    <td className="px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{item.source || 'Manual'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PersonalAttendanceHistory;
