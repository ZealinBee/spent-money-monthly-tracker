const submitNewPasswordButton = document.querySelector("#submit-new-password");

let currentUrl = window.location.href
let newCurrentUrl = currentUrl.replace("http://localhost:3000", "")

submitNewPasswordButton.addEventListener("click", async function (e) {
    e.preventDefault()
    const res = await fetch(newCurrentUrl, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"},
        body: JSON.stringify({
            password: document.querySelector('#new-password-input').value
        })
    })
    
    document.querySelector(".success-reset").classList.add('show')
    document.querySelector(".password-input-wrapper").classList.add('hide')

});

const eyeToggles = document.querySelectorAll(".eye-icon");
const eyeIconLogin = document.querySelector("#eye-icon-login");
const eyeSlashIconLogin = document.querySelector("#eye-slash-icon-login");
const loginPasswordInput = document.querySelector("#new-password-input");

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
