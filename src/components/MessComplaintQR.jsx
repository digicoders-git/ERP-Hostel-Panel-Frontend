import React from 'react';
import { FaQrcode, FaCopy } from 'react-icons/fa';
import Swal from 'sweetalert2';

const MessComplaintQR = () => {
  const complaintLink = "https://hostel-mess-complaint.vercel.app/complaint";
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(complaintLink);
    Swal.fire({
      title: 'Copied!',
      text: 'Complaint link copied to clipboard',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <FaQrcode className="text-2xl text-blue-600 mr-3" />
        <h1 className="text-2xl font-bold">Mess Complaint QR & Link</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h3 className="text-lg font-semibold mb-4">QR Code for Complaints</h3>
          <div className="bg-gray-100 p-8 rounded-lg mb-4 flex items-center justify-center">
            <div className="w-48 h-48 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <FaQrcode className="text-6xl text-gray-400 mb-2 mx-auto" />
                <p className="text-sm text-gray-500">QR Code</p>
                <p className="text-xs text-gray-400">Scan to submit complaint</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600">Students can scan this QR code to submit mess complaints</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Direct Link</h3>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Complaint Form Link:
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={complaintLink}
                  readOnly
                  className="flex-1 p-2 border border-gray-300 rounded-lg bg-white text-sm"
                />
                <button
                  onClick={copyToClipboard}
                  className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                  title="Copy Link"
                >
                  <FaCopy />
                </button>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Instructions:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Share this link with students</li>
                <li>• Students can submit complaints directly</li>
                <li>• Print QR code and display in mess hall</li>
                <li>• All complaints appear in Complaints section</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessComplaintQR;