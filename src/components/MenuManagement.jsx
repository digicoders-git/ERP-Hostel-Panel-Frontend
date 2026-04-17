import { useState, useEffect } from 'react';
import { 
  FaPlus, FaEdit, FaTrash, FaUtensils, FaCalendar, FaClock, 
  FaChevronLeft, FaChevronRight, FaDownload, FaTable, FaThLarge,
  FaCoffee, FaSun, FaMoon, FaCheckCircle, FaSpinner, FaHistory
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import { hostelMenuAPI } from '../services/api';
import toast from 'react-hot-toast';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const EMPTY_FORM = {
  day: '',
  breakfast: '',
  lunch: '',
  dinner: '',
  breakfastTime: '07:00',
  lunchTime: '12:30',
  dinnerTime: '19:00'
};

const MenuManagement = () => {
  const [menuData, setMenuData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const response = await hostelMenuAPI.getAll();
      const menus = response.data.menus || response.data.data || response.data;
      if (Array.isArray(menus)) {
        // Sort by days index for consistent ledger view
        const sorted = [...menus].sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day));
        setMenuData(sorted);
      }
    } catch (error) {
      console.error('Error fetching menu:', error);
      toast.error('Failed to load menu data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.day || !formData.breakfast || !formData.lunch || !formData.dinner) {
      toast.error('Please fill all required meal fields');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingId) {
        await hostelMenuAPI.update(editingId, formData);
        toast.success('Weekly Menu Book Updated');
      } else {
        await hostelMenuAPI.create(formData);
        toast.success('New Menu Entry Recorded');
      }
      fetchMenu();
      resetForm();
    } catch (error) {
      toast.error('Failed to sync menu archive');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditingId(item._id || item.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Remove Menu Entry?',
      text: 'This will delete the meal schedule for the selected day.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Delete Entry',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await hostelMenuAPI.remove(id);
          fetchMenu();
          toast.success('Entry removed from ledger');
        } catch (error) {
          toast.error('Failed to remove entry');
        }
      }
    });
  };

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
  };

  const handleExport = () => {
    const csv = [
      ['Day', 'Breakfast', 'Time', 'Lunch', 'Time', 'Dinner', 'Time'],
      ...menuData.map(m => [m.day, m.breakfast, m.breakfastTime, m.lunch, m.lunchTime, m.dinner, m.dinnerTime])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weekly_menu_ledger.csv`;
    a.click();
  };

  return (
    <div className="space-y-8 animate-in transition-all">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Weekly Menu Book</h2>
          <p className="text-slate-500 font-medium tracking-tight">Official schedule of dietary provisions and meal timings.</p>
        </div>
        {!showForm && (
          <div className="flex gap-3">
             <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                    viewMode === 'table' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <FaTable /> Ledger
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                    viewMode === 'cards' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <FaThLarge /> Cards
                </button>
             </div>
             <button
              onClick={handleExport}
              className="flex items-center gap-3 px-6 py-3.5 bg-white text-slate-600 border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
            >
              <FaDownload /> Export
            </button>
            <button
              onClick={() => { setShowForm(true); setEditingId(null); setFormData(EMPTY_FORM); }}
              className="flex items-center gap-3 px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
            >
              <FaPlus /> Authorize Menu
            </button>
          </div>
        )}
      </div>

      {showForm ? (
        <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-2xl max-w-4xl mx-auto animate-in zoom-in duration-300">
           <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 rounded-3xl bg-indigo-600 text-white flex items-center justify-center text-2xl shadow-xl shadow-indigo-100">
                 <FaUtensils />
              </div>
              <div>
                 <h3 className="text-3xl font-black text-slate-900 tracking-tight">{editingId ? 'Modify Menu Entry' : 'Configure Weekly Meal'}</h3>
                 <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Official Dietary Compliance Registry</p>
              </div>
           </div>

           <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Target Day of Week</label>
                <select 
                  name="day" 
                  value={formData.day} 
                  onChange={handleInputChange} 
                  className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] focus:border-indigo-600 focus:bg-white text-sm font-bold text-slate-800 outline-none transition-all appearance-none"
                  required
                >
                  <option value="">Choose Cycle Day...</option>
                  {DAYS.map(day => <option key={day} value={day}>{day}</option>)}
                </select>
              </div>

              {/* Breakfast Segment */}
              <div className="p-8 bg-amber-50 rounded-[2rem] border border-amber-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 col-span-1 md:col-span-2 flex items-center gap-2 mb-2">
                   <FaCoffee className="text-amber-600" />
                   <h4 className="text-[10px] font-black text-amber-700 uppercase tracking-[0.2em]">Breakfast Provisions</h4>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-amber-600 uppercase tracking-widest pl-1">Menu Items</label>
                  <input type="text" name="breakfast" value={formData.breakfast} onChange={handleInputChange} className="w-full px-6 py-4 bg-white border-2 border-transparent rounded-2xl focus:border-amber-400 text-sm font-bold text-slate-800 outline-none transition-all" placeholder="e.g. Aloo Paratha, Curd, Poha..." required />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-amber-600 uppercase tracking-widest pl-1">Serving Time</label>
                  <input type="time" name="breakfastTime" value={formData.breakfastTime} onChange={handleInputChange} className="w-full px-6 py-4 bg-white border-2 border-transparent rounded-2xl focus:border-amber-400 text-sm font-bold text-slate-800 outline-none transition-all" />
                </div>
              </div>

              {/* Lunch Segment */}
              <div className="p-8 bg-emerald-50 rounded-[2rem] border border-emerald-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 col-span-1 md:col-span-2 flex items-center gap-2 mb-2">
                   <FaSun className="text-emerald-600" />
                   <h4 className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.2em]">Lunch Provisions</h4>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-emerald-600 uppercase tracking-widest pl-1">Menu Items</label>
                  <input type="text" name="lunch" value={formData.lunch} onChange={handleInputChange} className="w-full px-6 py-4 bg-white border-2 border-transparent rounded-2xl focus:border-emerald-400 text-sm font-bold text-slate-800 outline-none transition-all" placeholder="e.g. Rice, Dal, Mixed Veg, Salad..." required />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-emerald-600 uppercase tracking-widest pl-1">Serving Time</label>
                  <input type="time" name="lunchTime" value={formData.lunchTime} onChange={handleInputChange} className="w-full px-6 py-4 bg-white border-2 border-transparent rounded-2xl focus:border-emerald-400 text-sm font-bold text-slate-800 outline-none transition-all" />
                </div>
              </div>

              {/* Dinner Segment */}
              <div className="p-8 bg-rose-50 rounded-[2rem] border border-rose-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 col-span-1 md:col-span-2 flex items-center gap-2 mb-2">
                   <FaMoon className="text-rose-600" />
                   <h4 className="text-[10px] font-black text-rose-700 uppercase tracking-[0.2em]">Dinner Provisions</h4>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-rose-600 uppercase tracking-widest pl-1">Menu Items</label>
                  <input type="text" name="dinner" value={formData.dinner} onChange={handleInputChange} className="w-full px-6 py-4 bg-white border-2 border-transparent rounded-2xl focus:border-rose-400 text-sm font-bold text-slate-800 outline-none transition-all" placeholder="e.g. Roti, Paneer Butter Masala, Sweet..." required />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-rose-600 uppercase tracking-widest pl-1">Serving Time</label>
                  <input type="time" name="dinnerTime" value={formData.dinnerTime} onChange={handleInputChange} className="w-full px-6 py-4 bg-white border-2 border-transparent rounded-2xl focus:border-rose-400 text-sm font-bold text-slate-800 outline-none transition-all" />
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t border-slate-100">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-200 hover:bg-black transition-all flex items-center justify-center gap-3 disabled:bg-slate-400 disabled:shadow-none"
                >
                  {isSubmitting ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />} 
                  {isSubmitting ? 'Syncing Menu Archive...' : (editingId ? 'Update Menu Entry' : 'Authorize & Commit Menu')}
                </button>
                <button 
                  type="button" 
                  onClick={resetForm}
                  className="px-12 py-6 bg-slate-100 text-slate-600 rounded-[2.2rem] font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all font-bold"
                >
                  Cancel
                </button>
              </div>
           </form>
        </div>
      ) : (
        <>
          {viewMode === 'table' ? (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-900 border-b border-slate-800 text-white">
                      <tr>
                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cycle Day</th>
                        <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Morning (☕)</th>
                        <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Noon (☀️)</th>
                        <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Night (🌙)</th>
                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {menuData.length > 0 ? (
                        menuData.map((menu, idx) => (
                          <tr key={menu._id} className="hover:bg-slate-50/50 transition-all group">
                             <td className="px-10 py-6">
                                <p className="font-black text-slate-900 text-base">{menu.day}</p>
                                <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mt-1 italic">Authorized Slot</p>
                             </td>
                             <td className="px-6 py-6">
                                <p className="text-sm font-bold text-slate-800 leading-tight">{menu.breakfast}</p>
                                <p className="text-[10px] font-black text-amber-600 mt-1 uppercase tracking-tight">{menu.breakfastTime}</p>
                             </td>
                             <td className="px-6 py-6">
                                <p className="text-sm font-bold text-slate-800 leading-tight">{menu.lunch}</p>
                                <p className="text-[10px] font-black text-emerald-600 mt-1 uppercase tracking-tight">{menu.lunchTime}</p>
                             </td>
                             <td className="px-6 py-6">
                                <p className="text-sm font-bold text-slate-800 leading-tight">{menu.dinner}</p>
                                <p className="text-[10px] font-black text-rose-600 mt-1 uppercase tracking-tight">{menu.dinnerTime}</p>
                             </td>
                             <td className="px-10 py-6 text-right">
                                <div className="flex justify-end gap-2">
                                   <button onClick={() => handleEdit(menu)} className="p-3 bg-slate-100 text-slate-400 hover:bg-slate-900 hover:text-white rounded-xl transition-all"><FaEdit /></button>
                                   <button onClick={() => handleDelete(menu._id)} className="p-3 bg-slate-50 text-slate-300 hover:bg-rose-50 hover:text-rose-500 rounded-xl transition-all"><FaTrash /></button>
                                </div>
                             </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="py-24 text-center">
                             <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                                   <FaHistory className="text-4xl" />
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">No menu archives identified in this rotation.</p>
                             </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
               </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {menuData.map(menu => (
                <div key={menu._id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                   <div className="bg-slate-900 p-8 text-white relative">
                      <div className="absolute top-8 right-8 w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500">
                         <FaUtensils />
                      </div>
                      <h3 className="text-2xl font-black tracking-tight">{menu.day}</h3>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Authorized Provision</p>
                   </div>
                   <div className="p-8 space-y-6">
                      <div className="space-y-1">
                         <div className="flex items-center gap-2 mb-2">
                            <FaCoffee className="text-amber-500 text-xs" />
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Morning Cycle</span>
                         </div>
                         <p className="font-bold text-slate-800 text-sm leading-tight">{menu.breakfast}</p>
                         <p className="text-[10px] font-black text-amber-600">{menu.breakfastTime}</p>
                      </div>
                      <div className="space-y-1">
                         <div className="flex items-center gap-2 mb-2">
                            <FaSun className="text-emerald-500 text-xs" />
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Noon Cycle</span>
                         </div>
                         <p className="font-bold text-slate-800 text-sm leading-tight">{menu.lunch}</p>
                         <p className="text-[10px] font-black text-emerald-600">{menu.lunchTime}</p>
                      </div>
                      <div className="space-y-1">
                         <div className="flex items-center gap-2 mb-2">
                            <FaMoon className="text-rose-500 text-xs" />
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Night Cycle</span>
                         </div>
                         <p className="font-bold text-slate-800 text-sm leading-tight">{menu.dinner}</p>
                         <p className="text-[10px] font-black text-rose-600">{menu.dinnerTime}</p>
                      </div>
                   </div>
                   <div className="p-6 bg-slate-50 flex gap-2 border-t border-slate-100">
                      <button onClick={() => handleEdit(menu)} className="flex-1 py-3 bg-white text-slate-600 rounded-xl font-black text-[9px] uppercase tracking-widest border border-slate-200 hover:bg-slate-900 hover:text-white transition-all">Modify</button>
                      <button onClick={() => handleDelete(menu._id)} className="p-3 bg-white text-slate-300 hover:text-rose-500 rounded-xl border border-slate-200 transition-all"><FaTrash /></button>
                   </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MenuManagement;