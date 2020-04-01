/**
 * @param {number} N
 * @param {number[][]} trust
 * @return {number}
 */
var findJudge = function(N, trust) {
  if (N === 1 && trust.length === 0) {
    return 1;
  }
  let map = new Map(trust.map(i => [i[1], 0]));
  for (let i = 0; i < trust.length; i++) {
      map.delete(trust[i][0]);
      if(map.has(trust[i][1])) {
        map.set(trust[i][1], map.get(trust[i][1]) + 1);
      }
  }
  if (map.size === 1 && [...map][0][1] === N - 1) {
    return [...map][0][0];
  }
  return -1
};

const test = [], n = 1;
const result = findJudge(n, test);
console.log(result);