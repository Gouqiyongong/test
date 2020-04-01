/**
 * @param {number} n
 * @param {number} k
 * @return {string}
 */
var getPermutation = function(n, k) {
  let arr = [];
  for (let m = 1; m <= n; m++) {
    arr.push(m);
  }
  let res = '';
  let factorial = (a) => {
    let r = 1;
    for (; a > 0; a--) {
      r *= a;
    }
    return r;
  }
  while (arr.length) {
    let num;
    let d = factorial (arr.length - 1);
    num = Math.ceil(k / d) - 1;
    res += arr.splice(num, 1);
    k -= num * d;
  }
  return res;
};

const n = 4, k = 9;
const result = getPermutation(n, k);
console.log(result);