import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate ,useLocation } from 'react-router-dom';

const Transaction = () => {
  
    const location = useLocation();


    const systemUser = location.state.user;

    const [formData, setformData] = useState({
        toAccount:"",
        amount:0
    })

    const navigate = useNavigate();
    const[error,seterror]=useState();
    const [success, setSuccess] = useState('');

    const handleInputChange = (e)=>{
        const {name,value}=e.target;

        setformData({
            ...formData,
            [name]:value,
        })
    }
  
    async function formHandle(e){
        e.preventDefault();

        if(formData.amount<=0){
            seterror("Amount must be greater than 0")
            return;
        }


        if(!systemUser){
            await axios.post('https://nexus-banking-ti17.onrender.com/api/transaction/',formData,{withCredentials:true})
        .then((response)=>{
                setSuccess(response.data.message);
                alert('Transaction Successful')
                navigate('/home')
                
        })
        .catch((error)=>{
            seterror(error.response.data.message);
        })
        }else{
              await axios.post('https://nexus-banking-ti17.onrender.com/api/transaction/system/initial-fund',formData,{withCredentials:true})
              .then((response)=>{
                    setSuccess(response.data.message);
                    alert('Transaction Successful')
                    navigate('/home')
        })
        .catch((error)=>{
            seterror(error.response.data.message);
        })
        }
    }

  
    return (
        <div className='bg-slate-950 text-slate-100 flex flex-col justify-center items-center  '>
            {/* Error Alert */}
        {error && (
          <div className=" p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2.5 absolute top-80 z-50">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-2.5 absolute top-80 z-50">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{success}</span>
          </div>
        )}

    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container Card */}
      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 relative z-10">
        
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-500 shadow-lg shadow-blue-500/20 mb-3">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Transfer Money
          </h1>
          <p className="text-sm text-slate-400 mt-1">Send funds directly to another account</p>
        </div>

        {/* Transaction Form UI */}
        <form onSubmit={formHandle} className="space-y-4">
          
          {/* Recipient Account Input (toAccount) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Recipient Account (toAccount)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <input
              value={formData.toAccount}
              onChange={handleInputChange}
                type="text"
                name="toAccount"
                placeholder="Enter recipient account ID"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm font-mono"
              />
            </div>
          </div>

          {/* Amount Input (amount) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Amount
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <input
              value={formData.amount}
              onChange={handleInputChange}
                name="amount"
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm font-semibold"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 text-white font-medium rounded-xl shadow-lg shadow-blue-600/25 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Send Money</span>
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
        </div>
  );
};

export default Transaction;
