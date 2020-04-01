/**
 * @param {number[]} ages
 * @return {number}
 */
var numFriendRequests = function(ages) {
  const arr = new Array(121);
  arr.fill(0);
  ages.forEach(i => arr[i]++);
  let res = 0;
  for (let i = 0; i < 121; i++) {
    if (!arr[i]) {
      continue;
    }
    if (i > 14) {
      res += arr[i] * (arr[i] - 1);
    }
    for (let j = i + 1; j < 121; j++) {
      if (!arr[i]) {
        continue;
      }
      if (!(j <= (0.5 * i + 7) || j > i || j > 100 && i < 100)) {
        res += arr[i] * arr[j];
      }
      if (!(i <= (0.5 * j + 7) || i > j || i > 100 && j < 100)) {
        res += arr[i] * arr[j];
      }
    }
  }
  return res;
};
const test = [16,17,18]
const result = numFriendRequests(test);
console.log('result', result);