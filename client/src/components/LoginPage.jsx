import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../api/authService';
import { toast } from 'react-toastify';
import useAuth from '../hooks/useAuth';

// --- Reusable SVG Icons (No Changes) ---
const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const EyeSlashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
);
// --- End Icons ---

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // ... (rest of your logic is unchanged)
    try {
      const response = await authService.login(formData);
      login(response.data);
      toast.success('Login successful! Welcome back.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Main container uses the gradient from HomePage
    <div className="relative flex items-center justify-center min-h-[calc(100vh-140px)] py-12 px-4 overflow-hidden">
      {/* Decorative background element (copied from HomePage) */}
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

      {/* Glassmorphism Card with hover effect */}
      <div className="w-full max-w-md p-8 space-y-6 bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200/50 animate-fade-in-up-fast hover:shadow-3xl hover:-translate-y-1 transition-all duration-300">
        <h1 className="text-3xl font-bold leading-tight tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-center">
          Sign in to DASH
        </h1>
        <form className="space-y-6" onSubmit={onSubmit}>
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-semibold text-gray-900">Your email</label>
            <input 
              type="email" 
              name="email" 
              id="email" 
              value={formData.email} 
              onChange={onChange} 
              className="bg-white/90 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3 placeholder-gray-400 transition-all duration-200 hover:border-indigo-400" 
              placeholder="name@company.com" 
              required 
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-semibold text-gray-900">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                value={formData.password}
                onChange={onChange}
                placeholder="••••••••"
                className="bg-white/90 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3 pr-10 placeholder-gray-400 transition-all duration-200 hover:border-indigo-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 z-10 hover:scale-110 transition-transform duration-200"
              >
                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-semibold rounded-lg text-sm px-5 py-3 text-center disabled:opacity-75 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
          
          <p className="text-sm font-medium text-gray-600 text-center">
            Don't have an account yet? <Link to="/register" className="font-semibold text-indigo-600 hover:text-purple-600 transition-colors duration-200 relative group">
              Sign up
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;








