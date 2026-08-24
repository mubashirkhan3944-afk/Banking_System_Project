import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
const Admin = () => {
  const [userId, setUserId] = useState('');
  const [userData, setuserData] = useState(null)


  async function fetchUser(){
    try {
      const response = await axios.get(`https://nexus-banking-ti17.onrender.com/api/account/get-user/${userId}`,{withCredentials : true})
      setuserData(response.data);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-violet-600 to-blue-500 shadow-lg shadow-violet-500/25">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Admin Panel</h1>
              <p className="text-xs text-slate-400">System Administration</p>
            </div>
          </div>
          <Link
            to="/home"
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>

        {/* Search Card */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 mb-6">
          <h2 className="text-base font-semibold text-slate-200 mb-1">Look Up User</h2>
          <p className="text-xs text-slate-500 mb-5">Enter user ID to fetch user details.</p>

          <div className="flex gap-3">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                </svg>
              </span>
              <input
                type="text"
                id="admin-user-query"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="UserId..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-sm"
              />
            </div>
            <button
              id="admin-fetch-btn"
              type="button"
              className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-blue-500 hover:from-violet-500 hover:to-blue-400 text-white font-medium rounded-xl shadow-lg shadow-violet-600/25 transition-all text-sm whitespace-nowrap cursor-pointer"
              onClick={fetchUser}
            >
              Fetch User
            </button>
          </div>
        </div>

        {/* Result Card — shown when userData is available */}
        {userData ? (
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8">
            <h2 className="text-base font-semibold text-slate-200 mb-5 flex items-center gap-2">
              <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              User Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Username', value: userData.user },
                { label: 'Email', value: userData.email },
                { label: 'Account Number', value: userData.account },
                { label: 'Balance', value: userData.balance },
                { label: 'Joined', value: userData.createdAt },
              ].map(({ label, value }) => (
                <div key={label} className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">{label}</p>
                  <p className="text-sm font-medium text-slate-100 truncate">{value ?? '—'}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-10 flex flex-col items-center justify-center text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-800/80 mb-4">
              <svg className="w-7 h-7 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-slate-400 text-sm font-medium">No user loaded</p>
            <p className="text-slate-600 text-xs mt-1">Search for a username or email above to view their details.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
