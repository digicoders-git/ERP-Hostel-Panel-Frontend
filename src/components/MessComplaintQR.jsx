import React, { useState, useEffect } from 'react';
import { FaQrcode, FaCopy, FaLink, FaInfoCircle, FaUtensils, FaMobileAlt, FaPrint, FaShareAlt, FaSpinner, FaGooglePay, FaChevronRight } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { authAPI } from '../services/api';
import qrLogo from '../assets/qr-logo.png';

const MessComplaintQR = () => {
  const [hostelInfo, setHostelInfo] = useState({
    hostelName: localStorage.getItem('hostelName') || "Loading Registry...",
    branchName: localStorage.getItem('branchName') || "Synchronizing Branch..."
  });
  const [fetching, setFetching] = useState(false);

  const complaintLink = "https://hostel-mess-complaint.vercel.app/complaint";
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(complaintLink)}`;
  
  useEffect(() => {
    fetchWardenProfile();
  }, []);

  const fetchWardenProfile = async () => {
    setFetching(true);
    try {
      const response = await authAPI.getProfile();
      if (response.data.success) {
        const profile = response.data.data;
        const newInfo = {
          hostelName: profile.assignedHostel?.hostelName || "Authorized Hostel",
          branchName: profile.branch?.branchName || "Main Campus"
        };
        setHostelInfo(newInfo);
        // Sync local storage
        localStorage.setItem('hostelName', newInfo.hostelName);
        localStorage.setItem('branchName', newInfo.branchName);
      }
    } catch (error) {
      console.error('Error fetching warden profile:', error);
    } finally {
      setFetching(false);
    }
  };

  const { hostelName, branchName } = hostelInfo;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(complaintLink);
    Swal.fire({
      title: 'Digital Link Copied',
      text: 'The grievance portal URL has been copied to your clipboard.',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
      confirmButtonColor: '#6366f1'
    });
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>QR Badge - ${hostelName}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
            body { font-family: 'Inter', sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f8fafc; }
            .badge-card { background: white; border: 1px solid #e2e8f0; padding: 60px; border-radius: 60px; text-align: center; max-width: 480px; box-shadow: 0 40px 100px rgba(0,0,0,0.05); }
            .hostel-tag { background: #f1f5f9; color: #64748b; padding: 8px 16px; border-radius: 20px; font-weight: 900; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px; display: inline-block; }
            h1 { font-size: 48px; font-weight: 900; color: #0f172a; margin: 0 0 5px 0; letter-spacing: -3px; line-height: 0.9; }
            .branch { color: #94a3b8; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 40px; }
            .qr-wrapper { position: relative; background: white; padding: 25px; border-radius: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); border: 2px solid #f8fafc; margin-bottom: 40px; display: inline-block; }
            .qr-image { width: 280px; height: 280px; mix-blend-multiply; }
            .center-logo { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 70px; height: 70px; background: white; border-radius: 18px; box-shadow: 0 8px 20px rgba(0,0,0,0.1); display: flex; items-center: center; justify-content: center; border: 1px solid #f1f5f9; padding: 8px; }
            .center-logo img { width: 100%; height: 100%; object-contain; }
            .footer-info { color: #cbd5e1; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; border-top: 1px solid #f1f5f9; padding-top: 30px; }
          </style>
        </head>
        <body>
          <div class="badge-card">
            <div class="hostel-tag">${hostelName}</div>
            <h1>Dining Access</h1>
            <div class="branch">${branchName}</div>
            
            <div class="qr-wrapper">
               <img src="${qrImageUrl}" class="qr-image" alt="QR" />
               <div class="center-logo">
                  <img src="${qrLogo}" alt="Logo" />
               </div>
            </div>
            
            <div class="footer-info">Official Grievance Portal • Integrated School Management</div>
          </div>
          <script>
            window.onload = () => { 
                setTimeout(() => {
                  window.print(); 
                  window.onafterprint = () => window.close();
                }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Hostel Mess Complaint Portal',
          text: 'Submit your dining hall grievances directly via this official link.',
          url: complaintLink
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="space-y-8 animate-in transition-all pb-12">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Scanner Code</h2>
          <p className="text-slate-500 font-medium tracking-tight">Authorize digital grievance access for dining hall residents.</p>
        </div>
        <div className="bg-slate-900 text-white px-8 py-4 rounded-[2rem] shadow-2xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400">
            <FaQrcode />
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Portal Status</p>
            <p className="text-sm font-black uppercase">Active & Secure</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Google-Style QR Card */}
        <div className="group bg-white rounded-[3.5rem] p-1 shadow-2xl overflow-hidden border border-slate-50 hover:shadow-indigo-500/10 transition-all duration-700">
          <div className="bg-slate-50/50 p-12 text-center rounded-[3.25rem]">
            {/* Branding Header */}
            <div className="flex flex-col items-center gap-3 mb-10">
               {fetching ? (
                  <FaSpinner className="animate-spin text-indigo-600 text-xl" />
               ) : (
                  <>
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-100 rounded-full">
                       <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{hostelName}</span>
                    </div>
                    <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">Dining Access</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">{branchName}</p>
                  </>
               )}
            </div>

            {/* QR Scanner with Central Logo */}
            <div className="relative group/qr mx-auto w-fit mb-12">
               {/* Background Glow */}
               <div className="absolute -inset-8 bg-gradient-to-tr from-indigo-500 via-blue-400 to-purple-400 rounded-full opacity-0 group-hover/qr:opacity-10 transition-all duration-1000 blur-3xl scale-110"></div>
               
               <div className="relative bg-white p-8 rounded-[3rem] shadow-xl border border-white group-hover/qr:border-indigo-50 transition-all duration-500 ease-out">
                  <div className="relative w-64 h-64 flex items-center justify-center">
                     <img
                       src={qrImageUrl}
                       alt="Grievance QR"
                       className="w-full h-full mix-blend-multiply transition-transform duration-1000"
                     />
                     {/* Central Logo Overlay (Google style) */}
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white p-2 rounded-2xl shadow-lg border border-slate-50 flex items-center justify-center group-hover/qr:scale-110 transition-transform duration-500">
                           <img src={qrLogo} alt="Logo" className="w-full h-full object-contain" />
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="flex items-center justify-center gap-4 mb-10">
               {[
                 { icon: FaQrcode, color: 'blue' },
                 { icon: FaChevronRight, isArrow: true },
                 { icon: FaUtensils, color: 'indigo' },
                 { icon: FaChevronRight, isArrow: true },
                 { icon: FaShareAlt, color: 'emerald' }
               ].map((step, i) => (
                 step.isArrow ? (
                   <step.icon key={i} className="text-slate-200 text-xs" />
                 ) : (
                   <div key={i} className={`w-8 h-8 rounded-full bg-${step.color}-50 text-${step.color}-500 flex items-center justify-center text-[10px]`}>
                      <step.icon />
                   </div>
                 )
               ))}
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handlePrint}
                className="flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-indigo-600 hover:scale-105 active:scale-95 transition-all duration-500 group/btn"
              >
                <FaPrint className="group-hover/btn:rotate-12 transition-transform" /> Print Official Badge
              </button>
              <button
                onClick={handleShare}
                className="p-5 bg-white text-slate-400 hover:text-indigo-600 rounded-[2rem] border border-slate-100 hover:border-indigo-100 transition-all shadow-sm"
              >
                <FaShareAlt />
              </button>
            </div>
          </div>
        </div>

        {/* Link Section */}
        <div className="space-y-8">
          <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-2xl">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-8">Direct Access</h3>
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Authorized Portal URL</label>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus-within:border-indigo-600 transition-all group">
                  <FaLink className="text-slate-300 group-focus-within:text-indigo-600 flex-shrink-0" />
                  <input
                    type="text"
                    value={complaintLink}
                    readOnly
                    className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-slate-800"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="p-3 bg-white text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm flex-shrink-0"
                    title="Copy Link"
                  >
                    <FaCopy />
                  </button>
                </div>
              </div>

              <div className="p-8 bg-slate-900 rounded-[2rem] text-white relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-all duration-500">
                  <FaMobileAlt size={120} />
                </div>
                <div className="relative z-10">
                  <h4 className="flex items-center gap-3 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                    Protocol Guidelines
                  </h4>
                  <ul className="space-y-4">
                    {[
                      'Share authenticated link with mess residents',
                      'Mount the QR badge at the Dining Hall entrance',
                      'Monitor feedback via the Audit Ledger',
                      'Ensure high resolution for print visibility'
                    ].map((text, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-indigo-400 mt-0.5 border border-slate-700">{i + 1}</div>
                        <span className="text-xs font-bold text-slate-300 leading-relaxed">{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 rounded-[2.5rem] p-8 border border-amber-100 flex items-start gap-5">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
              <FaInfoCircle size={24} />
            </div>
            <div>
              <h4 className="text-[10px] font-black text-amber-900 uppercase tracking-widest mb-1">Administrative Note</h4>
              <p className="text-xs font-bold text-amber-800 leading-relaxed opacity-70 italic">
                "All complaints submitted via this QR system are digitally signed and logged into the Warden's Audit Ledger in real-time."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessComplaintQR;