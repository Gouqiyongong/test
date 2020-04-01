/**
 * @param {string[]} words
 * @return {number}
 */
var minimumLengthEncoding = function(words) {
  // let newWords = words.sort((a, b) => a.length < b.length ? 1 : -1);
  // let n = '';
  // for (let i = 0; i < newWords.length; i++) {
  //   if (n.includes(newWords[i] + '#')) {
  //     continue;
  //   }
  //   n += newWords[i] + '#';
  // }
  // return n.length;
  const set = new Set(words);
  for (let i = 0; i < words.length; i++) {
    for (let j = 1; j < words[i].length; j++) {
      set.delete(words[i].substr(j));
    }
  }
  let n = 0;
  set.forEach(i => n += i.length + 1);
  return n;
};

const test = ["t"];
const result = minimumLengthEncoding(test);
console.log('result', result);