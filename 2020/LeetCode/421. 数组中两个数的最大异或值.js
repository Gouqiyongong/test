// /**
//  * @param {number[]} nums
//  * @return {number}
//  */
// var findMaximumXOR = function(nums) {
//   let len = nums.length;
//   if (len == 1) {
//     return 0;
//   }
//   if (len == 2) {
//     return nums[0] ^ nums[1];
//   }
//   let max = 0;
//   for (let i = 0; i < len - 1; i++) {
//     for (let j = i + 1; j < len; j++) {
//       let res = nums[i] ^ nums[j];
//       if (res > max) {
//         max = res;
//       }
//     }
//   }
//   return max;
// };

// const test = [3, 10, 5, 25, 2, 8];
// const result = findMaximumXOR(test);
// console.log(result);
const f = () => console.log('now');
(async () => f())();
console.log('next');