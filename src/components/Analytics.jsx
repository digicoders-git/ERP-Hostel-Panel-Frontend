import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { FaArrowLeft, FaChartLine, FaChartPie, FaChartBar } from 'react-icons/fa';
import { analyticsAPI } from '../services/api';
import toast from 'react-hot-toast';

const Analytics = ({ onBack }) => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalyticsData();
    }, []);

    const fetchAnalyticsData = async () => {
        setLoading(true);
        try {
            const response = await analyticsAPI.getOverview();
            if (response.data.success) {
                setAnalyticsData(response.data.data);
            }
        } catch (error) {
            console.error('Analytics fetch error:', error);
            toast.error('Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    const roomStats = analyticsData?.rooms || { total: 0, occupied: 0, available: 0, occupancyRate: 0 };
    const availableCount = roomStats.available;

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
                { name: 'Occupied', y: roomStats.occupied, color: '#6366f1' },
                { name: 'Available', y: roomStats.available, color: '#e2e8f0' }
            ]
        }],
        credits: { enabled: false }
    };

    // 2. Attendance Trend Options
    const attendanceTrend = analyticsData?.attendance?.trend || [];
    const attendanceOptions = {
        chart: { type: 'areaspline', backgroundColor: 'transparent' },
        title: { text: 'Weekly Attendance Trend', style: { fontWeight: 'bold' } },
        xAxis: { categories: attendanceTrend.map(t => t.date) },
        yAxis: { title: { text: 'Count' } },
        series: [
            {
                name: 'Present',
                data: attendanceTrend.map(t => t.present),
                color: '#10b981'
            },
            {
                name: 'Absent',
                data: attendanceTrend.map(t => t.absent),
                color: '#ef4444'
            }
        ],
        credits: { enabled: false }
    };

    // 3. Mess Usage Options
    const messWeekly = analyticsData?.mess?.weekly || [];
    const messOptions = {
        chart: { type: 'column', backgroundColor: 'transparent' },
        title: { text: 'Mess Usage by Meal Type (Last 7 Days)', style: { fontWeight: 'bold' } },
        xAxis: { categories: messWeekly.map(m => m._id) },
        series: [
            {
                name: 'Breakfast',
                data: messWeekly.map(m => m.breakfast),
                color: '#f59e0b'
            },
            {
                name: 'Lunch',
                data: messWeekly.map(m => m.lunch),
                color: '#6366f1'
            },
            {
                name: 'Dinner',
                data: messWeekly.map(m => m.dinner),
                color: '#10b981'
            }
        ],
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
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Back to Dashboard</h2>
                        <p className="text-slate-500 font-medium">Deep dive into hostel performance metrics</p>
                    </div>
                </div>
                <div className="hidden md:flex bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100 items-center space-x-2">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></div>
                    <span className="text-indigo-700 font-bold text-xs uppercase tracking-widest">Live Data Feed</span>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-slate-500">Loading analytics...</div>
            ) : (
            <>
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
                    <p className="text-slate-400 text-sm font-medium">
                        Occupancy is at <span className="text-emerald-400 font-bold">{roomStats.occupancyRate}%</span> with <span className="text-indigo-400 font-bold">{roomStats.occupied}</span> rooms occupied out of <span className="text-indigo-400 font-bold">{roomStats.total}</span>.
                    </p>
                </div>
                <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-all shadow-xl z-10 whitespace-nowrap">
                    Download PDF Report
                </button>
            </div>
            </>
            )}
        </div>
    );
};

export default Analytics;

