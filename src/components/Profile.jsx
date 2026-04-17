import React, { useState, useEffect, useRef } from 'react';
import { FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCamera, FaSave, FaBuilding, FaHospital, FaClock, FaVenusMars, FaShieldAlt } from 'react-icons/fa';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const Profile = () => {
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState({
        wardenName: '',
        mobileNumber: '',
        email: '',
        gender: '',
        shift: ''
    });
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002';

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await authAPI.getProfile();
            if (response.data.success) {
                const data = response.data.data;
                setProfile(data);
                setFormData({
                    wardenName: data.wardenName || '',
                    mobileNumber: data.mobileNumber || '',
                    email: data.email || '',
                    gender: data.gender || '',
                    shift: data.shift || ''
                });
                if (data.profileImage) {
                    setPreviewUrl(`${API_BASE_URL}${data.profileImage}`);
                }
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error('Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const submitData = new FormData();
            submitData.append('wardenName', formData.wardenName);
            submitData.append('mobileNumber', formData.mobileNumber);
            submitData.append('gender', formData.gender);
            submitData.append('shift', formData.shift);
            
            if (selectedImage) {
                submitData.append('profileImage', selectedImage);
            }

            const response = await authAPI.updateProfile(submitData);
            if (response.data.success) {
                setProfile(response.data.data);
                setIsEditing(false);
                // Update localStorage to sync across app if needed
                localStorage.setItem('wardenName', response.data.data.wardenName);
                if (response.data.data.profileImage) {
                    localStorage.setItem('profileImage', response.data.data.profileImage);
                }
                
                Swal.fire({
                    title: 'Profile Updated',
                    text: 'Your details have been successfully synchronized.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    confirmButtonColor: '#6366f1'
                });
            }
        } catch (error) {
            console.error('Update profile error:', error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-12 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">Profile Portal</h2>
                    <p className="text-slate-500 font-medium mt-1">Manage your administrative identity and personal credentials.</p>
                </div>
                <div className="flex gap-2">
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-black transition-all"
                        >
                            Edit Profile
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                fetchProfile(); // Reset to current data
                            }}
                            className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                        >
                            Cancel
                        </button>
                    )}
                    <span className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        Authorized System Access
                    </span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Profile Picture & Key Info */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-50 text-center relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-indigo-600 to-blue-500 opacity-10"></div>
                        
                        <div className="relative z-10">
                            <div className="relative mx-auto w-40 h-40 mb-6">
                                <div className="absolute -inset-2 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full opacity-20 blur-lg group-hover:opacity-40 transition-opacity"></div>
                                <div className="relative w-full h-full rounded-full border-4 border-white shadow-xl overflow-hidden bg-slate-100">
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            <FaUser size={60} />
                                        </div>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => isEditing && fileInputRef.current.click()}
                                    className={`absolute bottom-1 right-1 w-12 h-12 ${isEditing ? 'bg-indigo-600' : 'bg-slate-400 cursor-not-allowed'} text-white rounded-full flex items-center justify-center shadow-lg hover:bg-black transition-all group/cam`}
                                >
                                    <FaCamera className="group-hover/cam:scale-110 transition-transform" />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                            </div>

                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{profile?.wardenName}</h3>
                            <p className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em] mt-1">{profile?.assignedHostel?.hostelName || 'Premier Hostel Warden'}</p>
                            
                            <div className="mt-8 pt-8 border-t border-slate-50 space-y-4">
                                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl group/item">
                                    <div className="w-10 h-10 rounded-xl bg-white text-indigo-600 flex items-center justify-center shadow-sm group-hover/item:scale-110 transition-transform">
                                        <FaEnvelope />
                                    </div>
                                    <div className="text-left overflow-hidden">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                                        <p className="text-sm font-bold text-slate-800 truncate">{profile?.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl group/item">
                                    <div className="w-10 h-10 rounded-xl bg-white text-indigo-600 flex items-center justify-center shadow-sm group-hover/item:scale-110 transition-transform">
                                        <FaPhone />
                                    </div>
                                    <div className="text-left overflow-hidden">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Mobile Number</p>
                                        <p className="text-sm font-bold text-slate-800">{profile?.mobileNumber}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Info Area */}
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                        <div className="absolute -right-10 -bottom-10 text-indigo-500 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                            <FaShieldAlt size={200} />
                        </div>
                        <div className="relative z-10">
                            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-6">Security Context</h4>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-400">Account Type</span>
                                    <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-lg text-[10px] font-black uppercase">System Warden</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-400">Panel Access</span>
                                    <span className="px-3 py-1 bg-slate-800 text-slate-200 rounded-lg text-[10px] font-black uppercase">Full Administrative</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-400">Active Since</span>
                                    <span className="text-xs font-black">{new Date(profile?.createdAt).toLocaleDateString() || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Edit Form */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-[3rem] p-12 shadow-2xl border border-slate-50">
                        <div className="flex items-center justify-between mb-10 border-b border-slate-50 pb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner">
                                    <FaUser size={20} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Personal Identity</h3>
                                    <p className="text-slate-400 text-xs font-bold">Update your public presence</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Full Legal Name</label>
                                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus-within:border-indigo-600 transition-all group">
                                    <FaUser className="text-slate-300 group-focus-within:text-indigo-600 flex-shrink-0" />
                                    <input
                                        type="text"
                                        name="wardenName"
                                        value={formData.wardenName}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-slate-800 disabled:text-slate-500"
                                        placeholder="Enter full name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Primary Mobile</label>
                                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus-within:border-indigo-600 transition-all group">
                                    <FaPhone className="text-slate-300 group-focus-within:text-indigo-600 flex-shrink-0" />
                                    <input
                                        type="text"
                                        name="mobileNumber"
                                        value={formData.mobileNumber}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-slate-800 disabled:text-slate-500"
                                        placeholder="Enter mobile number"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Gender Identification</label>
                                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus-within:border-indigo-600 transition-all group">
                                    <FaVenusMars className="text-slate-300 group-focus-within:text-indigo-600 flex-shrink-0" />
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-slate-800 disabled:text-slate-500"
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Assigned Shift</label>
                                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus-within:border-indigo-600 transition-all group">
                                    <FaClock className="text-slate-300 group-focus-within:text-indigo-600 flex-shrink-0" />
                                    <select
                                        name="shift"
                                        value={formData.shift}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-slate-800 disabled:text-slate-500"
                                    >
                                        <option value="day">Day Shift</option>
                                        <option value="night">Night Shift</option>
                                        <option value="all">Full Rotation (24/7)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[3rem] p-12 shadow-2xl border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-5">
                            <FaBuilding size={100} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-8">Professional Allocation</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-8 bg-indigo-50/50 rounded-3xl border border-indigo-100 group/prof">
                                <div className="w-12 h-12 rounded-2xl bg-white text-indigo-600 flex items-center justify-center shadow-sm mb-4 group-hover/prof:scale-110 transition-transform">
                                    <FaHospital />
                                </div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Managed Facility</p>
                                <p className="text-lg font-black text-indigo-900">{profile?.assignedHostel?.hostelName || 'Premier Residency'}</p>
                                <p className="text-[10px] font-bold text-indigo-400 mt-1 uppercase tracking-widest">Code: {profile?.assignedHostel?.hostelCode || 'H-001'}</p>
                            </div>
                            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 group/prof">
                                <div className="w-12 h-12 rounded-2xl bg-white text-slate-900 flex items-center justify-center shadow-sm mb-4 group-hover/prof:scale-110 transition-transform">
                                    <FaBuilding />
                                </div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Affiliated Branch</p>
                                <p className="text-lg font-black text-slate-900">{profile?.branch?.branchName || 'Main Campus'}</p>
                                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Digital Registry Active</p>
                            </div>
                        </div>
                    </div>

                    {isEditing && (
                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center gap-4 px-12 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-indigo-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all duration-500 scale-105 active:scale-95 group"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                        Syncing Data...
                                    </>
                                ) : (
                                    <>
                                        <FaSave className="group-hover:rotate-12 transition-transform" />
                                        Synchronize Profile
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

export default Profile;
