/**
 * @param {number[]} quality
 * @param {number[]} wage
 * @param {number} K
 * @return {number}
 */
// var mincostToHireWorkers = function(quality, wage, K) {
//   let workers = []
//   for (let i = 0; i < quality.length; i++) {
//     workers[i] = [wage[i] / quality[i], quality[i]]
//   }
//   let minMoney = Infinity
//   let total = 0
//   let singleDog = []
//   workers.sort(function(a, b) {
//     return a[0] - b[0]
//   })
//   console.log(JSON.stringify(workers))
//   for (let i = 0; i < quality.length; i++) {
//     total += workers[i][1]
//     singleDog.push(workers[i])
//     if (singleDog.length === K) {
//       let txt = 0
//       singleDog.forEach(function(value) {
//         txt = Math.max(txt, value[0])
//       }) //用forEach在quality中取最大值，就不用排序了
//       minMoney = Math.min(minMoney, txt * total)
//       // singleDog.sort(function (a, b) { return a[1] - b[1] });//用排序来寻找最大值效率低
//       total -= singleDog.splice(myArray(singleDog), 1)[0][1] //这样写其实容易造成下一轮加进来的工人工作质量比这一轮移除的工人工作质量的要高的情况，不过也没报错
//       //尝试用forEach做，还是比for慢一些
//       // txt = 0;
//       // let maxV = -Infinity;
//       // singleDog.forEach(function (value, index) {
//       //   if (value[1] > maxV) {
//       //     txt = index; maxV = value[1]
//       //     return txt
//       //   }
//       // })
//       // total -= singleDog.splice(txt, 1)[0][1];
//     }
//   }
//   return minMoney
// }
// let myArray = function(singleDog) {
//   let max = -Infinity
//   for (let j = 0; j < singleDog.length; j++) {
//     if (singleDog[j][1] > max) {
//       max = singleDog[j][1]
//       var len = j
//     }
//   }
//   return len
// }

const quality = [3, 1, 10, 10, 1],
  wage = [4, 8, 2, 2, 7],
  K = 3

const result = mincostToHireWorkers(quality, wage, K)
console.log(result)

/**
 * @param {number[]} quality
 * @param {number[]} wage
 * @param {number} K
 * @return {number}
 */
var mincostToHireWorkers = function(quality, wage, K) {
  let len = quality.length;
  if (K > len) {
      return -1;
  }
  let workers = quality.map((item, index) => {
      return [wage[index] / item, item];
  }).sort((a, b) => a[0] - b[0] > 0 ? -1 : 1);

  let min = Infinity,
      arr = [],
      total = 0;
  for (let i = 0; i < len; i++) {
      total += workers[i][1];
      arr.push(workers[i]);
      if (arr.length >= 3) {
          const m = Math.max(...arr.map(i => i[0]));
          min = Math.min(min, m * total);
          let maxQ = 0;
          arr.forEach((item, index) => {
              if (item[1] > arr[maxQ][1]) {
                  maxQ = index;
              }
          });
          total -= arr.splice(maxQ, 1)[0][1];
      }
  }
};