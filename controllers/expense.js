const Expense = require("../models/expense");
const { numToMonthMapping, newMonthsObj } = require("../utils/constData");

async function getAllExpenses(req, res) {
  const user = req.user;
  const id = user._id;

  const data = await Expense.find({ userId: id }).sort({ date: 1 });

  if (data.length == 0) {
    return res.json({ success: true, StatusCode: 204, message: "No Expenses" });
  } //
  else {
    const sortedData = sortData(data);
    const toSendData = JSON.stringify(sortedData);

    return res.json({ success: true, StatusCode: 200, data: toSendData });
  }
}

async function addNewExpenses(req, res, next) {
  const user = req.user;
  const id = user._id;

  const body = req.body;

  if (
    !body.title ||
    !body.category ||
    !body.date ||
    !body.paymentMode ||
    !body.amount
  ) {
    return res.json({ success: false, error: "Data is required" });
  } else {
    const resp = await Expense.create({
      userId: id,
      title: body.title,
      category: body.category,
      date: body.date,
      paymentMode: body.paymentMode,
      amount: body.amount,
    });

    // console.log(resp);

    // return res.json({ success: true, data: resp });
    next();
  }
}

function sortData(data) {
  let sortedData = {};

  // console.log(data.length);

  for (let i = 0; i < data.length; i++) {
    const currentCategory = data[i].category;
    const currentExpense = parseInt(data[i].amount);
    const currentDate = new Date(data[i].date);
    const currentYear = currentDate.getFullYear().toString();
    const currentMonth = currentDate.getMonth();
    data[i]._id = data[i]._id.toString();

    // console.log(currentMonth, typeof currentYear);
    // console.log(currentId);

    if (!sortedData.hasOwnProperty(currentYear)) {
      // sortedData[currentYear] = {
      //   months: JSON.parse(JSON.stringify(newMonthsArr)),
      // };
      sortedData[currentYear] = {
        months: {},
      };
    }

    if (!sortedData[currentYear].months.hasOwnProperty(currentMonth)) {
      sortedData[currentYear].months[currentMonth] = JSON.parse(
        JSON.stringify(newMonthsObj)
      );

      sortedData[currentYear].months[currentMonth].summary.month =
        numToMonthMapping[currentMonth];
    }

    let currentMon = sortedData[currentYear].months[currentMonth];

    const tempData = currentMon.data;
    tempData.push(data[i]);
    currentMon.data = tempData;

    let prevVal = parseInt(currentMon.categories[currentCategory]);
    prevVal += currentExpense;
    currentMon.categories[currentCategory] = prevVal;

    const currentCategoryExpense = prevVal;

    prevVal = parseInt(currentMon.summary.totalExpense);
    prevVal += currentExpense;
    currentMon.summary.totalExpense = prevVal;

    prevVal = currentMon.summary.topCategory;

    if (prevVal.length == 0) {
      prevVal = currentCategory;
      currentMon.summary.topCategory = prevVal;
    } else if (
      parseInt(currentMon.categories[prevVal]) < currentCategoryExpense
    ) {
      prevVal = currentCategory;
      currentMon.summary.topCategory = prevVal;
    }

    if (currentMon.summary.year !== currentYear) {
      currentMon.summary.year = currentYear;
    }
    sortedData[currentYear].months[currentMonth] = currentMon;

    currentMon.summary.lastExpense = currentExpense;

    // console.log(sortedData[currentYear].months[currentMonth]);
  }

  // console.log(sortedData[2024].months);

  return sortedData;
}

module.exports = { getAllExpenses, addNewExpenses };

/*
{
  "2024": {
            "months": [{
                      name: "Dec"
                      data: []
                      categories: {"Food": 100, }
                      summary: {}
                      }, ]

          }
}
  */
