import { useState, useEffect } from 'react';
import { FaSignInAlt, FaSignOutAlt, FaSearch, FaClock, FaCalendarAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';

const CheckInOut = () => {
  const [students, setStudents] = useState([]);
  const [checkInOutRecords, setCheckInOutRecords] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [actionType, setActionType] = useState('checkin');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const savedStudents = JSON.parse(localStorage.getItem('students') || '[]');
    const savedRecords = JSON.parse(localStorage.getItem('checkInOutRecords') || '[]');
    
    setStudents(savedStudents);
    setCheckInOutRecords(savedRecords);
  }, []);

  const handleCheckInOut = () => {
    if (!selectedStudent) {
      Swal.fire('Error', 'Please select a student', 'error');
      return;
    }

    const student = students.find(s => s.id === parseInt(selectedStudent));
    const now = new Date();
    
    const record = {
      id: Date.now(),
      studentId: student.id,
      studentName: student.name,
      rollNumber: student.rollNumber,
      phone: student.phone,
      action: actionType,
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().split(' ')[0],
      timestamp: now.toISOString()
    };

    const updatedRecords = [record, ...checkInOutRecords];
    setCheckInOutRecords(updatedRecords);
    localStorage.setItem('checkInOutRecords', JSON.stringify(updatedRecords));

    Swal.fire({
      title: 'Success!',
      text: `Student ${actionType === 'checkin' ? 'checked in' : 'checked out'} successfully`,
      icon: 'success',
      timer: 1500
    });

    setSelectedStudent('');
  };

  const getStudentStatus = (studentId) => {
    const studentRecords = checkInOutRecords
      .filter(record => record.studentId === studentId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    if (studentRecords.length === 0) return 'Unknown';
    return studentRecords[0].action === 'checkin' ? 'In Hostel' : 'Out of Hostel';
  };

  const filteredRecords = checkInOutRecords.filter(record => {
    const matchesSearch = record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = record.date === filterDate;
    return matchesSearch && matchesDate;
  });

  const getTodayStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = checkInOutRecords.filter(record => record.date === today);
    
    const checkIns = todayRecords.filter(record => record.action === 'checkin').length;
    const checkOuts = todayRecords.filter(record => record.action === 'checkout').length;
    
    return { checkIns, checkOuts };
  };

  const stats = getTodayStats();

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Check In/Out Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Student Check In/Out</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Student
              </label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a student...</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.name} ({student.rollNumber})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Action
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="checkin"
                    checked={actionType === 'checkin'}
                    onChange={(e) => setActionType(e.target.value)}
                    className="mr-2"
                  />
                  <FaSignInAlt className="mr-1 text-green-600" />
                  Check In
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="checkout"
                    checked={actionType === 'checkout'}
                    onChange={(e) => setActionType(e.target.value)}
                    className="mr-2"
                  />
                  <FaSignOutAlt className="mr-1 text-red-600" />
                  Check Out
                </label>
              </div>
            </div>

            <button
              onClick={handleCheckInOut}
              className={`w-full flex items-center justify-center px-6 py-3 text-white rounded-lg transition-colors ${
                actionType === 'checkin' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {actionType === 'checkin' ? <FaSignInAlt className="mr-2" /> : <FaSignOutAlt className="mr-2" />}
              {actionType === 'checkin' ? 'Check In' : 'Check Out'}
            </button>
          </div>

          {/* Today's Stats */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Today's Summary</h3>
            <div className="flex justify-between text-sm">
              <span className="text-green-600">Check Ins: {stats.checkIns}</span>
              <span className="text-red-600">Check Outs: {stats.checkOuts}</span>
            </div>
          </div>
        </div>

        {/* Student Status */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Current Status</h3>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {students.map(student => {
              const status = getStudentStatus(student.id);
              return (
                <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <p className="text-sm text-gray-600">{student.rollNumber}</p>
                    <p className="text-sm text-gray-500">{student.phone}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    status === 'In Hostel' 
                      ? 'bg-green-100 text-green-800' 
                      : status === 'Out of Hostel'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Records */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Recent Activity</h3>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {checkInOutRecords.slice(0, 10).map(record => (
              <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{record.studentName}</p>
                  <p className="text-sm text-gray-600">{record.date} at {record.time}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  record.action === 'checkin' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {record.action === 'checkin' ? 'Check In' : 'Check Out'}
                </span>
              </div>
            ))}
            
            {checkInOutRecords.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No records found.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Records */}
      <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Detailed Records</h3>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Student</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Roll No</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Phone</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Action</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{record.studentName}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{record.rollNumber}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{record.phone}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      record.action === 'checkin' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {record.action === 'checkin' ? 'Check In' : 'Check Out'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{record.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{record.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredRecords.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No records found for the selected date.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckInOut;