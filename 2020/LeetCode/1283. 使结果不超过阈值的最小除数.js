/**
 * @param {number[]} nums
 * @param {number} threshold
 * @return {number}
 */
var smallestDivisor = function(nums, threshold) {
  let l = 0,
      r = Math.max(...nums),
      len = nums.length;
  while(l < r) {
      let m = (l + r) >> 1;
      let all = 0;
      for (let i = 0; i < len; i++) {
          all += Math.ceil(nums[i] / m);
      }
      if (all > threshold) {
          l = m + 1;
      } else {
          r = m;
      }
  }
  return l;
};

const nums = [91,41,78,86,8],
      a = 114;
const result = smallestDivisor(nums, a);
console.log(result);