import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import authService from '../api/authService';
import { toast } from 'react-toastify'; // Import toast

const VerifyOtpPage = () => {
  const [emailOtp, setEmailOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, email } = location.state || {};

  useEffect(() => {
    if (!userId) navigate('/register');
  }, [userId, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.verifyOtp({ userId, emailOtp });
      toast.success('Account verified successfully! Please log in.'); // Replace alert
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed. Please try again.'); // Replace error state
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await authService.resendOtp(email);
      toast.info('A new verification code has been sent.'); // Use info toast
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend code.');
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-140px)] py-12 px-6 overflow-hidden">
      {/* Decorative background element matching HomePage */}
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

      <div className="w-full bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200/50 sm:max-w-md animate-fade-in-up-fast hover:shadow-3xl hover:-translate-y-1 transition-all duration-300">
        <div className="p-8 space-y-6">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold leading-tight tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent md:text-3xl">
              Check Your Email
            </h1>
            <p className="text-sm text-gray-600">Enter the 6-digit code sent to <strong className="text-indigo-600">{email}</strong></p>
          </div>
          <form className="space-y-6" onSubmit={onSubmit}>
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
                  className="font-semibold text-indigo-600 hover:text-purple-600 transition-colors duration-200 relative group"
                >
                    Didn't get the code? Resend
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full"></span>
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;









