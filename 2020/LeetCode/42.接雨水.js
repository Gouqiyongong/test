/**
 * @param {number[]} height
 * @return {number}
 */
var trap = function(height) {
  var start = -1,
    end = -1,
    canGet = false,
    waterNum = 0,
    len = height.length,
    max = 0
  for (let i = 0; i < len; i++) {
    if (height[i] > max) {
      max = height[i]
    } 
    if (height[i] > 0 && end === -1 && start === -1) {
      start = i
    }
    if (height[i] >= height[start] && !canGet) {
      start = i
      continue
    }
    if (i > start && height[i] < height[start]) {
      canGet = true
      continue
    }
    if (i > start && height[i] >= height[start] && canGet) {
      canGet = false
      end = i
      for (let j = start; j < end; j++) {
        waterNum += height[start] - height[j]
      }
      console.log('start&end', start, end)
      console.log('water', waterNum)
      start = end
    }
  }
  end = len
  start = len
  for (let i = len - 1; i >= 0; i--) {
    if (height[i] > 0 && end === len && start === len) {
      start = i
      if (height[i] == max) {
        break;
      }
    }
    if (height[i] >= height[start] && !canGet) {
      start = i
      if (height[i] == max) {
        break;
      }
      continue
    }
    if (i < start && height[i] < height[start]) {
      canGet = true
      continue
    }
    if (i < start && height[i] >= height[start] && canGet) {
      canGet = false
      end = i
      for (let j = start; j > end; j--) {
        waterNum += height[start] - height[j]
      }
      start = end
      if (height[i] == max) {
        break;
      }
    }
  }
  return waterNum
}

const test = [4,2,5,4,9,5,4,0,8,2,1,0,3,2,2,9,0];
var result = trap(test);
console.log('result', result);