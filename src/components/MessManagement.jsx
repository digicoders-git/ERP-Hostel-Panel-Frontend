import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaUtensils } from 'react-icons/fa';
import Swal from 'sweetalert2';

const MessManagement = () => {
  const [messData, setMessData] = useState({
    menu: [],
    attendance: [],
    complaints: []
  });
  const [activeTab, setActiveTab] = useState('menu');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    day: '',
    breakfast: '',
    lunch: '',
    dinner: '',
    studentName: '',
    present: true,
    complaint: '',
    status: 'pending'
  });

  useEffect(() => {
    const savedData = localStorage.getItem('messData');
    if (savedData) {
      setMessData(JSON.parse(savedData));
    } else {
      const defaultData = {
        menu: [
          { id: 1, day: 'Monday', breakfast: 'Paratha, Curd', lunch: 'Rice, Dal, Sabzi', dinner: 'Roti, Paneer' },
          { id: 2, day: 'Tuesday', breakfast: 'Poha, Tea', lunch: 'Rice, Rajma, Salad', dinner: 'Roti, Chicken' }
        ],
        attendance: [
          { id: 1, studentName: 'Rahul Kumar', date: '2024-01-15', breakfast: true, lunch: true, dinner: false },
          { id: 2, studentName: 'Priya Singh', date: '2024-01-15', breakfast: true, lunch: false, dinner: true }
        ],
        complaints: [
          { id: 1, studentName: 'Amit Sharma', complaint: 'Food quality issue', date: '2024-01-15', status: 'pending' },
          { id: 2, studentName: 'Neha Gupta', complaint: 'Late dinner service', date: '2024-01-14', status: 'resolved' }
        ]
      };
      setMessData(defaultData);
      localStorage.setItem('messData', JSON.stringify(defaultData));
    }
  }, []);

  const saveToStorage = (newData) => {
    setMessData(newData);
    localStorage.setItem('messData', JSON.stringify(newData));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newData = { ...messData };
    
    if (activeTab === 'menu') {
      const menuItem = {
        id: editingItem ? editingItem.id : Date.now(),
        day: formData.day,
        breakfast: formData.breakfast,
        lunch: formData.lunch,
        dinner: formData.dinner
      };
      
      if (editingItem) {
        const index = newData.menu.findIndex(item => item.id === editingItem.id);
        newData.menu[index] = menuItem;
      } else {
        newData.menu.push(menuItem);
      }
    } else if (activeTab === 'attendance') {
      const attendanceItem = {
        id: editingItem ? editingItem.id : Date.now(),
        studentName: formData.studentName,
        date: new Date().toISOString().split('T')[0],
        breakfast: formData.breakfast === 'true',
        lunch: formData.lunch === 'true',
        dinner: formData.dinner === 'true'
      };
      
      if (editingItem) {
        const index = newData.attendance.findIndex(item => item.id === editingItem.id);
        newData.attendance[index] = attendanceItem;
      } else {
        newData.attendance.push(attendanceItem);
      }
    } else if (activeTab === 'complaints') {
      const complaintItem = {
        id: editingItem ? editingItem.id : Date.now(),
        studentName: formData.studentName,
        complaint: formData.complaint,
        date: new Date().toISOString().split('T')[0],
        status: formData.status
      };
      
      if (editingItem) {
        const index = newData.complaints.findIndex(item => item.id === editingItem.id);
        newData.complaints[index] = complaintItem;
      } else {
        newData.complaints.push(complaintItem);
      }
    }
    
    saveToStorage(newData);
    resetForm();
    Swal.fire('Success!', `${activeTab} ${editingItem ? 'updated' : 'added'} successfully!`, 'success');
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    if (activeTab === 'menu') {
      setFormData({
        day: item.day,
        breakfast: item.breakfast,
        lunch: item.lunch,
        dinner: item.dinner
      });
    } else if (activeTab === 'attendance') {
      setFormData({
        studentName: item.studentName,
        breakfast: item.breakfast.toString(),
        lunch: item.lunch.toString(),
        dinner: item.dinner.toString()
      });
    } else if (activeTab === 'complaints') {
      setFormData({
        studentName: item.studentName,
        complaint: item.complaint,
        status: item.status
      });
    }
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const newData = { ...messData };
        newData[activeTab] = newData[activeTab].filter(item => item.id !== id);
        saveToStorage(newData);
        Swal.fire('Deleted!', 'Item has been deleted.', 'success');
      }
    });
  };

  const resetForm = () => {
    setFormData({
      day: '',
      breakfast: '',
      lunch: '',
      dinner: '',
      studentName: '',
      present: true,
      complaint: '',
      status: 'pending'
    });
    setEditingItem(null);
    setShowAddForm(false);
  };

  const renderMenuForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Day</label>
        <select
          name="day"
          value={formData.day}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-lg"
          required
        >
          <option value="">Select Day</option>
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Breakfast</label>
        <input
          type="text"
          name="breakfast"
          value={formData.breakfast}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-lg"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Lunch</label>
        <input
          type="text"
          name="lunch"
          value={formData.lunch}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-lg"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Dinner</label>
        <input
          type="text"
          name="dinner"
          value={formData.dinner}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-lg"
          required
        />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          {editingItem ? 'Update' : 'Add'} Menu
        </button>
        <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
          Cancel
        </button>
      </div>
    </form>
  );

  const renderAttendanceForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Student Name</label>
        <input
          type="text"
          name="studentName"
          value={formData.studentName}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-lg"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Breakfast</label>
        <select
          name="breakfast"
          value={formData.breakfast}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-lg"
        >
          <option value="true">Present</option>
          <option value="false">Absent</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Lunch</label>
        <select
          name="lunch"
          value={formData.lunch}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-lg"
        >
          <option value="true">Present</option>
          <option value="false">Absent</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Dinner</label>
        <select
          name="dinner"
          value={formData.dinner}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-lg"
        >
          <option value="true">Present</option>
          <option value="false">Absent</option>
        </select>
      </div>
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          {editingItem ? 'Update' : 'Add'} Attendance
        </button>
        <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
          Cancel
        </button>
      </div>
    </form>
  );

  const renderComplaintForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Student Name</label>
        <input
          type="text"
          name="studentName"
          value={formData.studentName}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-lg"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Complaint</label>
        <textarea
          name="complaint"
          value={formData.complaint}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-lg"
          rows="3"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-lg"
        >
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          {editingItem ? 'Update' : 'Add'} Complaint
        </button>
        <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
          Cancel
        </button>
      </div>
    </form>
  );

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <FaUtensils className="text-2xl text-blue-600 mr-3" />
        <h1 className="text-2xl font-bold">Mess Management</h1>
      </div>

      <div className="flex space-x-1 mb-6">
        {['menu', 'attendance', 'complaints'].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              resetForm();
            }}
            className={`px-4 py-2 rounded-lg capitalize ${
              activeTab === tab
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center"
        >
          <FaPlus className="mr-2" />
          Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingItem ? 'Edit' : 'Add'} {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h3>
          {activeTab === 'menu' && renderMenuForm()}
          {activeTab === 'attendance' && renderAttendanceForm()}
          {activeTab === 'complaints' && renderComplaintForm()}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {activeTab === 'menu' && (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Day</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Breakfast</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lunch</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dinner</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </>
                )}
                {activeTab === 'attendance' && (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Breakfast</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lunch</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dinner</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </>
                )}
                {activeTab === 'complaints' && (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Complaint</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {messData[activeTab].map((item) => (
                <tr key={item.id}>
                  {activeTab === 'menu' && (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.day}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.breakfast}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.lunch}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.dinner}</td>
                    </>
                  )}
                  {activeTab === 'attendance' && (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.studentName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded-full text-xs ${item.breakfast ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {item.breakfast ? 'Present' : 'Absent'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded-full text-xs ${item.lunch ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {item.lunch ? 'Present' : 'Absent'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded-full text-xs ${item.dinner ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {item.dinner ? 'Present' : 'Absent'}
                        </span>
                      </td>
                    </>
                  )}
                  {activeTab === 'complaints' && (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.studentName}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{item.complaint}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded-full text-xs ${item.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {item.status}
                        </span>
                      </td>
                    </>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash />
                    </button>
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

export default MessManagement;