//Imports
import numberOfDaysInAMonth from "./daysCount.js";

//Program
const program = document.querySelector("#program");
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
  program.classList.add("show");
  calendar.render();
});


// signUpPasswordInput.addEventListener('input', function() {
//   let passwordInputValue = signUpPasswordInput.value;
//   var re = /\D/;
//   var re1 = /\s/;
//   var re2 = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
//   var n = re.test(passwordInputValue);
//   var n1=!re1.test(passwordInputValue)
//   var n2=re2.test(passwordInputValue)
// })

const signUpError = document.querySelector('.sign-up-error')
const letterError = document.querySelector('#letter')
const capitalError = document.querySelector('#uppercase-letter')
const lengthError = document.querySelector('#length')
const numberError = document.querySelector('#number')
const specialCharacterError = document.querySelector('#special-character')
const whiteSpaceError = document.querySelector('#white-space')


signUpPasswordInput.addEventListener('input' , function() {
  signUpError.style.display = "block";
  var lowerCaseLetters = /[a-z]/g;
  if(signUpPasswordInput.value.match(lowerCaseLetters)) {
    letterError.classList.remove('invalid')
    letterError.classList.add('valid')
  }else {
    letterError.classList.remove('valid')
    letterError.classList.add('invalid')
  }
  var upperCaseLetters = /[A-Z]/g;
  if(signUpPasswordInput.value.match(upperCaseLetters)) {  
    capitalError.classList.remove("invalid");
    capitalError.classList.add("valid");
  } else {
    capitalError.classList.remove("valid");
    capitalError.classList.add("invalid");
  }
  if(signUpPasswordInput.value.length >= 8) {  
    lengthError.classList.remove("invalid");
    lengthError.classList.add("valid");
  } else {
    lengthError.classList.remove("valid");
    lengthError.classList.add("invalid");
  }
  var numbers = /[0-9]/g;
  if(signUpPasswordInput.value.match(numbers)) {  
    numberError.classList.remove("invalid");
    numberError.classList.add("valid");
  } else {
    numberError.classList.remove("valid");
    numberError.classList.add("invalid");
  }
  var specialCharacter = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  if(signUpPasswordInput.value.match(specialCharacter)) {  
    specialCharacterError.classList.remove("invalid");
    specialCharacterError.classList.add("valid");
  } else {
    
    specialCharacterError.classList.remove("valid");
    specialCharacterError.classList.add("invalid");
  }
  var whiteSpace = /[ \t\n\r]/;
  if(signUpPasswordInput.value.match(whiteSpace)){
    whiteSpaceError.classList.add('invalid')
    whiteSpaceError.classList.remove('valid')
  }else{
    whiteSpaceError.classList.add('valid')
    whiteSpaceError.classList.remove('invalid')
  }
})




signUpButton.addEventListener("click", function (e) {
  e.preventDefault();
  let userNameInputValue = signUpUserNameInput.value;
  let passwordInputValue = signUpPasswordInput.value;
  var re = /\D/;
  var re1 = /\s/;
  var re2 = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
  var n = re.test(passwordInputValue);
  var n1=!re1.test(passwordInputValue)
  var n2=re2.test(passwordInputValue)
  if ((passwordInputValue.length<8)||!(n1&&n2&&n)){
    signUpUserNameInput.classList.add("error-login");
    signUpPasswordInput.classList.add("error-login");
    console.log('hi')
  } else {
    signUpUserNameInput.classList.remove("error-login");
    signUpPasswordInput.classList.remove("error-login");

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
    signUpSection.classList.remove("show");
    program.classList.add("show");
    calendar.render();
  }
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
  let totalSpend = data.totalSpend;
  let totalHave = data.totalHave;
  console.log(data);
  if (!answer) {
    loginUserNameInput.classList.add("error-login");
    loginPasswordInput.classList.add("error-login");
    loginErrorMessage.classList.add("show");
  } else {
    loginUserNameInput.classList.remove("error-login");
    loginPasswordInput.classList.remove("error-login");
    loginErrorMessage.classList.remove("show");
    program.classList.add("show");
    loginSection.classList.add("hide");
    monthlyAllowance = totalHave;
    totalMonthlyAllowanceSpan.textContent = monthlyAllowance;
    totalSpentMoney = totalSpend;
    totalSpentMoneySpan.textContent = totalSpentMoney;
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
  if (monthlyAllowance > 0) {
    monthlyAllowanceContainer.classList.add("hide");
  }
}


//Reset button

resetButton.addEventListener("click", function () {
  const xhr = new XMLHttpRequest();
  xhr.open("PUT", "/money");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(
    JSON.stringify({
      totalHave: 0,
      totalSpend: 0,
    })
  );

  totalMonthlyAllowanceSpan.textContent = 0;
  totalSpentMoneySpan.textContent = 0;
  dailyAllowanceSpan.textContent = 0;
  totalDaysUsedSpan.textContent = 0;
  monthlyAllowanceContainer.classList.remove('hide')
});

//Not functionality, just css

const userNameInputWrapper = document.querySelector(".user-name-input-wrapper");
const userNameInputWrapperSignUp = document.querySelector(".user-name-input-wrapper-sign-up");
const userNameLabel = document.querySelector(".user-name-label");
const userNameLabelSignUp = document.querySelector(".user-name-label-sign-up");
const passwordInputWrapper = document.querySelector(".password-input-wrapper");
const passwordInputWrapperSignUp = document.querySelector(".password-input-wrapper-sign-up");
const passwordLabel = document.querySelector(".password-label");
const passwordLabelSignUp = document.querySelector(".password-label-sign-up");

userNameInputWrapper.addEventListener("click", function () {
  userNameLabel.classList.add("move-up");
  userNameLabel.classList.add("change-text-color");
  loginUserNameInput.classList.add('change-border-color')

});

passwordInputWrapper.addEventListener("click", function () {
  passwordLabel.classList.add("move-up");
  passwordLabel.classList.add("change-text-color");
  loginPasswordInput.classList.add('change-border-color')

});

userNameInputWrapperSignUp.addEventListener('click', function() {
  userNameLabelSignUp.classList.add("move-up");
  userNameLabelSignUp.classList.add("change-text-color");
  signUpUserNameInput.classList.add('change-border-color')
})
passwordInputWrapperSignUp.addEventListener('click', function() {
  passwordLabelSignUp.classList.add("move-up");
  passwordLabelSignUp.classList.add("change-text-color");
  signUpPasswordInput.classList.add('change-border-color')
})