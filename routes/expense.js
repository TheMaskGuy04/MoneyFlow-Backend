const express = require("express");
const { getAllExpenses, addNewExpenses } = require("../controllers/expense");

const router = express.Router();

router.get("/", getAllExpenses);
router.post("/add", addNewExpenses, getAllExpenses);

module.exports = router;
