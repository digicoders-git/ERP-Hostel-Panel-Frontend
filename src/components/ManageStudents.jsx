import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaEye, FaSearch, FaUserCheck, FaUserTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    const savedStudents = JSON.parse(localStorage.getItem('students') || '[]');
    setStudents(savedStudents);
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || student.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (studentId, newStatus) => {
    const updatedStudents = students.map(student =>
      student.id === studentId ? { ...student, status: newStatus } : student
    );
    setStudents(updatedStudents);
    localStorage.setItem('students', JSON.stringify(updatedStudents));
    
    Swal.fire({
      title: 'Success!',
      text: `Student status updated to ${newStatus}`,
      icon: 'success',
      timer: 1500
    });
  };

  const handleDelete = (studentId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete!'
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedStudents = students.filter(student => student.id !== studentId);
        setStudents(updatedStudents);
        localStorage.setItem('students', JSON.stringify(updatedStudents));
        
        Swal.fire('Deleted!', 'Student has been removed.', 'success');
      }
    });
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Manage Students</h2>
          <div className="text-sm text-gray-600">
            Total Students: {students.length}
          </div>
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
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Roll No</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Course</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Year</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Phone</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{student.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{student.rollNumber}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{student.course}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{student.year}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{student.phone}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      student.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusChange(
                          student.id, 
                          student.status === 'Active' ? 'Inactive' : 'Active'
                        )}
                        className={`p-2 rounded-lg text-white ${
                          student.status === 'Active' 
                            ? 'bg-red-500 hover:bg-red-600' 
                            : 'bg-green-500 hover:bg-green-600'
                        }`}
                        title={student.status === 'Active' ? 'Deactivate' : 'Activate'}
                      >
                        {student.status === 'Active' ? <FaUserTimes /> : <FaUserCheck />}
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredStudents.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No students found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageStudents;