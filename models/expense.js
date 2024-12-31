const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    title: String,
    category: String,
    date: String,
    paymentMode: String,
    amount: String,
  },

  { timestamps: true }
);

const Expense = mongoose.model("expenses", expenseSchema);

module.exports = Expense;
