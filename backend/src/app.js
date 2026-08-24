const express = require('express');
const authroutes = require('./routes/auth.routes');
const app=express();
const cookieParser=require('cookie-parser');
const accountRoutes = require('./routes/account.routes');
const transactionRoutes = require('./routes/transaction.routes')
const cors = require('cors')

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'https://nexus-banking-1.onrender.com',
    credentials:true
}))

app.use('/api/auth',authroutes);
app.use('/api/account',accountRoutes);
app.use('/api/transaction',transactionRoutes);



module.exports=app;