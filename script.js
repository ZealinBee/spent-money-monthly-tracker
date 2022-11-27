//Imports
import numberOfDaysInAMonth from "./daysCount.js";

//Editable variables
let totalSpentMoney = 0;
let monthlyAllowance = 0;
let dailyAllowance = 0;
let totalDaysUsed = 0;

//Month set money part
const monthlyAllowanceInput = document.querySelector(
  "#monthly-allowance-input"
);
const monthlySaveInput = document.querySelector("#monthly-save-input");
const monthlyAllowanceContainer = document.querySelector(
  ".monthly-allowance-container"
);
const totalMonthlyAllowanceSpan = document.querySelector(
  "#total-monthly-allowance-span"
);
const submitMonthlyMoney = document.querySelector("#submit-monthly-money");


const submitSpentMoney = document.querySelector("#submit-spent-money");
const spentMoneyInput = document.querySelector("#spent-money-input");
const totalSpentMoneySpan = document.querySelector("#total-spent-money-span");
const dailyAllowanceSpan = document.querySelector("#daily-allowance-span");
const totalDaysUsedSpan = document.querySelector("#total-days-used-span");
const warning = document.querySelector("#warning");

submitMonthlyMoney.addEventListener("click", function () {
  monthlyAllowanceContainer.classList.toggle("hide");
  monthlyAllowance = monthlyAllowanceInput.value - monthlySaveInput.value;
  localStorage.setItem("local-monthly-allowance", monthlyAllowance);
  totalMonthlyAllowanceSpan.textContent = monthlyAllowance;
  dailyAllowance = (monthlyAllowance / numberOfDaysInAMonth).toFixed(2);
  dailyAllowanceSpan.textContent = dailyAllowance;
});

submitSpentMoney.addEventListener("click", function () {
  totalSpentMoney += Number(spentMoneyInput.value);
  spentMoneyInput.value = "";
  totalSpentMoneySpan.textContent = totalSpentMoney;
  totalDaysUsed = totalSpentMoney / dailyAllowance;
  totalDaysUsedSpan.textContent = totalDaysUsed.toFixed(0);
  if (totalDaysUsed > numberOfDaysInAMonth) {
    warning.textContent = `Bruh, you have exceeded the monthly allowance by ${(
      totalDaysUsed - numberOfDaysInAMonth
    ).toFixed(0)} days`;
  }
  // for (let i = 0; i < totalDaysUsed; i++) {
  //     console.log(i)
  // }
});

document.addEventListener("DOMContentLoaded", function () {
  var calendarEl = document.getElementById("calendar");
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
  });
  calendar.render();
});
