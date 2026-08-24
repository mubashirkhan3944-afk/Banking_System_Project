import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
const Homepage = () => {

    const navigate = useNavigate();
    const [formData, setformData] = useState({
        name:'',
        email:'',
        balance:0,
        accountNumber:'',
        status:'',
    })
    const [transactions, settransactions] = useState([])
    const [systemUser, setsystemUser] = useState(false)

    useEffect(()=>{
        async function getUserAccounts(){
            try{
                const response = await axios.get('https://banking-system-project.onrender.com/api/account/',{withCredentials:true});


                if(response.data.user.systemUser){
                    setsystemUser(true);
                }

                setformData({
                    name:response.data.user.username,
                    email:response.data.user.email,
                    accountNumber:response.data.account._id,
                    status:response.data.account.status,
                    balance:response.data.balance,
                })

                if(response.data.account.length === 0){
                    navigate('/create-account');
                }
            }catch(error){
                console.log(error);
            }
        }
        async function getTransactionHistory(){
            const response = await axios.get('https://banking-system-project.onrender.com/api/account/transactions',{
                withCredentials:true
            })

            settransactions(response.data.transactions)
        }

        getUserAccounts();
        getTransactionHistory();
    },[])

  const user = {
    name: formData.name,
    username: formData.name,
    email: formData.email,
    accountNumber: formData.accountNumber,
    balance: formData.balance,
    status: formData.status,
  };


  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-12 relative overflow-hidden">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header / Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center shadow-md shadow-blue-500/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              NEXUS BANK
            </span>
          </div>

          <div className='flex items-center gap-4'>
             {systemUser && (
               <div className='bg-emerald-700/20 p-2 rounded-2xl border border-emerald-600/40'>
                    System User
               </div>
             )}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 pr-4 border-r border-slate-800">
              <div className="text-left">
                <p className="text-xs font-semibold text-slate-200">{user.name}</p>
                <p className="text-[10px] text-slate-400">{user.email}</p>
              </div>
            </div>

            <Link
              to="/logout"
              className="px-3.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-xs font-medium text-slate-300 transition-colors flex items-center gap-1.5"
            >
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 mt-8 space-y-8 relative z-10">
        
        {/* Welcome Banner */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Hello, {user.name} 👋
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Welcome back to your banking dashboard. Here is your financial summary.
          </p>
        </div>

        {/* User Details & Account Summary Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Account Balance Card */}
          <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-blue-900/40 via-slate-900/90 to-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <svg className="w-48 h-48 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z" />
              </svg>
            </div>

            <div>
              <div className="flex items-center justify-end mb-4">

                <span className="text-xs text-white">ACCOUNT {user.status}</span>
              </div>

              <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Total Available Balance</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                PKR {user.balance}
              </h2>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[11px] text-slate-400 uppercase">Account Number</p>
                <p className="text-sm font-mono font-medium text-slate-200 mt-0.5">{user.accountNumber}</p>
              </div>

                <Link to="/transaction" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer inline-block"
                state={{user: systemUser}}>
                  Transfer Money
                </Link>
            </div>
          </div>

          {/* User Profile Details Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 shadow-2xl flex flex-col justify-between">
            <h3 className="text-lg font-bold text-slate-100 mb-4 pb-3 border-b border-slate-800 flex items-center justify-between">
              <span>Profile Details</span>
            </h3>

            <div className="space-y-4 text-sm">

              <div>
                <p className="text-xs text-slate-400">Username</p>
                <p className="font-semibold text-slate-200 mt-0.5">{user.username}</p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Email Address</p>
                <p className="font-semibold text-slate-200 mt-0.5">{user.email}</p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Account Status</p>
                <span className="inline-block mt-1 px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded-md border border-emerald-500/20">
                  {user.status}
                </span>
              </div>
            </div>
          </div>
          <div>
            {systemUser && (
              <Link to="/admin" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer inline-block">
                View Admin Panel
              </Link>
            )}
          </div>

        </section>

        {/* Transactions Section */}
        <section className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-100">Recent Transactions</h3>
              <p className="text-xs text-slate-400 mt-0.5">Summary of your latest account activities</p>
            </div>
            <button className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">
              View All
            </button>
          </div>

          {/* Transactions List / Table */}
          <div className="divide-y divide-slate-800/80 overflow-x-auto">
            {transactions.length > 0 && transactions?.map((data,idx) => (
              <div
                key={idx}
                className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-800/30 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-[200px]">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      data.type === 'CREDIT'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-slate-800 text-red-400 border border-slate-700'
                    }`}
                  >
                    {data.type === 'CREDIT' ? (
                      <svg className="w-5 h-5" fill="none" stroke="green" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="red" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={`text-sm font-bold ${
                      data.type === 'CREDIT' ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {data.type === 'CREDIT' ? '+' : '-'}PKR {data.amount}
                  </p>
                  <span className="text-[10px] text-slate-400 font-medium px-2 py-0.5 bg-slate-800 rounded border border-slate-700/50 inline-block mt-0.5">
                    {data.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
};

export default Homepage;
