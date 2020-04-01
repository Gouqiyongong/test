/**
 * @param {string} s
 * @return {number}
 */
var numberOfSubstrings = function(s) {
  let arr = s.split(''),
      len = s.length;
  let obj = {
    a: 0,
    b: 0,
    c: 0
  };
  let num = 0,
  l = 0,
  r = 0;
  while (r < len) {
    obj[arr[r]]++;
    while (obj.a > 0 && obj.b > 0 && obj.c > 0) {
      num += len - r;
      obj[arr[l]]--;
      l++;
    }
    r++;
  }
  return num;
};

const test = "abcabc";
const result = numberOfSubstrings(test);
console.log(result);