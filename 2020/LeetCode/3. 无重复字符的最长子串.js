/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(S) {
  // const len = s.length
  // if (!len) {
  //   return 0
  // }
  // if (len === 1) {
  //   return 1
  // }
  // let arr = s.split(''),
  //   result = '',
  //   max = 0;
  // for (let i = 0; i < len; i++) {
  //   result = arr[i]
  //   for (let j = i + 1; j < len; j++) {
  //     if (!result.includes(arr[j])) {
  //       result += arr[j]
  //       continue
  //     }
  //     break
  //   }
  //   if (result.length > max) {
  //     max = result.length;
  //   }
  // }
  // return max
  let s = S.split('');
  let size,
    i = 0,
    j,
    k,
    str = '',
    max = 0;
  size = s.length
  for (j = 0; j < size; j++) {

    for (k = i; k < j; k++)
    if (s[k] == s[j]) {
      i = k + 1
      if (j - i + 1 > max) {
        str = S.substr(k, j);
          max = j - i + 1
      }
        break
      }
  }
  return str
}

const test = "banana"
const result = lengthOfLongestSubstring(test)
console.log(result)
