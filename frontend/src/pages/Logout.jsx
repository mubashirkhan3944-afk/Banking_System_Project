import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Logout = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('Logging out of your account...');

  useEffect(() => {
    const handleLogout = async () => {
      try {

        const response = await axios.get('https://nexus-banking-ti17.onrender.com/api/auth/logout', {withCredentials:true})
        console.log(response);
      } catch (err) {

        console.error('Logout error:', err);

      } finally {

        setLoading(false);
        setMessage('You have been logged out successfully.');

      }
    };

    handleLogout();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 relative z-10 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 text-blue-400 mb-4 shadow-inner">
          {loading ? (
            <svg className="animate-spin w-7 h-7 text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          )}
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">
          {loading ? 'Logging Out' : 'Signed Out'}
        </h1>
        <p className="text-slate-400 text-sm mb-6">{message}</p>

        {!loading && (
          <a
            href="/login"
            className="inline-flex items-center justify-center w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 text-white font-medium rounded-xl shadow-lg shadow-blue-600/25 transition-all text-sm"
          >
            Sign Back In
          </a>
        )}
      </div>
    </div>
  );
};

export default Logout;
