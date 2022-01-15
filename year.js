var year = 2000;
if ((year % 4 === 0) && (year % 400 === 0) || (year % 100 === 0)){
    console.log('It is a leap year');
}
else {
    console.log('it is not a leap year');
}
