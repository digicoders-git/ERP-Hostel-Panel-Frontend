import { useState } from 'react';
import toast from 'react-hot-toast';
import { FaKey, FaLock, FaEye, FaEyeSlash, FaCheck, FaTimes, FaSave, FaShieldAlt, FaSpinner } from 'react-icons/fa';
import { authAPI } from '../services/api';

const ChangePassword = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return { minLength, hasUpper, hasLower, hasNumber, hasSpecial };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else {
      const validation = validatePassword(formData.newPassword);
      if (!Object.values(validation).every(Boolean)) {
        newErrors.newPassword = 'Password does not meet requirements';
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        await authAPI.changePassword({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        });
        toast.success('Security credentials updated');
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => {
          onNavigate('dashboard');
        }, 1500);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to update credentials');
      } finally {
        setLoading(false);
      }
    }
  };

  const passwordValidation = validatePassword(formData.newPassword);

  return (
    <div className="space-y-8 animate-in transition-all pb-12">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Security Portal</h2>
          <p className="text-slate-500 font-medium tracking-tight">Manage and update your administrative authentication credentials.</p>
        </div>
        <div className="bg-slate-900 text-white px-8 py-4 rounded-[2rem] shadow-2xl flex items-center gap-4">
           <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400">
              <FaShieldAlt />
           </div>
           <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Auth Status</p>
              <p className="text-sm font-black uppercase tracking-widest">Warden Verified</p>
           </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto bg-white rounded-[3rem] p-12 border border-slate-100 shadow-2xl overflow-hidden relative">
        <div className="flex items-center gap-4 mb-12">
           <div className="w-14 h-14 rounded-3xl bg-indigo-600 text-white flex items-center justify-center text-2xl shadow-xl shadow-indigo-100">
              <FaKey />
           </div>
           <div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">Credential Sync</h3>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Official Password Modification Interface</p>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Current Password */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Current Password</label>
            <div className="relative group">
              <FaLock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type={showPasswords.current ? 'text' : 'password'}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                placeholder="Enter current password"
                className={`w-full pl-14 pr-16 py-4 bg-slate-50 border-2 rounded-2xl text-sm font-bold text-slate-800 outline-none transition-all ${
                  errors.currentPassword ? 'border-rose-400 bg-rose-50' : 'border-transparent focus:border-slate-900 focus:bg-white'
                }`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 text-slate-300 hover:text-slate-900"
              >
                {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.currentPassword && <p className="text-[10px] font-black text-rose-500 uppercase mt-1 pl-1">{errors.currentPassword}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* New Password */}
             <div className="space-y-4">
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">New Secure Password</label>
                 <div className="relative group">
                   <FaKey className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                   <input
                     type={showPasswords.new ? 'text' : 'password'}
                     name="newPassword"
                     value={formData.newPassword}
                     onChange={handleInputChange}
                     placeholder="New secret key"
                     className={`w-full pl-14 pr-16 py-4 bg-slate-50 border-2 rounded-2xl text-sm font-bold text-slate-800 outline-none transition-all ${
                       errors.newPassword ? 'border-rose-400' : 'border-transparent focus:border-slate-900 focus:bg-white'
                     }`}
                   />
                   <button
                     type="button"
                     onClick={() => togglePasswordVisibility('new')}
                     className="absolute right-6 top-1/2 transform -translate-y-1/2 text-slate-300 hover:text-slate-900"
                   >
                     {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                   </button>
                 </div>
               </div>

               {formData.newPassword && (
                 <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-3">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Complexity Metrics</p>
                   {[
                     { label: '8+ Characters', met: passwordValidation.minLength },
                     { label: 'Uppercase', met: passwordValidation.hasUpper },
                     { label: 'Lowercase', met: passwordValidation.hasLower },
                     { label: 'Numeric', met: passwordValidation.hasNumber },
                     { label: 'Special Symbol', met: passwordValidation.hasSpecial }
                   ].map((req, i) => (
                     <div key={i} className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-tight ${req.met ? 'text-emerald-600' : 'text-slate-300'}`}>
                        {req.met ? <FaCheck /> : <FaTimes />}
                        <span>{req.label}</span>
                     </div>
                   ))}
                 </div>
               )}
             </div>

             {/* Confirm Password */}
             <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Confirm Identity Key</label>
               <div className="relative group">
                 <FaLock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                 <input
                   type={showPasswords.confirm ? 'text' : 'password'}
                   name="confirmPassword"
                   value={formData.confirmPassword}
                   onChange={handleInputChange}
                   placeholder="Repeat secret key"
                   className={`w-full pl-14 pr-16 py-4 bg-slate-50 border-2 rounded-2xl text-sm font-bold text-slate-800 outline-none transition-all ${
                     errors.confirmPassword ? 'border-rose-400' : 'border-transparent focus:border-slate-900 focus:bg-white'
                   }`}
                 />
                 <button
                   type="button"
                   onClick={() => togglePasswordVisibility('confirm')}
                   className="absolute right-6 top-1/2 transform -translate-y-1/2 text-slate-300 hover:text-slate-900"
                 >
                   {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                 </button>
               </div>
               {errors.confirmPassword && <p className="text-[10px] font-black text-rose-500 uppercase mt-1 pl-1">{errors.confirmPassword}</p>}
               {formData.confirmPassword && formData.newPassword === formData.confirmPassword && (
                 <div className="mt-2 flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest pl-1">
                   <FaCheckCircle />
                   <span>Keys Synchronized</span>
                 </div>
               )}
             </div>
          </div>

          <div className="flex gap-4 pt-8 border-t border-slate-100">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-3 py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-100 hover:bg-black transition-all disabled:bg-slate-400 disabled:shadow-none"
            >
              {loading ? <FaSpinner className="animate-spin text-lg" /> : <FaSave className="text-lg" />}
              {loading ? 'Syncing Credentials...' : 'Commit Security Update'}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="px-12 py-6 bg-slate-100 text-slate-600 rounded-[2.2rem] font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all font-bold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;