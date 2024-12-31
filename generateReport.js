const mongoose = require("mongoose");
const Expense = require("./models/expense");
const moment = require("moment");

const generateMonthlyReport = async (userId) => {
  const startOfMonth = moment().startOf("month").format("YYYY-MM-DD");
  const endOfMonth = moment().endOf("month").format("YYYY-MM-DD");

  const expenses = await Expense.find({
    userId: userId,
    date: { $gte: startOfMonth, $lte: endOfMonth },
  });

  const categories = {};

  let report = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            padding: 20px;
            background-color: #f9f9f9;
          }
          h1 {
            color: #4CAF50;
          }
          p, strong {
            font-size: 14px;
          }
          .category {
            margin-bottom: 10px;
          }
          .total {
            margin-top: 20px;
            font-size: 16px;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <h1>Greetings!</h1>
        <p>We hope this message finds you well. Here's a summary of your expenses for the month.</p>
        <h2>Monthly Expense Report</h2>
  `;

  let totalMonthsExpense = 0;

  for (let i = 0; i < expenses.length; i++) {
    const currentCategory = expenses[i].category;
    const currentExpense = parseInt(expenses[i].amount);

    if (!categories.hasOwnProperty(currentCategory)) {
      categories[currentCategory] = { totalExpense: 0 };
    }

    const temp = currentExpense + categories[currentCategory].totalExpense;

    totalMonthsExpense += currentExpense;

    categories[currentCategory].totalExpense = temp;
  }

  Object.keys(categories).forEach((category) => {
    report += `
      <div class="category">
        <p><strong>${category}:</strong> ₹${categories[category].totalExpense}</p>
      </div>
    `;
  });

  report += `
        <p class="total">Total Expenses: ₹${totalMonthsExpense}</p>
        <p>Thank you for using MoneyFlow!</p>
      </body>
    </html>
  `;

  return report;
};

module.exports = generateMonthlyReport;
