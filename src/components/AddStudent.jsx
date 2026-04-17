import { useState } from 'react';
import { 
  FaUser, FaPhone, FaEnvelope, FaIdCard, FaHome, 
  FaSave, FaTimes, FaGraduationCap, FaCalendarAlt,
  FaUserShield, FaMapMarkerAlt, FaSpinner, FaCheckCircle
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import { hostelStudentAPI } from '../services/api';

const EMPTY_STUDENT = {
  name: '',
  rollNumber: '',
  email: '',
  phone: '',
  address: '',
  parentName: '',
  parentPhone: '',
  course: '',
  year: ''
};

const AddStudent = () => {
  const [student, setStudent] = useState(EMPTY_STUDENT);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await hostelStudentAPI.create({
        ...student,
        joinDate: new Date().toISOString().split('T')[0],
        status: 'Active'
      });
      
      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Resident Registered',
          text: `${student.name} has been added to the official hostel ledger.`,
          confirmButtonColor: '#6366f1'
        });
        setStudent(EMPTY_STUDENT);
      }
    } catch (error) {
      console.error('Error adding student:', error);
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: 'Ensure the Roll Number is unique and all fields are valid.',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-8 animate-in transition-all pb-12">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Resident Intake</h2>
          <p className="text-slate-500 font-medium tracking-tight">Register new students into the official hostel administration system.</p>
        </div>
        <div className="bg-slate-900 text-white px-8 py-4 rounded-[2rem] shadow-2xl flex items-center gap-4">
           <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400">
              <FaIdCard />
           </div>
           <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">System Ready</p>
              <p className="text-sm font-black uppercase">Admission Ledger v3.0</p>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-2xl max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
           <div className="w-14 h-14 rounded-3xl bg-indigo-600 text-white flex items-center justify-center text-2xl shadow-xl shadow-indigo-100">
              <FaUser />
           </div>
           <div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">Profile Configuration</h3>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Configure academic and personal resident data</p>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Section: Identity */}
          <div className="space-y-6">
             <h4 className="flex items-center gap-3 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">
                <div className="w-6 h-px bg-slate-100"></div>
                Primary Identity
             </h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Legal Full Name</label>
                 <div className="relative group">
                   <FaUser className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                   <input
                     type="text"
                     name="name"
                     value={student.name}
                     onChange={handleChange}
                     className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                     placeholder="As per official documents"
                     required
                   />
                 </div>
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">System Roll Number</label>
                 <div className="relative group">
                   <FaIdCard className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                   <input
                     type="text"
                     name="rollNumber"
                     value={student.rollNumber}
                     onChange={handleChange}
                     className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                     placeholder="Unique ID"
                     required
                   />
                 </div>
               </div>
             </div>
          </div>

          {/* Section: Academic */}
          <div className="space-y-6">
             <h4 className="flex items-center gap-3 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">
                <div className="w-6 h-px bg-slate-100"></div>
                Academic Enrollment
             </h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Course / Programme</label>
                 <div className="relative group">
                   <FaGraduationCap className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                   <select
                     name="course"
                     value={student.course}
                     onChange={handleChange}
                     className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-slate-900 outline-none transition-all appearance-none"
                     required
                   >
                     <option value="">Choose Course...</option>
                     <option value="B.Tech">Bachelor of Technology</option>
                     <option value="M.Tech">Master of Technology</option>
                     <option value="BCA">Bachelor of Computer Apps</option>
                     <option value="MCA">Master of Computer Apps</option>
                     <option value="MBA">Management (MBA)</option>
                   </select>
                 </div>
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Current Year</label>
                 <div className="relative group">
                   <FaCalendarAlt className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                   <select
                     name="year"
                     value={student.year}
                     onChange={handleChange}
                     className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-slate-900 outline-none transition-all appearance-none"
                     required
                   >
                     <option value="">Enrollment Year...</option>
                     <option value="1st">1st Year (Freshman)</option>
                     <option value="2nd">2nd Year (Sophomore)</option>
                     <option value="3rd">3rd Year (Junior)</option>
                     <option value="4th">4th Year (Senior)</option>
                   </select>
                 </div>
               </div>
             </div>
          </div>

          {/* Section: Contact */}
          <div className="space-y-6">
             <h4 className="flex items-center gap-3 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">
                <div className="w-6 h-px bg-slate-100"></div>
                Contact Communication
             </h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Email Address</label>
                 <div className="relative group">
                   <FaEnvelope className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                   <input
                     type="email"
                     name="email"
                     value={student.email}
                     onChange={handleChange}
                     className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                     placeholder="institutional@verify.id"
                     required
                   />
                 </div>
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Mobile Contact</label>
                 <div className="relative group">
                   <FaPhone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                   <input
                     type="tel"
                     name="phone"
                     value={student.phone}
                     onChange={handleChange}
                     className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                     placeholder="+91 XXXXX XXXXX"
                     required
                   />
                 </div>
               </div>
               <div className="md:col-span-2 space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Permanent Residence Address</label>
                 <div className="relative group">
                   <FaMapMarkerAlt className="absolute left-6 top-6 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                   <textarea
                     name="address"
                     value={student.address}
                     onChange={handleChange}
                     rows="3"
                     className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-[1.5rem] text-sm font-bold text-slate-800 focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                     placeholder="Complete residential details for local police verification..."
                     required
                   />
                 </div>
               </div>
             </div>
          </div>

          {/* Section: Guardian */}
          <div className="space-y-6">
             <h4 className="flex items-center gap-3 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">
                <div className="w-6 h-px bg-slate-100"></div>
                Guardian / Parent Node
             </h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Parent / Legal Guardian Name</label>
                 <div className="relative group">
                   <FaUserShield className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                   <input
                     type="text"
                     name="parentName"
                     value={student.parentName}
                     onChange={handleChange}
                     className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                     placeholder="Father / Mother Name"
                     required
                   />
                 </div>
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Emergency Hotline</label>
                 <div className="relative group">
                   <FaPhone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                   <input
                     type="tel"
                     name="parentPhone"
                     value={student.parentPhone}
                     onChange={handleChange}
                     className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                     placeholder="Primary Guardian Mobile"
                     required
                   />
                 </div>
               </div>
             </div>
          </div>

          {/* Form Actions */}
          <div className="pt-12 border-t border-slate-100 flex gap-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-3 py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-100 hover:bg-black transition-all hover:-translate-y-1 disabled:bg-slate-400 disabled:shadow-none disabled:translate-y-0"
            >
              {isSubmitting ? <FaSpinner className="animate-spin text-lg" /> : <FaCheckCircle className="text-lg" />}
              {isSubmitting ? 'Syncing Profile Ledger...' : 'Authorize Resident Registration'}
            </button>
            <button
              type="button"
              onClick={() => setStudent(EMPTY_STUDENT)}
              className="px-12 py-6 bg-slate-100 text-slate-600 rounded-[2.2rem] font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all font-bold"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudent;