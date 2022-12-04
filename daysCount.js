let currentMonth = new Date().getMonth()
currentMonth += 1
let totalDays = 0;


if(currentMonth === 1 || currentMonth === 3 || currentMonth === 5 || currentMonth === 7 || currentMonth === 8 || currentMonth === 10 || currentMonth === 12) {
    totalDays = 31
}else if(currentMonth === 4 || currentMonth === 6 || currentMonth === 9 || currentMonth === 11) {
    totalDays = 30
}else {
    totalDays = 29
}

export default totalDays
