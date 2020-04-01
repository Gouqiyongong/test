/**
 * @param {number[][]} matrix
 * @return {boolean}
 */
var isToeplitzMatrix = function(matrix) {
  let m = matrix.length,
    n = matrix[0].length
  for (let i = 0; i < m; i++) {
    let x = i,
      y = 0,
      val = matrix[x][y]
    while (matrix[x] && matrix[x][y] !== undefined) {
      if (val !== matrix[x][y]) {
        return false
      }
      x++;
      y++;
    }
  }
  for (let i = 0; i < n; i++) {
    let x = 0,
      y = i,
      val = matrix[x][y]
    while (matrix[x] && matrix[x][y] !== undefined) {
      if (val !== matrix[x][y]) {
        return false
      }
      x++;
      y++;
    }
  }
  return true
}

const test = [
  [36, 86, 7, 94, 71, 59, 10],
  [19, 0, 86, 7, 94, 71, 59]
]

const result = isToeplitzMatrix(test)
console.log('result', result)
