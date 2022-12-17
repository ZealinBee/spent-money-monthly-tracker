

//Imports
import numberOfDaysInAMonth from "./daysCount.js";

//Lalallaasdfdasfasdf

//New Code test test

//Program
const program = document.querySelector('#program')

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
const signUpPasswordInput = document.querySelector("#sign-up-password-input");
const loginUserNameInput = document.querySelector("#login-username-input");
const loginPasswordInput = document.querySelector("#login-password-input");
const loginButton = document.querySelector("#login-button");
const loginErrorMessage = document.querySelector(".login-error-message");
const fillEmptyErrorMessage = document.querySelector(
  ".fill-empty-error-message"
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
  const xhr = new XMLHttpRequest();
  xhr.open("PUT", "/money");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(
    JSON.stringify({
      totalHave: monthlyAllowance,
    })
  );
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

  const xhr = new XMLHttpRequest();
  xhr.open("PUT", "/money");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(
    JSON.stringify({
      totalSpend: totalSpentMoney,
    })
  );
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
  console.log(userNameInputValue);
  console.log(passwordInputValue);
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/register");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(
    JSON.stringify({
      username: userNameInputValue,
      password: passwordInputValue,
      totalHave: 0,
      totalSpend: 0,
    })
  );
});
loginButton.addEventListener("click", loginUser);

async function loginUser(e) {
  e.preventDefault();

  let userNameInputValue = loginUserNameInput.value;
  let passwordInputValue = loginPasswordInput.value;
  if (passwordInputValue.length == 0 || userNameInputValue.length == 0) {
    fillEmptyErrorMessage.classList.add("show");
    loginUserNameInput.classList.add("error-login");
    loginPasswordInput.classList.add("error-login");
  } else {
    fillEmptyErrorMessage.classList.remove("show");
    loginUserNameInput.classList.remove("error-login");
    loginPasswordInput.classList.remove("error-login");
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: userNameInputValue,
        password: passwordInputValue,
        totalHave: 0,
        totalSpend: 0,
      }),
    })
      .then((response) => response.json())
      .then((data) => checkLogin(data));
  }
}

function checkLogin(data) {
  let answer = data.answer;
  let totalSpend = data.totalSpend
  let totalHave = data.totalHave
  console.log(data)
  if (!answer) {
    loginUserNameInput.classList.add("error-login");
    loginPasswordInput.classList.add("error-login");
    loginErrorMessage.classList.add("show");
  }else {
    loginUserNameInput.classList.remove("error-login");
    loginPasswordInput.classList.remove("error-login");
    loginErrorMessage.classList.remove("show");
    program.classList.add('show')
    loginSection.classList.add('hide')
    monthlyAllowance = totalHave
    totalMonthlyAllowanceSpan.textContent = monthlyAllowance
    totalSpentMoney = totalSpend
    totalSpentMoneySpan.textContent = totalSpentMoney
    dailyAllowance = (monthlyAllowance / numberOfDaysInAMonth).toFixed(2);
  dailyAllowanceSpan.textContent = dailyAllowance;
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
  calendar.render();
  }
  if(monthlyAllowance > 0) {
    monthlyAllowanceContainer.classList.add('hide')
  }

}
