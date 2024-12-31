const categories = {
  Groceries: 0,
  "Food & Dining": 0,
  Transportation: 0,
  Entertainment: 0,
  Shopping: 0,
  "Utilities & Bills": 0,
  Health: 0,
  Education: 0,
  "Personal Care": 0,
  Other: 0,
};

const numToMonthMapping = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const newMonthsArr = numToMonthMapping.map((month) => ({
  name: month,
  data: [],
  categories: JSON.parse(JSON.stringify(categories)), // Deep copy of categories
  summary: {
    month: month,
    year: 2024,
    totalExpense: 0,
    topCategory: "",
  },
}));

const newMonthsObj = {
  data: [],
  categories: JSON.parse(JSON.stringify(categories)), // Deep copy of categories
  summary: {
    month: "",
    year: 2024,
    totalExpense: 0,
    topCategory: "",
    lastExpense: "",
  },
};

module.exports = { newMonthsArr, newMonthsObj, numToMonthMapping };
