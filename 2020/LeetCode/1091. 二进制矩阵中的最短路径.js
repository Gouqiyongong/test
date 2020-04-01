/**
 * @param {number[][]} grid
 * @return {number}
 */
var shortestPathBinaryMatrix = function(grid) {
  if (!grid || !grid[0] || grid[0][0]) {
    return -1
  }
  let len = grid.length
  let queue = []
  let num = 1
  queue.push([0, 0])
  grid[0][0] = 1
  while (queue.length) {
    let nowLen = queue.length
    for (let z = 0; z < nowLen; z++) {
      let [j, i] = queue[z]
      if (j === len - 1 && i === len - 1) return num
      if (j < len - 1) {
        if (grid[j + 1][i] === 0) {
          queue.push([j + 1, i])
          grid[j + 1][i] = 1
        }
        if (i < len - 1 && grid[j + 1][i + 1] === 0) {
          queue.push([j + 1, i + 1]), (grid[j + 1][i + 1] = 1)
        }
        if (i > 0 && grid[j + 1][i - 1] === 0) {
          queue.push([j + 1, i - 1]), (grid[j + 1][i - 1] = 1)
        }
      }
      if (i < len - 1 && grid[j][i + 1] === 0) {
        queue.push([j, i + 1]), (grid[j][i + 1] = 1)
      }
      if (i > 0 && grid[j][i - 1] === 0) {
        queue.push([j, i - 1]), (grid[j][i - 1] = 1)
      }
      if (j > 0) {
        if (grid[j - 1][i] === 0) {
          queue.push([j - 1, i])
          grid[j - 1][i] = 1
        }
        if (i < len - 1 && grid[j - 1][i + 1] === 0) {
          queue.push([j - 1, i + 1])
          grid[j - 1][i + 1] = 1
        }
        if (i > 0 && grid[j - 1][i - 1] === 0) {
          queue.push([j - 1, i - 1])
          grid[j - 1][i - 1] = 1
        }
      }
    }
    num += 1
    queue.splice(0, nowLen)
  }
  return -1
}

const test = [
  [1, 0, 0],
  [1, 1, 0],
  [1, 1, 0]
]
const result = shortestPathBinaryMatrix(test)
console.log(result)
