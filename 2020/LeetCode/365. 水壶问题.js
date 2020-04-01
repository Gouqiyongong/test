/**
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @return {boolean}
 */
var canMeasureWater = function(x, y, z) {
  if (z === 0) {
    return true
  }
  let min = Math.min(x, y),
    max = Math.max(x, y)
  if (x + y < z) {
    return false;
  }
  if (min === 0) {
    return max === z
  }
  if (max % min === 0) {
    return z % min === 0
  }
  let num = 0
  for (let i = 1; i < min; i++) {
    if (min % i === 0 && max % i === 0) {
      num = i
    }
  }
  return z % num === 0
}

const x = 1,
  y = 1,
  z = 12
const result = canMeasureWater(1, 1, 12)
console.log(result)
