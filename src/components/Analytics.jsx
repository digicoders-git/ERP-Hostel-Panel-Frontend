import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { FaArrowLeft, FaChartLine, FaChartPie, FaChartBar } from 'react-icons/fa';

const Analytics = ({ onBack }) => {
    // Mock Data fetching
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const rooms = JSON.parse(localStorage.getItem('rooms') || '[]');
    const allocations = JSON.parse(localStorage.getItem('roomAllocations') || '[]');

    const occupiedCount = allocations.length;
    const availableCount = rooms.length - occupiedCount;

    // 1. Room Occupancy Chart Options
    const occupancyOptions = {
        chart: { type: 'pie', backgroundColor: 'transparent' },
        title: { text: 'Room Occupancy Status', style: { fontWeight: 'bold' } },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: { enabled: true, format: '<b>{point.name}</b>: {point.percentage:.1f} %' },
                showInLegend: true
            }
        },
        series: [{
            name: 'Rooms',
            colorByPoint: true,
            data: [
                { name: 'Occupied', y: occupiedCount, color: '#6366f1' },
                { name: 'Available', y: Math.max(0, availableCount), color: '#e2e8f0' }
            ]
        }],
        credits: { enabled: false }
    };

    // 2. Attendance Trend Options (Mocking last 7 days)
    const attendanceOptions = {
        chart: { type: 'areaspline', backgroundColor: 'transparent' },
        title: { text: 'Monthly Attendance Trend (%)', style: { fontWeight: 'bold' } },
        xAxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
        yAxis: { title: { text: 'Percentage' }, max: 100 },
        series: [{
            name: 'Attendance',
            data: [92, 88, 95, 91, 89, 85, 93],
            color: '#10b981'
        }],
        credits: { enabled: false }
    };

    // 3. Mess Usage Options
    const messOptions = {
        chart: { type: 'column', backgroundColor: 'transparent' },
        title: { text: 'Mess Usage by Meal Type', style: { fontWeight: 'bold' } },
        xAxis: { categories: ['Breakfast', 'Lunch', 'Evening Snacks', 'Dinner'] },
        series: [{
            name: 'Avg. Attendance',
            data: [145, 120, 85, 150],
            color: '#f59e0b'
        }],
        credits: { enabled: false }
    };

    return (
        <div className="animate-in space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={onBack}
                        className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm group"
                    >
                        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Analytics</h2>
                        <p className="text-slate-500 font-medium">Deep dive into hostel performance metrics</p>
                    </div>
                </div>
                <div className="hidden md:flex bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100 items-center space-x-2">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></div>
                    <span className="text-indigo-700 font-bold text-xs uppercase tracking-widest">Live Data Feed</span>
                </div>
            </div>

            {/* Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Occupancy Chart */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                            <FaChartPie />
                        </div>
                        <h3 className="font-black text-slate-800 tracking-tight">Occupancy Ratio</h3>
                    </div>
                    <HighchartsReact highcharts={Highcharts} options={occupancyOptions} />
                </div>

                {/* Attendance Chart */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                            <FaChartLine />
                        </div>
                        <h3 className="font-black text-slate-800 tracking-tight">Resident Tracking</h3>
                    </div>
                    <HighchartsReact highcharts={Highcharts} options={attendanceOptions} />
                </div>

                {/* Mess Chart */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all lg:col-span-2">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                            <FaChartBar />
                        </div>
                        <h3 className="font-black text-slate-800 tracking-tight">Mess Analytics (Weekly)</h3>
                    </div>
                    <div className="w-full">
                        <HighchartsReact highcharts={Highcharts} options={messOptions} />
                    </div>
                </div>
            </div>

            {/* Summary Footer */}
            <div className="bg-[#0f172a] rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <FaChartLine size={150} />
                </div>
                <div className="text-center md:text-left z-10">
                    <h4 className="text-xl font-black mb-2">Performance Summary</h4>
                    <p className="text-slate-400 text-sm font-medium">System health is at <span className="text-emerald-400 font-bold">98.4%</span> based on current student feedbacks and maintenance logs.</p>
                </div>
                <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-all shadow-xl z-10 whitespace-nowrap">
                    Download PDF Report
                </button>
            </div>
        </div>
    );
};

export default Analytics;
