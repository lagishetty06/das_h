import React, { useState } from 'react';
import { X } from 'lucide-react';
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

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode); // 'login', 'register', or 'verify'
  const [formData, setFormData] = useState({ name: '', email: '', phoneNumber: '', password: '' });
  const [emailOtp, setEmailOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [verifyData, setVerifyData] = useState({ userId: '', email: '' });
  const { login } = useAuth();

  // Reset mode when modal opens with new initialMode
  React.useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const resetForm = () => {
    setFormData({ name: '', email: '', phoneNumber: '', password: '' });
    setEmailOtp('');
    setShowPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Login Handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authService.login({ email: formData.email, password: formData.password });
      login(response.data);
      toast.success('Login successful! Welcome back.');
      handleClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Register Handler
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authService.register(formData);
      toast.success('Registration successful! You can now log in.');
      // Skip the verify step since OTP is disabled
      // setVerifyData({ userId: response.data.userId, email: formData.email });
      // setMode('verify');
      resetForm();
      setMode('login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP Handler
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.verifyOtp({ userId: verifyData.userId, emailOtp });
      toast.success('Account verified successfully! Please log in.');
      resetForm();
      setMode('login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP Handler
  const handleResend = async () => {
    try {
      await authService.resendOtp(verifyData.email);
      toast.info('A new verification code has been sent.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend code.');
    }
  };

  const handleGoogleSignIn = () => {
    toast.info('Google Sign-In is currently in development (requires Google Cloud API setup).');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200/50 animate-slide-up">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 z-10"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        <div className="p-8">
          {/* Login Form */}
          {mode === 'login' && (
            <>
              <h2 className="text-3xl font-bold leading-tight tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-center mb-6">
                Sign in to DASH
              </h2>
              <form className="space-y-6" onSubmit={handleLogin}>
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
                      className="absolute inset-y-0 right-0 flex items-center pr-3 hover:scale-110 transition-transform duration-200"
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

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="flex-shrink-0 mx-4 text-gray-500 text-sm">or</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-gray-200 font-semibold rounded-lg text-sm px-5 py-3 text-center transform hover:scale-[1.02] transition-all duration-200 shadow-sm"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    <path fill="none" d="M1 1h22v22H1z" />
                  </svg>
                  Continue with Google
                </button>

                <p className="text-sm font-medium text-gray-600 text-center mt-4">
                  Don't have an account yet?
                  <button
                    type="button"
                    onClick={() => { resetForm(); setMode('register'); }}
                    className="ml-1 font-semibold text-indigo-600 hover:text-purple-600 transition-colors duration-200"
                  >
                    Sign up
                  </button>
                </p>
              </form>
            </>
          )}

          {/* Register Form */}
          {mode === 'register' && (
            <>
              <h2 className="text-2xl font-bold leading-tight tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent md:text-3xl text-center mb-6">
                Create an Account
              </h2>
              <form className="space-y-6" onSubmit={handleRegister}>
                <div>
                  <label htmlFor="name" className="block mb-2 text-sm font-semibold text-gray-900">Your Name</label>
                  <input type="text" name="name" id="name" value={formData.name} onChange={onChange} className="bg-white/90 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3 transition-all duration-200 hover:border-indigo-400" placeholder="John Doe" required />
                </div>
                <div>
                  <label htmlFor="reg-email" className="block mb-2 text-sm font-semibold text-gray-900">Your Email</label>
                  <input type="email" name="email" id="reg-email" value={formData.email} onChange={onChange} className="bg-white/90 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3 transition-all duration-200 hover:border-indigo-400" placeholder="name@company.com" required />
                </div>
                <div>
                  <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium text-gray-900">
                    Phone Number <span className="text-gray-500 text-xs">(optional)</span>
                  </label>
                  <input type="tel" name="phoneNumber" id="phoneNumber" value={formData.phoneNumber} onChange={onChange} className="bg-white/90 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3 transition-all duration-200 hover:border-indigo-400" placeholder="+911234567890" />
                </div>
                <div>
                  <label htmlFor="reg-password" className="block mb-2 text-sm font-semibold text-gray-900">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      id="reg-password"
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
                <button type="submit" disabled={loading} className="w-full text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-semibold rounded-lg text-sm px-5 py-3 text-center disabled:opacity-75 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl">
                  {loading ? 'Creating Account...' : 'Create an account'}
                </button>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="flex-shrink-0 mx-4 text-gray-500 text-sm">or</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-gray-200 font-semibold rounded-lg text-sm px-5 py-3 text-center transform hover:scale-[1.02] transition-all duration-200 shadow-sm"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    <path fill="none" d="M1 1h22v22H1z" />
                  </svg>
                  Continue with Google
                </button>

                <p className="text-sm font-medium text-gray-600 text-center mt-4">
                  Already have an account?
                  <button
                    type="button"
                    onClick={() => { resetForm(); setMode('login'); }}
                    className="ml-1 font-semibold text-indigo-600 hover:text-purple-600 transition-colors duration-200"
                  >
                    Login here
                  </button>
                </p>
              </form>
            </>
          )}

          {/* Verify OTP Form */}
          {mode === 'verify' && (
            <>
              <div className="text-center space-y-3 mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold leading-tight tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent md:text-3xl">
                  Check Your Email
                </h2>
                <p className="text-sm text-gray-600">Enter the 6-digit code sent to <strong className="text-indigo-600">{verifyData.email}</strong></p>
              </div>
              <form className="space-y-6" onSubmit={handleVerifyOtp}>
                <div>
                  <label htmlFor="emailOtp" className="block mb-2 text-sm font-semibold text-gray-900">Verification Code</label>
                  <input
                    type="text"
                    name="emailOtp"
                    id="emailOtp"
                    value={emailOtp}
                    onChange={(e) => setEmailOtp(e.target.value)}
                    className="bg-white/90 border border-gray-300 text-gray-900 text-center text-2xl font-bold tracking-widest rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full p-4 transition-all duration-200 hover:border-indigo-400"
                    placeholder="000000"
                    maxLength="6"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-semibold rounded-lg text-sm px-5 py-3 text-center disabled:opacity-75 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {loading ? 'Verifying...' : 'Verify Account'}
                </button>
                <div className="text-sm text-center">
                  <button
                    type="button"
                    onClick={handleResend}
                    className="font-semibold text-indigo-600 hover:text-purple-600 transition-colors duration-200"
                  >
                    Didn't get the code? Resend
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
