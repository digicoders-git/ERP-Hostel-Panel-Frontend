import React, { useState, useEffect } from 'react';
import { FaClipboardCheck } from 'react-icons/fa';

const MessAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    const savedData = localStorage.getItem('messData');
    if (savedData) {
      const data = JSON.parse(savedData);
      setAttendanceData(data.attendance || []);
    } else {
      const defaultAttendance = [
        { id: 1, studentName: 'Rahul Kumar', date: '2024-01-15', breakfast: true, lunch: true, dinner: false },
        { id: 2, studentName: 'Priya Singh', date: '2024-01-15', breakfast: true, lunch: false, dinner: true }
      ];
      setAttendanceData(defaultAttendance);
      const messData = { attendance: defaultAttendance };
      localStorage.setItem('messData', JSON.stringify(messData));
    }
  }, []);

  const handleAttendanceChange = (id, mealType, status) => {
    const newData = attendanceData.map(item => 
      item.id === id ? { ...item, [mealType]: status === 'present' } : item
    );
    setAttendanceData(newData);
    const messData = JSON.parse(localStorage.getItem('messData') || '{}');
    messData.attendance = newData;
    localStorage.setItem('messData', JSON.stringify(messData));
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <FaClipboardCheck className="text-2xl text-blue-600 mr-3" />
        <h1 className="text-2xl font-bold">Mess Attendance</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Breakfast</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lunch</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dinner</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendanceData.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.studentName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <select
                      value={item.breakfast ? 'present' : 'absent'}
                      onChange={(e) => handleAttendanceChange(item.id, 'breakfast', e.target.value)}
                      className={`px-2 py-1 rounded-full text-xs border-0 ${item.breakfast ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <select
                      value={item.lunch ? 'present' : 'absent'}
                      onChange={(e) => handleAttendanceChange(item.id, 'lunch', e.target.value)}
                      className={`px-2 py-1 rounded-full text-xs border-0 ${item.lunch ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <select
                      value={item.dinner ? 'present' : 'absent'}
                      onChange={(e) => handleAttendanceChange(item.id, 'dinner', e.target.value)}
                      className={`px-2 py-1 rounded-full text-xs border-0 ${item.dinner ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
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

export default MessAttendance;