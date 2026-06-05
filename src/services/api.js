import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://erp-backend-0ab5.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Bed Allocation APIs
export const bedAllocationAPI = {
  getAll: (params) => api.get('/api/warden-panel/bed-allocation/all', { params }),
  allocate: (data) => api.post('/api/warden-panel/bed-allocation/allocate', data),
  deallocate: (id) => api.patch(`/api/warden-panel/bed-allocation/deallocate/${id}`),
  getByStudent: (studentId) => api.get(`/api/warden-panel/bed-allocation/student/${studentId}`),
  getStats: () => api.get('/api/warden-panel/bed-allocation/stats')
};

// Hostel Students APIs
export const hostelStudentAPI = {
  getAll: (params) => api.get('/api/warden-panel/students/all', { params }),
  getById: (id) => api.get(`/api/warden-panel/students/${id}`),
  create: (data) => api.post('/api/warden-panel/students/create', data),
  update: (id, data) => api.put(`/api/warden-panel/students/${id}`, data),
  toggleStatus: (id) => api.patch(`/api/warden-panel/students/toggle-status/${id}`),
  remove: (id) => api.delete(`/api/warden-panel/students/${id}`),
  getStats: () => api.get('/api/warden-panel/students/stats')
};

// Room APIs
export const roomAPI = {
  getAll: (params) => api.get('/api/room/all', { params }),
  getById: (id) => api.get(`/api/room/${id}`),
  updateStatus: (id, status) => api.patch(`/api/room/update-status/${id}`, { status })
};

// Hostel Attendance APIs
export const hostelAttendanceAPI = {
  getAll: (params) => api.get('/api/warden-panel/attendance/all', { params }),
  mark: (data) => api.post('/api/warden-panel/attendance/mark', data),
  getByDate: (date) => api.get(`/api/warden-panel/attendance/date/${date}`),
  getStats: () => api.get('/api/warden-panel/attendance/stats')
};

// Mess Attendance APIs
export const messAttendanceAPI = {
  getAll: (params) => api.get('/api/warden-panel/mess-attendance/all', { params }),
  mark: (data) => api.post('/api/warden-panel/mess-attendance/mark', data),
  getByDate: (date) => api.get(`/api/warden-panel/mess-attendance/date/${date}`)
};

// Hostel Menu APIs
export const hostelMenuAPI = {
  getAll: (params) => api.get('/api/warden-panel/hostel-menu/all', { params }),
  create: (data) => api.post('/api/warden-panel/hostel-menu/add', data),
  update: (id, data) => api.put(`/api/warden-panel/hostel-menu/${id}`, data),
  remove: (id) => api.delete(`/api/warden-panel/hostel-menu/${id}`)
};

// Mess Management APIs
export const messManagementAPI = {
  getAll: (params) => api.get('/api/warden-panel/mess/all', { params }),
  create: (data) => api.post('/api/warden-panel/mess/create', data),
  update: (id, data) => api.put(`/api/warden-panel/mess/${id}`, data),
  remove: (id) => api.delete(`/api/warden-panel/mess/${id}`)
};

// Complaints APIs
export const complaintAPI = {
  getAll: (params) => api.get('/api/warden-panel/complaints/all', { params }),
  create: (data) => api.post('/api/warden-panel/complaints/create', data),
  update: (id, data) => api.put(`/api/warden-panel/complaints/${id}`, data),
  updateStatus: (id, status) => api.patch(`/api/warden-panel/complaints/${id}/status`, { status }),
  remove: (id) => api.delete(`/api/warden-panel/complaints/${id}`)
};

// Check-In/Out APIs
export const checkInOutAPI = {
  getAll: (params) => api.get('/api/warden-panel/check-in-out/all', { params }),
  create: (data) => api.post('/api/warden-panel/check-in-out/create', data),
  getByDate: (date) => api.get(`/api/warden-panel/check-in-out/date/${date}`)
};

// Entry/Exit APIs
export const entryExitAPI = {
  getAll: (params) => api.get('/api/warden-panel/entry-exit/all', { params }),
  create: (data) => api.post('/api/warden-panel/entry-exit/create', data),
  getByDate: (date) => api.get(`/api/warden-panel/entry-exit/date/${date}`)
};

// Visitor APIs
export const visitorAPI = {
  getAll: (params) => api.get('/api/warden-panel/visitors/all', { params }),
  create: (data) => api.post('/api/warden-panel/visitors/create', data),
  update: (id, data) => api.put(`/api/warden-panel/visitors/${id}`, data),
  remove: (id) => api.delete(`/api/warden-panel/visitors/${id}`)
};

