import React, { useState, useEffect } from 'react';
import { FaQuestionCircle } from 'react-icons/fa';

const ComplaintsManagement = () => {
  const [complaintsData, setComplaintsData] = useState([]);

  useEffect(() => {
    const savedData = localStorage.getItem('messData');
    if (savedData) {
      const data = JSON.parse(savedData);
      setComplaintsData(data.complaints || []);
    } else {
      const defaultComplaints = [
        { id: 1, studentName: 'Amit Sharma', complaint: 'Food quality issue', date: '2024-01-15', status: 'pending' },
        { id: 2, studentName: 'Neha Gupta', complaint: 'Late dinner service', date: '2024-01-14', status: 'resolved' }
      ];
      setComplaintsData(defaultComplaints);
      const messData = { complaints: defaultComplaints };
      localStorage.setItem('messData', JSON.stringify(messData));
    }
  }, []);

  const handleStatusChange = (id, newStatus) => {
    const newData = complaintsData.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    );
    setComplaintsData(newData);
    const messData = JSON.parse(localStorage.getItem('messData') || '{}');
    messData.complaints = newData;
    localStorage.setItem('messData', JSON.stringify(messData));
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <FaQuestionCircle className="text-2xl text-blue-600 mr-3" />
        <h1 className="text-2xl font-bold">Complaints Management</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Complaint</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {complaintsData.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.studentName}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">{item.complaint}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                      className={`px-2 py-1 rounded-full text-xs border-0 ${item.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComplaintsManagement;