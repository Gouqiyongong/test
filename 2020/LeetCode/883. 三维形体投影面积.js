/**
 * @param {number[][]} grid
 * @return {number}
 */
var projectionArea = function(grid) {
  if (!grid || !grid.length) {
      return 0;
  }
  var len = grid.length;
  var x = 0,
      y = 0,
      z = 0;
  for (let i = 0; i < len; i++) {
      x += Math.max.apply(null, grid[i]);
      let newArr = [];
      for (let j = 0; j < len; j++) {
          newArr.push(grid[j][i]);
          if (grid[i][j]) {
              z++;
          }
      }
      console.log(newArr);
      console.log(grid[i]);
      y += Math.max.apply(null, newArr);
  }
  console.log(x);
  console.log(y);
  console.log(z);
  return x + y + z;
};

var testArr = [[1,2],[3,4]];

var result = projectionArea(testArr);

console.log(result);