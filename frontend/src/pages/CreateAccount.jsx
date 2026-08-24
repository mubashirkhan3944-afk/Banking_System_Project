import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const CreateAccount = () => {

    const navigate = useNavigate();
    const [error, setError] = useState('');

async function formSubmit(e){
  e.preventDefault();

await axios.post('https://banking-system-project.onrender.com/api/account/create-account',{},{withCredentials:true})
.then((response)=>{
    navigate('/home');
})
.catch((error)=>{
    console.log(error)
    setError(error.response.data.message);
})

  
  


}

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container Card */}
      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 relative z-10">
        {/*Error alert*/}
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2.5">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-500 shadow-lg shadow-blue-500/20 mb-3">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-sm text-slate-400 mt-1">Open a new bank account linked to your profile</p>
        </div>

        {/* Create Account Form UI */}
        <form onSubmit={formSubmit} className="space-y-4">

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 text-white font-medium rounded-xl shadow-lg shadow-blue-600/25 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Create Account</span>
          </button>
        </form>

        {/* Back Link */}
        <div className="mt-6 text-center text-xs text-slate-400">
          Want to return to dashboard?{' '}
          <Link to="/home" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
