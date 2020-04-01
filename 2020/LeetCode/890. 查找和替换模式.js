/**
 * @param {string[]} words
 * @param {string} pattern
 * @return {string[]}
 */
var findAndReplacePattern = function(words, pattern) {
  const patternArr = [...pattern];
  const len = patternArr.length;
  const resArr = [];
  for (let i = 0; i < words.length; i++) {
      const a = [...words[i]];
      const map = new Map();
      const map1 = new Map();
      let j = 0;
      for (j; j < len; j++) {
          if (!map.has(patternArr[j]) && !map1.has(a[j])) {
              map.set(patternArr[j], a[j]);
              map1.set(a[j], patternArr[j]);
              continue;
          }
          if (map.has(patternArr[j]) && map.get(patternArr[j]) !== a[j] || map1.has(a[j]) && map1.get(a[j]) !== patternArr[j]) {
              break;
          }
      }
      if (j === len) {
          resArr.push(words[i]);
      }
  }
  return resArr;
};