// Leave/Gate Pass APIs
export const leaveGatePassAPI = {
  getAll: (params) => api.get('/api/warden-panel/leave-gatepass/all', { params }),
  create: (data) => api.post('/api/warden-panel/leave-gatepass/create', data),
  update: (id, data) => api.put(`/api/warden-panel/leave-gatepass/${id}`, data),
  updateStatus: (id, status) => api.patch(`/api/warden-panel/leave-gatepass/${id}/status`, { status }),
  remove: (id) => api.delete(`/api/warden-panel/leave-gatepass/${id}`)
};

// Hostel Fee APIs
export const hostelFeeAPI = {
  getAll: (params) => api.get('/api/warden-panel/hostel-fee/all', { params }),
  getStats: (params) => api.get('/api/warden-panel/hostel-fee/stats', { params }),
  create: (data) => api.post('/api/warden-panel/hostel-fee/create', data),
  generate: (data) => api.post('/api/warden-panel/hostel-fee/generate', data),
  markPaid: (id, data) => api.patch(`/api/warden-panel/hostel-fee/mark-paid/${id}`, data),
  update: (id, data) => api.put(`/api/warden-panel/hostel-fee/${id}`, data),
  remove: (id) => api.delete(`/api/warden-panel/hostel-fee/${id}`)
};

// Student Query APIs
export const studentQueryAPI = {
  getAll: (params) => api.get('/api/warden-panel/student-queries/all', { params }),
  create: (data) => api.post('/api/warden-panel/student-queries/create', data),
  update: (id, data) => api.put(`/api/warden-panel/student-queries/${id}`, data),
  updateStatus: (id, status) => api.patch(`/api/warden-panel/student-queries/${id}/status`, { status }),
  remove: (id) => api.delete(`/api/warden-panel/student-queries/${id}`)
};

// Hostel Service APIs
export const hostelServiceAPI = {
  getAll: (params) => api.get('/api/warden-panel/services/all', { params }),
  create: (data) => api.post('/api/warden-panel/services/create', data),
  update: (id, data) => api.put(`/api/warden-panel/services/${id}`, data),
  remove: (id) => api.delete(`/api/warden-panel/services/${id}`)
};

// Dashboard APIs
export const dashboardAPI = {
  getStats: () => api.get('/api/warden-panel/dashboard'),
  getRecentActivity: () => api.get('/api/warden-panel/dashboard'), // Both provided by the same endpoint
  getRoomsWithTypes: () => api.get('/api/warden-panel/rooms-with-types'),
  getFloorTracking: () => api.get('/api/warden-panel/floor-tracking')
};

// Analytics APIs
export const analyticsAPI = {
  getOverview: (params) => api.get('/api/warden-panel/analytics/overview', { params }),
  getOccupancy: (params) => api.get('/api/warden-panel/analytics/occupancy', { params }),
  getAttendance: (params) => api.get('/api/warden-panel/analytics/attendance', { params })
};

// Reports APIs
export const reportsAPI = {
  getHostelReport: (params) => api.get('/api/warden-panel/reports/hostel', { params }),
  getAttendanceReport: (params) => api.get('/api/warden-panel/reports/attendance', { params }),
  getFeeReport: (params) => api.get('/api/warden-panel/reports/fee', { params })
};

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/api/warden-auth/login', credentials),
  changePassword: (data) => api.post('/api/warden-auth/change-password', data),
  getProfile: () => api.get('/api/warden-auth/profile'),
  updateProfile: (formData) => api.put('/api/warden-auth/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};

// Hostel Allocation APIs
export const hostelAllocationAPI = {
  getAll: (params) => api.get('/api/hostel-allocation/all', { params }),
  getById: (id) => api.get(`/api/hostel-allocation/${id}`),
  allocate: (data) => api.post('/api/hostel-allocation/allocate', data),
  update: (id, data) => api.put(`/api/hostel-allocation/update/${id}`, data),
  cancel: (id) => api.patch(`/api/hostel-allocation/cancel/${id}`),
  getAllocatedStudents: (params) => api.get('/api/hostel-allocation/allocated-students', { params })
};

// Hostel APIs
export const hostelAPI = {
  getAll: (params) => api.get('/api/hostel/all', { params }),
  getById: (id) => api.get(`/api/hostel/${id}`)
};

// Room Type APIs
export const roomTypeAPI = {
  getAll: (params) => api.get('/api/room-type/all', { params }),
  getById: (id) => api.get(`/api/room-type/${id}`)
};

export default api;
