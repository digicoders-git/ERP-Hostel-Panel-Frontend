import { useState, useEffect } from 'react';
import { FaCalendarAlt, FaClipboardCheck, FaSave, FaSearch } from 'react-icons/fa';
import Swal from 'sweetalert2';

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceType, setAttendanceType] = useState('morning');
  const [attendance, setAttendance] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const savedStudents = JSON.parse(localStorage.getItem('students') || '[]');
    setStudents(savedStudents);
    loadAttendance();
  }, [selectedDate, attendanceType]);

  const loadAttendance = () => {
    const attendanceKey = `attendance_${selectedDate}_${attendanceType}`;
    const savedAttendance = JSON.parse(localStorage.getItem(attendanceKey) || '{}');
    setAttendance(savedAttendance);
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const saveAttendance = () => {
    const attendanceKey = `attendance_${selectedDate}_${attendanceType}`;
    localStorage.setItem(attendanceKey, JSON.stringify(attendance));
    
    Swal.fire({
      title: 'Success!',
      text: `${attendanceType.charAt(0).toUpperCase() + attendanceType.slice(1)} attendance saved for ${selectedDate}`,
      icon: 'success',
      timer: 1500
    });
  };

  const markAllPresent = () => {
    const allPresent = {};
    filteredStudents.forEach(student => {
      allPresent[student.id] = 'present';
    });
    setAttendance(allPresent);
  };

  const markAllAbsent = () => {
    const allAbsent = {};
    filteredStudents.forEach(student => {
      allAbsent[student.id] = 'absent';
    });
    setAttendance(allAbsent);
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAttendanceStats = () => {
    const present = Object.values(attendance).filter(status => status === 'present').length;
    const absent = Object.values(attendance).filter(status => status === 'absent').length;
    const total = filteredStudents.length;
    return { present, absent, total };
  };

  const stats = getAttendanceStats();

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Student Attendance</h2>
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <span className="text-green-600 font-semibold">Present: {stats.present}</span>
              <span className="text-red-600 font-semibold ml-4">Absent: {stats.absent}</span>
              <span className="text-gray-600 font-semibold ml-4">Total: {stats.total}</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaCalendarAlt className="inline mr-2" />
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attendance Type
            </label>
            <select
              value={attendanceType}
              onChange={(e) => setAttendanceType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="morning">Morning</option>
              <option value="evening">Evening</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Actions
            </label>
            <div className="flex space-x-2">
              <button
                onClick={markAllPresent}
                className="px-3 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600"
              >
                All Present
              </button>
              <button
                onClick={markAllAbsent}
                className="px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600"
              >
                All Absent
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Save Attendance
            </label>
            <button
              onClick={saveAttendance}
              className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <FaSave className="mr-2" />
              Save
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Attendance List */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Roll No</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Course</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Present</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Absent</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{student.rollNumber}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{student.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{student.course} - {student.year}</td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="radio"
                      name={`attendance_${student.id}`}
                      checked={attendance[student.id] === 'present'}
                      onChange={() => handleAttendanceChange(student.id, 'present')}
                      className="w-4 h-4 text-green-600 focus:ring-green-500"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="radio"
                      name={`attendance_${student.id}`}
                      checked={attendance[student.id] === 'absent'}
                      onChange={() => handleAttendanceChange(student.id, 'absent')}
                      className="w-4 h-4 text-red-600 focus:ring-red-500"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredStudents.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No students found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;