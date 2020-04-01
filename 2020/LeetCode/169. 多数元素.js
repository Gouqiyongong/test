/**
 * @param {number[]} nums
 * @return {number}
 */
var majorityElement = function(nums) {
  let obj = {};
  for (let i = 0; i < nums.length; i++) {
      if (!obj[nums[i]]) {
          obj[nums[i]] = 1;
      } else {
          obj[nums[i]] += 1;
      }
      if (obj[nums[i]] >= nums.length / 2) {
          return nums[i];
      }
  }
};