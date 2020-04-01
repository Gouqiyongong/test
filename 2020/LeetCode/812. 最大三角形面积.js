/**
 * @param {number[][]} points
 * @return {number}
 */
var largestTriangleArea = function(points) {
  let max = 0;
  let len = points.length;
  for (let i = 0; i < len - 2; i++) {
      for (let j = i + 1; j < len -1; j++) {
          for (let k = j + 1; k < len; k++) {
              let [x1, y1] = points[i],
                  [x2, y2] = points[j],
                  [x3, y3] = points[k];
              let res = Math.abs((x1 - x3) * (y2 - y3) - (x2 - x3) * (y1 - y3)) / 2;
              if (res > max) {
                  max = res;
              }
          }
      }
  }
  return max;
};

const test = [[0,0],[0,1],[1,0],[0,2],[2,0]];
const result = largestTriangleArea(test);
console.log(result);