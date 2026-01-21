import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaUtensils } from 'react-icons/fa';
import Swal from 'sweetalert2';

const MenuManagement = () => {
  const [menuData, setMenuData] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    day: '',
    breakfast: '',
    lunch: '',
    dinner: ''
  });

  useEffect(() => {
    const savedData = localStorage.getItem('messData');
    if (savedData) {
      const data = JSON.parse(savedData);
      setMenuData(data.menu || []);
    } else {
      const defaultMenu = [
        { id: 1, day: 'Monday', breakfast: 'Paratha, Curd', lunch: 'Rice, Dal, Sabzi', dinner: 'Roti, Paneer' },
        { id: 2, day: 'Tuesday', breakfast: 'Poha, Tea', lunch: 'Rice, Rajma, Salad', dinner: 'Roti, Chicken' }
      ];
      setMenuData(defaultMenu);
      saveToStorage(defaultMenu);
    }
  }, []);

  const saveToStorage = (newData) => {
    const messData = JSON.parse(localStorage.getItem('messData') || '{}');
    messData.menu = newData;
    localStorage.setItem('messData', JSON.stringify(messData));
    setMenuData(newData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const menuItem = {
      id: editingItem ? editingItem.id : Date.now(),
      day: formData.day,
      breakfast: formData.breakfast,
      lunch: formData.lunch,
      dinner: formData.dinner
    };
    
    let newData;
    if (editingItem) {
      newData = menuData.map(item => item.id === editingItem.id ? menuItem : item);
    } else {
      newData = [...menuData, menuItem];
    }
    
    saveToStorage(newData);
    resetForm();
    Swal.fire('Success!', `Menu ${editingItem ? 'updated' : 'added'} successfully!`, 'success');
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      day: item.day,
      breakfast: item.breakfast,
      lunch: item.lunch,
      dinner: item.dinner
    });
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
        const newData = menuData.filter(item => item.id !== id);
        saveToStorage(newData);
        Swal.fire('Deleted!', 'Menu item has been deleted.', 'success');
      }
    });
  };

  const resetForm = () => {
    setFormData({ day: '', breakfast: '', lunch: '', dinner: '' });
    setEditingItem(null);
    setShowAddForm(false);
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <FaUtensils className="text-2xl text-blue-600 mr-3" />
        <h1 className="text-2xl font-bold">Menu Management</h1>
      </div>

      <div className="mb-4">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center"
        >
          <FaPlus className="mr-2" />
          Add Menu Item
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingItem ? 'Edit' : 'Add'} Menu
          </h3>
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
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Day</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Breakfast</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lunch</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dinner</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {menuData.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.day}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.breakfast}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.lunch}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.dinner}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-900 mr-3">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900">
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

export default MenuManagement;