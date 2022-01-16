const plantNeedsWater = function(day){
  if (day === 'Wednesday'){
    return true;
  }   
  else {
    return false;
  }
} 
console.log(plantNeedsWater('Tuesday'));