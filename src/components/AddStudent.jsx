import { useState } from 'react';
import { FaUser, FaPhone, FaEnvelope, FaIdCard, FaHome, FaSave, FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';

const AddStudent = () => {
  const [student, setStudent] = useState({
    name: '',
    rollNumber: '',
    email: '',
    phone: '',
    address: '',
    parentName: '',
    parentPhone: '',
    course: '',
    year: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save to localStorage
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const newStudent = {
      ...student,
      id: Date.now(),
      joinDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    };
    students.push(newStudent);
    localStorage.setItem('students', JSON.stringify(students));
    
    Swal.fire({
      title: 'Success!',
      text: 'Student added successfully',
      icon: 'success',
      timer: 1500
    });
    
    setStudent({
      name: '',
      rollNumber: '',
      email: '',
      phone: '',
      address: '',
      parentName: '',
      parentPhone: '',
      course: '',
      year: ''
    });
  };

  const handleChange = (e) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Student</h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaUser className="inline mr-2" />
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={student.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaIdCard className="inline mr-2" />
              Roll Number
            </label>
            <input
              type="text"
              name="rollNumber"
              value={student.rollNumber}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaEnvelope className="inline mr-2" />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={student.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaPhone className="inline mr-2" />
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={student.phone}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaHome className="inline mr-2" />
              Address
            </label>
            <textarea
              name="address"
              value={student.address}
              onChange={handleChange}
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Parent Name
            </label>
            <input
              type="text"
              name="parentName"
              value={student.parentName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Parent Phone
            </label>
            <input
              type="tel"
              name="parentPhone"
              value={student.parentPhone}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course
            </label>
            <select
              name="course"
              value={student.course}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Course</option>
              <option value="B.Tech">B.Tech</option>
              <option value="M.Tech">M.Tech</option>
              <option value="BCA">BCA</option>
              <option value="MCA">MCA</option>
              <option value="MBA">MBA</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year
            </label>
            <select
              name="year"
              value={student.year}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Year</option>
              <option value="1st">1st Year</option>
              <option value="2nd">2nd Year</option>
              <option value="3rd">3rd Year</option>
              <option value="4th">4th Year</option>
            </select>
          </div>

          <div className="md:col-span-2 flex gap-4">
            <button
              type="submit"
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaSave className="mr-2" />
              Add Student
            </button>
            <button
              type="button"
              onClick={() => setStudent({
                name: '',
                rollNumber: '',
                email: '',
                phone: '',
                address: '',
                parentName: '',
                parentPhone: '',
                course: '',
                year: ''
              })}
              className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FaTimes className="mr-2" />
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudent;