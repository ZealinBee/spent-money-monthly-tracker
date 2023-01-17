//Imports
import numberOfDaysInAMonth from "http://localhost:3000/daysCount.js";

// window.addEventListener("beforeunload", function (e) {
//   e.preventDefault();
//   fetch("/deleterefresh", {
//     method: "DELETE",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ refreshToken: sessionStorage.getItem('refreshToken') })
//   })
// });

//If Remember me is checked, the app will initialize like if the user is already logged in

function checkLocalStorage() {
  if (
    localStorage.getItem("total-have") &&
    localStorage.getItem("total-spend")
  ) {
    sessionStorage.setItem("token", localStorage.getItem("token"));
    sessionStorage.setItem(
      "refreshToken",
      localStorage.getItem("refreshToken")
    );
    signOutButton.classList.remove("hide");
    loginSection.classList.add("hide");
    monthlyAllowanceContainer.classList.add("hide");
    program.classList.add("show");
    moneyInputWrapper.classList.add("show");
    calendarSpan.classList.add("show");
    moneyInputWrapper.classList.remove("hide");
    calendarSpan.classList.remove("hide");
    resetButton.classList.add("show");
    swapThemeButton.classList.add("show-flex");
    calendar.render();
    monthlyAllowance = parseInt(localStorage.getItem("total-have"));
    totalMonthlyAllowanceSpan.textContent = monthlyAllowance;
    totalSpentMoney = parseInt(localStorage.getItem("total-spend"));
    totalSpentMoneySpan.textContent = totalSpentMoney;
    dailyAllowance = (monthlyAllowance / numberOfDaysInAMonth).toFixed(2);
    dailyAllowanceSpan.textContent = dailyAllowance;
    totalDaysUsed = totalSpentMoney / dailyAllowance;
    totalDaysUsedSpan.textContent = totalDaysUsed.toFixed(0);
    if (totalDaysUsed > numberOfDaysInAMonth + 1) {
      warning.textContent = `Bruh, you have exceeded the monthly allowance by ${(
        totalDaysUsed - numberOfDaysInAMonth
      ).toFixed(0)} day(s)`;
    }
    calendar.removeAllEvents();
    currentDay = 0;
    for (let i = 0; i < totalDaysUsed.toFixed(0); i++) {
      currentDay += 1;
      if (currentDay < 10) {
        currentDay = `0${currentDay}`;
      }

      calendar.addEvent({
        title: "Day Used!",
        start: `${thisYear}-${thisMonth}-${currentDay}`,
        end: `${thisYear}-${thisMonth}-${currentDay}`,
      });
      currentDay = i + 1;
    }
  } else {
  }
}

window.onload = checkLocalStorage;
window.addEventListener('load', function() {
  document.querySelector(".spinner").classList.add('hide')
})


//Program
const program = document.querySelector("#program");
const moneyInputWrapper = document.querySelector(".money-input-wrapper");
let thisMonth = new Date().getMonth() + 1;
if (thisMonth < 10) {
  thisMonth = `0${thisMonth}`;
}
const thisYear = new Date().getFullYear();

//Editable variables
let totalSpentMoney = 0;
let monthlyAllowance = 0;
let dailyAllowance = 0;
let totalDaysUsed = 0;
let currentDay = 0;
let rememberMe = false;

//Initialize calendar
var calendarEl = document.getElementById("calendar");
var calendar = new FullCalendar.Calendar(calendarEl, {
  initialView: "dayGridMonth",
});
let calendarSpan = document.querySelector(".calendar");

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

