/**
 * @param {number[]} A
 * @return {boolean}
 */
var canThreePartsEqualSum = function(A) {
  let all =  A.reduce((a, b) => a + b);
  const average = all / 3;
  if (Math.ceil(average) !== average) {
      return false;
  }
  const len = A.length;
  let m1 = 0,
      n = 0;
  for (let i = 0; i < len; i++) {
      m1 += A[i];
      if (m1 === average) {
          m1 = 0;
          n++;
      }
  }
  console.log('222', average, m1, n)
  return m1 === 0 && n === 2;
};

const test = [0, 2, 1, -6, 6, -7, 9, 1, 2, 0, 1]
const result = canThreePartsEqualSum(test)
console.log(result)
