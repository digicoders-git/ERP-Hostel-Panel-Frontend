import { useState } from 'react';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaUserTie } from 'react-icons/fa';
import Swal from 'sweetalert2';

const Login = ({ onLogin }) => {
  const [wardenId, setWardenId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Random warden credentials for demo
  const wardenCredentials = {
    'WRD001': 'warden123',
    'WRD002': 'hostel456',
    'WRD003': 'manage789'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (wardenCredentials[wardenId] && wardenCredentials[wardenId] === password) {
      Swal.fire({
        title: 'Login Successful!',
        text: `Welcome Warden ${wardenId}`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        localStorage.setItem('wardenId', wardenId);
        onLogin();
      });
    } else {
      Swal.fire({
        title: 'Login Failed!',
        text: 'Invalid Warden ID or Password',
        icon: 'error',
        confirmButtonText: 'Try Again'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <FaUserTie className="mx-auto text-5xl text-blue-600 mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Warden Login</h1>
          <p className="text-gray-600">Hostel Management System</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Warden ID"
              value={wardenId}
              onChange={(e) => setWardenId(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              required
            />
          </div>
          
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition duration-200 shadow-lg"
          >
            Login as Warden
          </button>
        </form>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 font-semibold mb-2">Demo Credentials:</p>
          <div className="text-xs text-gray-500 space-y-1">
            <p>WRD001 / warden123</p>
            <p>WRD002 / hostel456</p>
            <p>WRD003 / manage789</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;