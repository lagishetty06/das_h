import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import authService from '../api/authService';
import { toast } from 'react-toastify';
import useAuth from '../hooks/useAuth';

// --- Reusable SVG Icons ---
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

// Google Logo SVG
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);
// --- End Icons ---

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phoneNumber: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authService.register(formData);
      toast.success('Registration successful! Check your email for a code.');
      navigate('/verify-otp', {
        state: { userId: response.data.userId, email: formData.email }
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      // Send user info to our backend to get a DASH JWT token
      const response = await authService.googleAuth({
        email: user.email,
        name: user.displayName,
        googleUid: user.uid,
        photoURL: user.photoURL,
      });
      login(response.data);
      toast.success(`Welcome aboard, ${user.displayName}! 🎉`);
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        // User closed popup, no error needed
      } else {
        console.error('Google sign-up error:', err);
        toast.error('Google sign-up failed. Please try again.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-140px)] py-12 px-6 overflow-hidden">
      {/* Decorative background element */}
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

      {/* Floating card with glassmorphism */}
      <div className="w-full bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200/50 sm:max-w-md animate-fade-in-up-fast hover:shadow-3xl hover:-translate-y-1 transition-all duration-300">
        <div className="p-6 space-y-4 md:space-y-5 sm:p-8">
          <h1 className="text-2xl font-bold leading-tight tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent md:text-3xl text-center">
            Create an Account
          </h1>

          {/* Google Sign-Up Button */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-700 font-semibold text-sm shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-[1.01] disabled:opacity-60"
          >
            <GoogleIcon />
            {googleLoading ? 'Signing up with Google...' : 'Continue with Google'}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">or sign up with email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-semibold text-gray-900">Your Name</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={onChange} className="bg-white/90 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3 transition-all duration-200 hover:border-indigo-400" placeholder="John Doe" required />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-semibold text-gray-900">Your Email</label>
              <input type="email" name="email" id="email" value={formData.email} onChange={onChange} className="bg-white/90 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3 transition-all duration-200 hover:border-indigo-400" placeholder="name@company.com" required />
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium text-gray-900">
                Phone Number <span className="text-gray-500 text-xs">(optional)</span>
              </label>
              <input type="tel" name="phoneNumber" id="phoneNumber" value={formData.phoneNumber} onChange={onChange} className="bg-white/90 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3 transition-all duration-200 hover:border-indigo-400" placeholder="+911234567890" />
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
                  className="bg-white/90 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3 pr-10 transition-all duration-200 hover:border-indigo-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 hover:scale-110 transition-transform duration-200"
                >
                  {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading || googleLoading} className="w-full text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-semibold rounded-lg text-sm px-5 py-3 text-center disabled:opacity-75 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl">
              {loading ? 'Creating Account...' : 'Create an account'}
            </button>
            <p className="text-sm font-medium text-gray-600 text-center">
              Already have an account? <Link to="/login" className="font-semibold text-indigo-600 hover:text-purple-600 transition-colors duration-200 relative group">
                Login here
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
