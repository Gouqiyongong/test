/**
 * @param {string} equation
 * @return {string}
 */
var solveEquation = function(equation) {
  if (!equation || !equation.includes('=')) {
    return 'No solution';
  }
  const arr = equation.split('=');
  let leftResult = 0,
      rightResult = 0,
      left = arr[0],
      right = arr[1],
      reg = /([+-]?)([0-9x]+)/g;
  let res = left.match(reg);
  res.forEach(item => {
    if (item.endsWith('x')) {
      if (item.length > 2 || item.length === 2 && /^\d/.test(item)) {
        leftResult += Number(item.replace('x', ''));
      } else {
        leftResult += Number(item.replace('x', '1'));
      }
      return
    }
    rightResult -= Number(item);
  });
  console.log(res)
  console.log(leftResult)
  res = right.match(reg);
  res.forEach(item => {
    if (item.endsWith('x')) {
      if (item.length > 2 || item.length === 2 && /^\d/.test(item)) {
        leftResult -= Number(item.replace('x', ''));
      } else {
        leftResult -= Number(item.replace('x', '1'));
      }
      return
    }
    rightResult += Number(item);
  });
  if (leftResult === 0 && rightResult == 0) {
    return 'Infinite solutions';
  }
  if (leftResult === 0 && rightResult !== 0) {
    return 'No solution';
  }
  return 'x' + '=' + Math.floor(rightResult / leftResult);
};

const test = "2x+3x-6x=x+2";
const result = solveEquation(test);
console.log(result);