//Submit monthly allowance part
const submitMonthlyMoneyHandler = async (e) => {
  e.preventDefault();

  if (monthlyAllowanceInput.value == 0) {
    document.querySelector(".money-cant-be-0-warning").classList.add("show");
    document
      .querySelector(".money-cant-be-over-10-million-warning")
      .classList.remove("show");
  } else if (monthlyAllowanceInput.value > 1000000) {
    document.querySelector(".money-cant-be-0-warning").classList.remove("show");
    document
      .querySelector(".money-cant-be-over-10-million-warning")
      .classList.add("show");
  } else {
    monthlyAllowanceContainer.classList.toggle("hide");
    moneyInputWrapper.classList.add("show");
    calendarSpan.classList.add("show");
    moneyInputWrapper.classList.remove("hide");
    calendarSpan.classList.remove("hide");
    resetButton.classList.add("show");
    swapThemeButton.classList.add("show-flex");
    calendar.render();
    monthlyAllowance = parseInt(monthlyAllowanceInput.value);
    totalMonthlyAllowanceSpan.textContent = monthlyAllowance;
    dailyAllowance = (monthlyAllowance / numberOfDaysInAMonth).toFixed(2);
    dailyAllowanceSpan.textContent = dailyAllowance;
    const ress = await fetch("/money", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      body: JSON.stringify({ totalHave: monthlyAllowance }),
    });
    if (ress.status === 400) {
      await updatingTokenHandler();

      const ress = await fetch("/money", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({ totalHave: monthlyAllowance }),
      });
    }
  }
};

