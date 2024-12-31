const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const cron = require("node-cron");
const sendEmail = require("./mailer");
const generateMonthlyReport = require("./generateReport"); // Report generation function
const User = require("./models/user");

require("dotenv").config();

async function getAllUsers() {
  const user = await User.find({});

  return user;
}

// Schedule the task for the 1st of every month at 12:00 AM
cron.schedule("0 0 1 * *", async () => {
  console.log("Cron job started:");
  const users = await getAllUsers();

  users.forEach(async (user) => {
    const report = await generateMonthlyReport(user._id);
    sendEmail(user.email, "Your Monthly Expense Report", report);
  });
});

const app = express();
const port = process.env.PORT;

const { connectToMongoDB } = require("./connect");
const { restrictToLoggedinUserOnly } = require("./middlewares/auth");

const userRoute = require("./routes/user");
const expenseRoute = require("./routes/expense");

connectToMongoDB(process.env.MONGO_URL).then(() =>
  console.log("MongoDB Connected")
);

const corsOptions = {
  origin: "https://moneyflow-frontend-one.vercel.app/",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/user", userRoute);
app.use("/expenses", restrictToLoggedinUserOnly, expenseRoute);

app.listen(port, () => {
  console.log(`Server started at port: ${port}`);
});
