/* 
1. npm install nodemailer node-cron mongoose


2. mailer.js
const nodemailer = require('nodemailer');

// Create reusable transporter object using Gmail's SMTP server
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-gmail-password',  // It's recommended to use environment variables for security
  }
});

const sendEmail = (to, subject, htmlContent) => {
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: to,
    subject: subject,
    html: htmlContent,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error occurred:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

module.exports = sendEmail;


3. generateReport.js
const mongoose = require('mongoose');
const Expense = require('./models/Expense');  // Your expense model
const moment = require('moment');

const generateMonthlyReport = async (userId) => {
  const startOfMonth = moment().startOf('month').toDate();
  const endOfMonth = moment().endOf('month').toDate();

  const expenses = await Expense.find({
    userId: userId,
    date: { $gte: startOfMonth, $lte: endOfMonth }
  });

  const categories = ['Cricket', 'Fuel', 'Snacks', 'Entertainment', 'Groceries', 'Dining Out', 'Shopping', 'Transport', 'Bills', 'Health & Fitness', 'Personal Care', 'Coffee/Drinks', 'Subscriptions', 'Travel', 'Gifts/Donations'];
  
  let report = `<h1>Monthly Expense Report</h1>`;
  categories.forEach(category => {
    const total = expenses.filter(exp => exp.category === category).reduce((sum, exp) => sum + exp.amount, 0);
    report += `<p><strong>${category}:</strong> $${total.toFixed(2)}</p>`;
  });

  report += `<p><strong>Total Expenses:</strong> $${expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}</p>`;
  
  return report;
};


4. index.js/cron.js
const cron = require('node-cron');
const sendEmail = require('./mailer');
const generateMonthlyReport = require('./generateReport'); // Report generation function

// Schedule the task for the 1st of every month at 12:00 AM
cron.schedule('0 0 1 * *', async () => {
  const users = await getUsers();  // Fetch users from the database
  
  users.forEach(async (user) => {
    const report = await generateMonthlyReport(user._id);
    sendEmail(user.email, 'Your Monthly Expense Report', report);
  });
});


*/
