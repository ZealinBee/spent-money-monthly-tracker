  document.addEventListener("DOMContentLoaded", loadLocalStorage)

  //Imports
  import numberOfDaysInAMonth from "./daysCount.js";


  //Editable variables
  let totalSpentMoney = 0;
  let monthlyAllowance = 0;
  let dailyAllowance = 0;
  let totalDaysUsed = 0;
  let currentDay = 0

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
  const resetButton = document.querySelector('.reset-button')

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
    localStorage.setItem("local-monthly-allowance", monthlyAllowance);
    totalMonthlyAllowanceSpan.textContent = localStorage.getItem("local-monthly-allowance");
    dailyAllowance = (monthlyAllowance / numberOfDaysInAMonth).toFixed(2);
    localStorage.setItem("local-daily-allowance", dailyAllowance)
    dailyAllowanceSpan.textContent = localStorage.getItem("local-daily-allowance");
  };

  const submitSpentMoneyHandler = () => {
    parseInt(totalSpentMoney)
    totalSpentMoney += Number(spentMoneyInput.value);
    spentMoneyInput.value = "";
    localStorage.setItem("local-total-spent-money", totalSpentMoney)
    totalSpentMoneySpan.textContent = totalSpentMoney;
    totalDaysUsed = totalSpentMoney / dailyAllowance;
    localStorage.setItem('local-total-days-used', totalDaysUsed)
    totalDaysUsedSpan.textContent = totalDaysUsed.toFixed(0);
    if (totalDaysUsed > numberOfDaysInAMonth) {
      warning.textContent = `Bruh, you have exceeded the monthly allowance by ${(
        totalDaysUsed - numberOfDaysInAMonth
      ).toFixed(0)} day(s)`;
    }
    calendar.removeAllEvents()
    currentDay = 0;
    for (let i = 0; i < totalDaysUsed.toFixed(0); i++) {
      currentDay += 1;
      if(currentDay < 10) {
        currentDay = `0${currentDay}`
      }
      calendar.addEvent({
        title: 'day used!', 
        start: `2022-12-${currentDay}`,
        end: `2022-12-${currentDay}`,
      });
      currentDay = i + 1;
    }

    localStorage.setItem("local-calendar", calendar)
    
  };

  function loadLocalStorage() {
    monthlyAllowance = localStorage.getItem("local-monthly-allowance")
    monthlyAllowance =parseInt(monthlyAllowance) 

    totalMonthlyAllowanceSpan.textContent = monthlyAllowance;
    dailyAllowance = localStorage.getItem("local-daily-allowance")
    dailyAllowance = parseInt(dailyAllowance)
    dailyAllowanceSpan.textContent = dailyAllowance;
    totalSpentMoney = localStorage.getItem('local-total-spent-money')
    totalDaysUsed = parseInt(totalSpentMoney) 
    totalSpentMoneySpan.textContent= totalSpentMoney
    totalDaysUsed = localStorage.getItem('local-total-days-used')
    totalDaysUsed = parseInt(totalDaysUsed) 

    totalDaysUsedSpan.textContent = totalDaysUsed.toFixed(0)
    
  }

  const resetStorage = () => {
    localStorage.clear()
    loadLocalStorage()
  }

  //Events
  submitMonthlyMoney.addEventListener("click", submitMonthlyMoneyHandler);
  submitSpentMoney.addEventListener("click", submitSpentMoneyHandler);
  resetButton.addEventListener('click', resetStorage)