const updatingTokenHandler = async () => {
  const ress = await fetch("/refresh", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${sessionStorage.getItem("refreshToken")}`,
    },
  })
    .then((res) => res.json())
    .then(async (data) => {
      let message = data.message;
      if (message) {
        let token = data.token;
        let refreshToken = data.refreshtoken;

        // await sessionStorage.clear();
        await sessionStorage.setItem("token", token);
        await sessionStorage.setItem("refreshToken", refreshToken);
      } else {
        //Force the user to login again
      }
    });
};

//Info showing part
const infoIcon = document.querySelector("#info-icon");
const infoWrapper = document.querySelector(".info-wrapper");
const closeInfoWrapperButton = document.querySelector(".ok-button");
infoIcon.addEventListener("click", function () {
  infoWrapper.classList.add("show");
});
closeInfoWrapperButton.addEventListener("click", function () {
  infoWrapper.classList.remove("show");
});

//Submit spent money
const submitSpentMoneyHandler = async (e) => {
  e.preventDefault();

  if (
    spentMoneyInput.value > monthlyAllowance * 3 ||
    spentMoneyInput.value == "" ||
    spentMoneyInput.value <= 0
  ) {
    if (spentMoneyInput.value == "" || spentMoneyInput.value <= 0) {
      document
        .querySelector(".empty-money-spent-complain")
        .classList.add("show");
      document
        .querySelector(".too-much-money-spent-complain")
        .classList.remove("show");
    } else {
      document
        .querySelector(".too-much-money-spent-complain")
        .classList.add("show");
      document
        .querySelector(".empty-money-spent-complain")
        .classList.remove("show");
      document.querySelector(".monthly-allowance-span").textContent =
        monthlyAllowance;
      document.querySelector(".spent-money-span").textContent = parseInt(
        spentMoneyInput.value
      );
    }
  } else {
    document
      .querySelector(".too-much-money-spent-complain")
      .classList.remove("show");
    document
      .querySelector(".empty-money-spent-complain")
      .classList.remove("show");
    totalSpentMoney += Number(spentMoneyInput.value);
    spentMoneyInput.value = "";
    totalSpentMoneySpan.textContent = totalSpentMoney;
    totalDaysUsed = totalSpentMoney / dailyAllowance;
    totalDaysUsedSpan.textContent = totalDaysUsed.toFixed(0);
    if (totalDaysUsed > numberOfDaysInAMonth + 1) {
      warning.textContent = `Bruh, you have exceeded the monthly allowance by ${(
        totalDaysUsed - numberOfDaysInAMonth
      ).toFixed(0)} day(s)`;
    }
    calendar.removeAllEvents();
    currentDay = 0;
    for (let i = 0; i < totalDaysUsed.toFixed(0); i++) {
      currentDay += 1;
      if (currentDay < 10) {
        currentDay = `0${currentDay}`;
      }
      calendar.addEvent({
        title: "Day Used!",
        start: `${thisYear}-${thisMonth}-${currentDay}`,
        end: `${thisYear}-${thisMonth}-${currentDay}`,
      });
      currentDay = i + 1;
    }

    const ress = await fetch("/money", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      body: JSON.stringify({ totalSpend: totalSpentMoney }),
    });

    if (ress.status === 400) {
      await updatingTokenHandler();

      const ress = await fetch("/money", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({ totalSpend: totalSpentMoney }),
      });
    }
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
  program.classList.add("show");
  // document.querySelector('.background-image').style.display = "none"
});

document
  .querySelector(".use-as-a-guest-sign-up")
  .addEventListener("click", function () {
    signUpSection.classList.toggle("hide");
    program.classList.add("show");
  });

signUpButton.addEventListener("click", async function (e) {
  e.preventDefault();
  let userNameInputValue = signUpUserNameInput.value;
  let passwordInputValue = signUpPasswordInput.value;

  var re = /\D/;
  var re1 = /\s/;
  var re2 = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  var re3 = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  var n = re.test(passwordInputValue);
  var n1 = !re1.test(passwordInputValue);
  var n2 = re2.test(passwordInputValue);
  var n3 = re3.test(userNameInputValue);
  if (
    passwordInputValue.length < 8 ||
    !(n1 && n2 && n && n3) ||
    userNameInputValue.length === 0
  ) {
    if (userNameInputValue.length === 0 || !n3) {
      signUpUserNameInput.classList.add("error-login");
      document.querySelector(".enter-proper-email").style.display = "block";
      document
        .querySelector(".user-name-already-taken")
        .classList.remove("show");
    } else {
      signUpPasswordInput.classList.add("error-login");
    }
  } else {
    signUpUserNameInput.classList.remove("error-login");
    signUpPasswordInput.classList.remove("error-login");

    const res = await fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: userNameInputValue,
        password: passwordInputValue,
        totalHave: 0,
        totalSpend: 0,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        let message = data.message;
        let token = data.token;
        let refreshToken = data.refreshtoken;
        if (!message) {
          document
            .querySelector(".user-name-already-taken")
            .classList.add("show");
          signUpUserNameInput.classList.add("error-login");
          document.querySelector(".enter-proper-email").style.display = "none";
        } else {
          signUpUserNameInput.classList.remove("error-login");
          signUpSection.classList.remove("show");
          program.classList.add("show");
          sessionStorage.setItem("token", token);
          sessionStorage.setItem("refreshToken", refreshToken);
          calendar.render();
          // document.querySelector('.background-image').style.display = "none"
        }
      });
  }
});

// Login Part

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
        email: userNameInputValue,
        password: passwordInputValue,
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
  let token = data.token;
  let refreshToken = data.refreshtoken;
  if (document.querySelector("#remember-me").checked) {
    rememberMe = true;
    localStorage.setItem("total-have", totalHave);
    localStorage.setItem("total-spend", totalSpend);
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
  } else {
    rememberMe = false;
  }
  if (!answer) {
    loginUserNameInput.classList.add("error-login");
    loginPasswordInput.classList.add("error-login");
    loginErrorMessage.classList.add("show");
  } else {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("refreshToken", refreshToken);
    loginUserNameInput.classList.remove("error-login");
    loginPasswordInput.classList.remove("error-login");
    loginErrorMessage.classList.remove("show");
    if (totalHave === 0) {
      program.classList.add("show");
      moneyInputWrapper.classList.add("hide");
      calendarSpan.classList.add("hide");
      loginSection.classList.add("hide");
    } else {
      if (
        localStorage.getItem("total-have") &&
        localStorage.getItem("total-spend")
      ) {
        document.querySelector(".sign-out-button").classList.remove("hide");
      }

      program.classList.add("show");
      moneyInputWrapper.classList.add("show");
      calendarSpan.classList.add("show");
      resetButton.classList.add("show");
      swapThemeButton.classList.add("show-flex");
      loginSection.classList.add("hide");
      monthlyAllowanceContainer.classList.add("hide");
      calendar.render();
      monthlyAllowance = totalHave;
      totalMonthlyAllowanceSpan.textContent = monthlyAllowance;
      totalSpentMoney = totalSpend;
      totalSpentMoneySpan.textContent = totalSpentMoney;
      dailyAllowance = (monthlyAllowance / numberOfDaysInAMonth).toFixed(2);
      dailyAllowanceSpan.textContent = dailyAllowance;
      totalDaysUsed = totalSpentMoney / dailyAllowance;
      totalDaysUsedSpan.textContent = totalDaysUsed.toFixed(0);
      if (totalDaysUsed > numberOfDaysInAMonth + 1) {
        warning.textContent = `Bruh, you have exceeded the monthly allowance by ${(
          totalDaysUsed - numberOfDaysInAMonth
        ).toFixed(0)} day(s)`;
      }
      calendar.removeAllEvents();
      currentDay = 0;
      for (let i = 0; i < totalDaysUsed.toFixed(0); i++) {
        currentDay += 1;
        if (currentDay < 10) {
          currentDay = `0${currentDay}`;
        }

        calendar.addEvent({
          title: "Day Used!",
          start: `${thisYear}-${thisMonth}-${currentDay}`,
          end: `${thisYear}-${thisMonth}-${currentDay}`,
        });
        currentDay = i + 1;
      }
    }
  }
}

//Reset button
const resetButton = document.querySelector(".reset-button");
const resetConfirmationWrapper = document.querySelector('.reset-everything-confirmation')
const confirmationReset = document.querySelector(".reset-confirm")
const resetCancel = document.querySelector(".dont-reset")

resetButton.addEventListener('click', function() {
  resetConfirmationWrapper.classList.add('show')
})

resetCancel.addEventListener('click', function() {
  resetConfirmationWrapper.classList.remove('show')
})

confirmationReset.addEventListener("click", async function () {
  resetConfirmationWrapper.classList.remove('show')
  document.querySelector('.spinner').classList.add('show')
  document.querySelector("body").classList.remove("dark");
  swapThemeButton.classList.remove("show-flex");
  moneyInputWrapper.classList.remove("show");
  calendarSpan.classList.remove("show");
  resetButton.classList.remove("show");
  warning.textContent = "";
  monthlyAllowance = 0;
  totalSpentMoney = 0;
  totalMonthlyAllowanceSpan.textContent = 0;
  totalSpentMoneySpan.textContent = 0;
  dailyAllowanceSpan.textContent = 0;
  totalDaysUsedSpan.textContent = 0;
  const ress = await fetch("/money", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      totalHave: 0,
      totalSpend: 0,
    }),
  });

  if (ress.status === 400) {
    await updatingTokenHandler();

    const ress = await fetch("/money", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        totalHave: 0,
        totalSpend: 0,
      }),
    });
  }
  monthlyAllowanceContainer.classList.remove("hide");
  calendar.removeAllEvents();
  document.querySelector('.spinner').classList.remove('show')

});

// Sign up password validation

const signUpError = document.querySelector(".sign-up-error");
const letterError = document.querySelector("#letter");
const capitalError = document.querySelector("#uppercase-letter");
const lengthError = document.querySelector("#length");
const numberError = document.querySelector("#number");
const specialCharacterError = document.querySelector("#special-character");
const whiteSpaceError = document.querySelector("#white-space");

signUpPasswordInput.addEventListener("input", function () {
  signUpError.style.display = "block";
  var lowerCaseLetters = /[a-z]/g;
  if (signUpPasswordInput.value.match(lowerCaseLetters)) {
    letterError.classList.remove("invalid");
    letterError.classList.add("valid");
  } else {
    letterError.classList.remove("valid");
    letterError.classList.add("invalid");
  }
  var upperCaseLetters = /[A-Z]/g;
  if (signUpPasswordInput.value.match(upperCaseLetters)) {
    capitalError.classList.remove("invalid");
    capitalError.classList.add("valid");
  } else {
    capitalError.classList.remove("valid");
    capitalError.classList.add("invalid");
  }
  if (signUpPasswordInput.value.length >= 8) {
    lengthError.classList.remove("invalid");
    lengthError.classList.add("valid");
  } else {
    lengthError.classList.remove("valid");
    lengthError.classList.add("invalid");
  }
  var numbers = /[0-9]/g;
  if (signUpPasswordInput.value.match(numbers)) {
    numberError.classList.remove("invalid");
    numberError.classList.add("valid");
  } else {
    numberError.classList.remove("valid");
    numberError.classList.add("invalid");
  }
  var specialCharacter = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  if (signUpPasswordInput.value.match(specialCharacter)) {
    specialCharacterError.classList.remove("invalid");
    specialCharacterError.classList.add("valid");
  } else {
    specialCharacterError.classList.remove("valid");
    specialCharacterError.classList.add("invalid");
  }
  var whiteSpace = /[ \t\n\r]/;
  if (signUpPasswordInput.value.match(whiteSpace)) {
    whiteSpaceError.classList.add("invalid");
    whiteSpaceError.classList.remove("valid");
  } else {
    whiteSpaceError.classList.add("valid");
    whiteSpaceError.classList.remove("invalid");
  }
});

//CSS STUFF FOR LOGIN / SIGN UP

const userNameInputWrapper = document.querySelector(".user-name-input-wrapper");
const userNameInputWrapperSignUp = document.querySelector(
  ".user-name-input-wrapper-sign-up"
);
const userNameLabel = document.querySelector(".user-name-label");
const userNameLabelSignUp = document.querySelector(".user-name-label-sign-up");
const passwordInputWrapper = document.querySelector(".password-input-wrapper");
const passwordInputWrapperSignUp = document.querySelector(
  ".password-input-wrapper-sign-up"
);
const passwordLabel = document.querySelector(".password-label");
const passwordLabelSignUp = document.querySelector(".password-label-sign-up");

loginUserNameInput.addEventListener("focus", function () {
  userNameLabel.classList.add("move-up");
  userNameLabel.classList.add("change-text-color");
  loginUserNameInput.classList.add("change-border-color");
});

loginPasswordInput.addEventListener("focus", function () {
  passwordLabel.classList.add("move-up");
  passwordLabel.classList.add("change-text-color");
  loginPasswordInput.classList.add("change-border-color");
});

signUpUserNameInput.addEventListener("focus", function () {
  userNameLabelSignUp.classList.add("move-up");
  userNameLabelSignUp.classList.add("change-text-color");
  signUpUserNameInput.classList.add("change-border-color");
});
signUpPasswordInput.addEventListener("focus", function () {
  passwordLabelSignUp.classList.add("move-up");
  passwordLabelSignUp.classList.add("change-text-color");
  signUpPasswordInput.classList.add("change-border-color");
});

const forgotPasswordEmailInput = document.querySelector(
  "#forgot-password-email-input"
);

forgotPasswordEmailInput.addEventListener("focus", function () {
  document.querySelector(".forgot-password-label").classList.add("move-up");
  document
    .querySelector(".forgot-password-label")
    .classList.add("change-text-color");
});

const swapThemeButton = document.querySelector(".swap-theme-button");

swapThemeButton.addEventListener("click", function () {
  document.querySelector("body").classList.toggle("dark");
});

// Password show hide
const eyeToggles = document.querySelectorAll(".eye-icon");
const eyeIconLogin = document.querySelector("#eye-icon-login");
const eyeSlashIconLogin = document.querySelector("#eye-slash-icon-login");

eyeToggles.forEach((eyeToggle) => {
  eyeToggle.addEventListener("click", function () {
    if (loginPasswordInput.type === "password") {
      loginPasswordInput.setAttribute("type", "text");
      eyeIconLogin.classList.add("hide");
      eyeSlashIconLogin.classList.add("show");
    } else {
      loginPasswordInput.setAttribute("type", "password");
      eyeIconLogin.classList.remove("hide");
      eyeSlashIconLogin.classList.remove("show");
    }
  });
});

const eyeIconSignUp = document.querySelector("#eye-icon-sign-up");
const eyeIconSlashSignUp = document.querySelector("#eye-slash-icon-sign-up");
const eyeTogglesSignUp = document.querySelectorAll(".eye-icon-signup");
eyeTogglesSignUp.forEach((eyeToggle) => {
  eyeToggle.addEventListener("click", function () {
    if (signUpPasswordInput.type === "password") {
      signUpPasswordInput.setAttribute("type", "text");
      eyeIconSignUp.classList.add("hide");
      eyeIconSlashSignUp.classList.add("show");
    } else {
      signUpPasswordInput.setAttribute("type", "password");
      eyeIconSignUp.classList.remove("hide");
      eyeIconSlashSignUp.classList.remove("show");
    }
  });
});

// Forgot password

const forgotPasswordButton = document.querySelector("#forgot-password-button");
const forgotPasswordSection = document.querySelector(".forgot-password");
const returnToLoginButton = document.querySelector("#return-to-login");

forgotPasswordButton.addEventListener("click", function () {
  loginSection.classList.add("hide");
  forgotPasswordSection.classList.add("show-flex");
});

returnToLoginButton.addEventListener("click", function () {
  loginSection.classList.remove("hide");
  forgotPasswordSection.classList.remove("show-flex");
});

const submitForgotPasswordEmail = document.querySelector(
  "#submit-forgot-password-email"
);

submitForgotPasswordEmail.addEventListener("click", async function (e) {
  e.preventDefault()
  var properEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  var properEmailTest = properEmail.test(forgotPasswordEmailInput.value);

  if(properEmailTest) {
    document.querySelector('.reset-password-fail').classList.remove('show')

    document.querySelector('.reset-password-success').classList.add('show')
    const res = await fetch("/forget-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: forgotPasswordEmailInput.value,
      }),
    });
  }else {
    document.querySelector('.reset-password-fail').classList.add('show')

  }


});

// Remember me logic

const allTheButtons = document.querySelectorAll("button");



allTheButtons.forEach((button) => {
  button.addEventListener("click", function () {
    if (
      button.classList.contains("submit-spent-money") ||
      button.classList.contains("reset-button")
    ) {
      if (
        localStorage.getItem("total-have") !== null &&
        localStorage.getItem("total-spend") !== null
      ) {
        localStorage.setItem("total-have", monthlyAllowance);
        localStorage.setItem("total-spend", totalSpentMoney);
        localStorage.setItem("token", sessionStorage.getItem("token"));
        localStorage.setItem(
          "refreshToken",
          sessionStorage.getItem("refreshToken")
        );
      } else {
      }
    } else {
    }
  });
});

const signOutButton = document.querySelector(".sign-out-button");

signOutButton.addEventListener("click", async function () {
  localStorage.clear();
  location.reload();
  rememberMe = false;
});

// const changePasswordSubmit = document.querySelector('#change-password-button')

// changePasswordSubmit.addEventListener('click', async function () {
//   const url = getCurrentURL()
//   // const res = await fetch("/", {
//   //   method: "POST",
//   //   headers: { "Content-Type": "application/json" },
//   //   body: JSON.stringify({
//   //     email: forgotPasswordEmailInput.value
//   //   }),
//   // })
// })
