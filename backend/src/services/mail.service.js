const nodemailer = require('nodemailer');


//Transporter for connecting with the SMTP servers
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

async function sendEmail(to,subject,text,html){

    try{

        const info = await transporter.sendMail({
            from: `"Nexus Bank" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html
        })

        console.log('Message sent: $s', info.messageId);
        console.log('Preview URL: $s ', nodemailer.getTestMessageUrl(info));

    }catch(error){
        console.log('Error Sending Email ', error);
    }
}


async function sendRegistrationEmail(name,useremail){

    const subject = 'Welcome to Nexus Bank!';
    const text = `hello ${name},
     \n\nThank you for registering at Nexus Bank. We're excited to have you on board!
     \n\nBest regards,
     \nThe Nexus Team`;

     const html = `<p>Hello ${name},</p>
     <p>Thank you for registering at Nexus Bank. We're excited to have you on board!</p>
     <p>Best regards,<br>The Nexus Team</p>`;

     await sendEmail(useremail,subject,text,html)

}


async function sendLoginEmail(name,useremail){
    const subject = 'Welcome Back to Nexus Bank!';
    const text = `Hello ${name},
    \n\nYou have recently logged in on Nexus Bank.
     \n\nIf it was not you, Kindly inform us!,
     \n\nBest Regards,
     \nThe Nexus Team`;

    const html = `<p>Hello ${name},</p>
     <p>You have recently logged in on Nexus Bank.</p>
     <p>If it was not you, Kindly inform us!,</p>
     <p>Best regards,<br>The Nexus Team</p>`;

     await sendEmail(useremail,subject,text,html);
}

async function sendLogoutEmail(name,useremail){
    const subject = 'Logout from Nexus Bank!';
    const text = `Hello ${name},
    \n\nYou have recently logged out from Nexus Bank.
     \n\nBest Regards,
     \nThe Nexus Team`;

    const html = `<p>Hello ${name},</p>
     <p>You have recently logged out from Nexus Bank.</p>
     <p>Best regards,<br>The Nexus Team</p>`;

     await sendEmail(useremail,subject,text,html);
}

async function sendTransactionEmail(name,useremail,amount){
    const subject = 'Transaction Notification!';
    const text = `Hello ${name},
    \n\nYou have recently made a transaction of amount ${amount} from your account.
     \n\nIf it was not you, Kindly inform us!,
     \n\nBest Regards,
     \nThe Nexus Team`;

    const html = `<p>Hello ${name},</p>
     <p>You have recently made a transaction of amount ${amount} from your account.</p>
     <p>If it was not you, Kindly inform us!,</p>
     <p>Best regards,<br>The Nexus Team</p>`;

     await sendEmail(useremail,subject,text,html);
}

async function sendDepositEmail(name,useremail,amount){
    const subject = 'Deposit Notification!';
    const text = `Hello ${name},
    \n\nYour account has recently been credited with the amount of ${amount}.
     \n\nIf you are facing any issues, Kindly contact us!,
     \n\nBest Regards,
     \nThe Nexus Team`;

    const html = `<p>Hello ${name},</p>
     <p>Your account has recently been credited with the amount of ${amount}.</p>
     <p>If you are facing any issues, Kindly contact us!,</p>
     <p>Best regards,<br>The Nexus Team</p>`;

     await sendEmail(useremail,subject,text,html);
}

module.exports={
    sendRegistrationEmail,
    sendLoginEmail,
    sendLogoutEmail,
    sendTransactionEmail,
    sendDepositEmail,
}