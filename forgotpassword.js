const submitNewPasswordButton = document.querySelector("#submit-new-password");

let currentUrl = window.location.href;
let newCurrentUrl = currentUrl.replace("http://localhost:3000", "");

const eyeToggles = document.querySelectorAll(".eye-icon");
const eyeIconLogin = document.querySelector("#eye-icon-login");
const eyeSlashIconLogin = document.querySelector("#eye-slash-icon-login");
const loginPasswordInput = document.querySelector("#new-password-input");

submitNewPasswordButton.addEventListener("click", async function (e) {
  e.preventDefault();
  var re = /\D/;
  var re1 = /\s/;
  var re2 = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  var re3 = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  var n = re.test(loginPasswordInput.value);
  var n1 = !re1.test(loginPasswordInput.value);
  var n2 = re2.test(loginPasswordInput.value);

  if (loginPasswordInput.value.length < 8 || !(n1 && n2 && n)) {
    loginPasswordInput.classList.add("error-login");
  } else {
    const res = await fetch(newCurrentUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: loginPasswordInput.value,
      }),
    });

    document.querySelector(".success-reset").classList.add("show");
    document.querySelector(".password-input-wrapper").classList.add("hide");
  }
});

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

const signUpError = document.querySelector(".sign-up-error");
const letterError = document.querySelector("#letter");
const capitalError = document.querySelector("#uppercase-letter");
const lengthError = document.querySelector("#length");
const numberError = document.querySelector("#number");
const specialCharacterError = document.querySelector("#special-character");
const whiteSpaceError = document.querySelector("#white-space");

loginPasswordInput.addEventListener("input", function () {
  signUpError.style.display = "block";
  var lowerCaseLetters = /[a-z]/g;
  if (loginPasswordInput.value.match(lowerCaseLetters)) {
    letterError.classList.remove("invalid");
    letterError.classList.add("valid");
  } else {
    letterError.classList.remove("valid");
    letterError.classList.add("invalid");
  }
  var upperCaseLetters = /[A-Z]/g;
  if (loginPasswordInput.value.match(upperCaseLetters)) {
    capitalError.classList.remove("invalid");
    capitalError.classList.add("valid");
  } else {
    capitalError.classList.remove("valid");
    capitalError.classList.add("invalid");
  }
  if (loginPasswordInput.value.length >= 8) {
    lengthError.classList.remove("invalid");
    lengthError.classList.add("valid");
  } else {
    lengthError.classList.remove("valid");
    lengthError.classList.add("invalid");
  }
  var numbers = /[0-9]/g;
  if (loginPasswordInput.value.match(numbers)) {
    numberError.classList.remove("invalid");
    numberError.classList.add("valid");
  } else {
    numberError.classList.remove("valid");
    numberError.classList.add("invalid");
  }
  var specialCharacter = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  if (loginPasswordInput.value.match(specialCharacter)) {
    specialCharacterError.classList.remove("invalid");
    specialCharacterError.classList.add("valid");
  } else {
    specialCharacterError.classList.remove("valid");
    specialCharacterError.classList.add("invalid");
  }
  var whiteSpace = /[ \t\n\r]/;
  if (loginPasswordInput.value.match(whiteSpace)) {
    whiteSpaceError.classList.add("invalid");
    whiteSpaceError.classList.remove("valid");
  } else {
    whiteSpaceError.classList.add("valid");
    whiteSpaceError.classList.remove("invalid");
  }
});
