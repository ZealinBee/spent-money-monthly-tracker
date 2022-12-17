//Imports
import numberOfDaysInAMonth from "./daysCount.js";

//Editable variables
let totalSpentMoney = 0;
let monthlyAllowance = 0;
let dailyAllowance = 0;
let totalDaysUsed = 0;
let currentDay = 0;

//Login sign up part
const goToSignUpLink = document.querySelector("#go-to-sign-up-link");
const loginSection = document.querySelector(".login-section");
const signUpSection = document.querySelector(".signup-section");
const goToLoginLink = document.querySelector("#go-to-login-link");
const toggleLogin = document.querySelector(".toggle-login");
const signUpButton = document.querySelector("#sign-up-button");
const signUpUserNameInput = document.querySelector("#sign-up-username-input");
const signUpPasswordInput = document.querySelector(
  "#sign-up-password-input"
);

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
const resetButton = document.querySelector(".reset-button");

//Initialize calendar
var calendarEl = document.getElementById("calendar");
var calendar = new FullCalendar.Calendar(calendarEl, {
  initialView: "dayGridMonth",
});
calendar.render();

//Functions
const submitMonthlyMoneyHandler = () => {
  monthlyAllowanceContainer.classList.toggle("hide");
  monthlyAllowance = monthlyAllowanceInput.value - monthlySaveInput.value;
  totalMonthlyAllowanceSpan.textContent = monthlyAllowance;
  dailyAllowance = (monthlyAllowance / numberOfDaysInAMonth).toFixed(2);
  dailyAllowanceSpan.textContent = dailyAllowance;
};

const submitSpentMoneyHandler = () => {
  parseInt(totalSpentMoney);
  totalSpentMoney += Number(spentMoneyInput.value);
  spentMoneyInput.value = "";
  totalSpentMoneySpan.textContent = totalSpentMoney;
  totalDaysUsed = totalSpentMoney / dailyAllowance;
  totalDaysUsedSpan.textContent = totalDaysUsed.toFixed(0);
  if (totalDaysUsed > numberOfDaysInAMonth) {
    warning.textContent = `Bruh, you have exceeded the monthly allowance by ${(
      totalDaysUsed - numberOfDaysInAMonth
    ).toFixed(0)} day(s)`;
  }
  calendar.removeAllEvents();
  currentDay = 0;
  for (let i = 0; i < totalDaysUsed.toFixed(0); i++) {
    currentDay += 21;
    if (currentDay < 10) {
      currentDay = `0${currentDay}`;
    }
    calendar.addEvent({
      title: "day used!",
      start: `2022-12-${currentDay}`,
      end: `2022-12-${currentDay}`,
    });
    currentDay = i + 1;
  }
};

//Events
submitMonthlyMoney.addEventListener("click", submitMonthlyMoneyHandler);
submitSpentMoney.addEventListener("click", submitSpentMoneyHandler);
goToSignUpLink.addEventListener("click", function (e) {
  loginSection.classList.toggle("hide");
  signUpSection.classList.toggle("show");
});
goToLoginLink.addEventListener("click", function (e) {
  loginSection.classList.toggle("hide");
  signUpSection.classList.toggle("show");
});
toggleLogin.addEventListener("click", function (e) {
  loginSection.classList.toggle("hide");
});
signUpButton.addEventListener("click", function (e) {
  e.preventDefault();
  let userNameInputValue = signUpUserNameInput.value;
  let passwordInputValue = signUpPasswordInput.value;
  console.log(userNameInputValue)
  console.log(passwordInputValue)
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/register");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(
    JSON.stringify({
      password: passwordInputValue,
      username: userNameInputValue,
      totalSpent: 0,
      totalHave: 0,
    })
  );
});
