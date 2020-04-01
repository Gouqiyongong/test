/**
 * initialize your data structure here.
 */
var MedianFinder = function() {
  this.data = [];
};

/** 
 * @param {number} num
 * @return {void}
 */
MedianFinder.prototype.addNum = function(num) {
  if (!this.data.length || this.data[this.data.length - 1] < num) {
    this.data.push(num);
    return;
  }
  if (num <= this.data[0]) {
    this.data.unshift(num);
    return;
  }
  let start = 0,
      end = this.data.length - 1;
  while (start < end) {
    let middle = (start + end) >> 1;
    if (this.data[middle] >= num) {
      end = middle;
    } else {
      start = middle + 1
    }
  }
  this.data.splice(end, 0, num);
};

/**
 * @return {number}
 */
MedianFinder.prototype.findMedian = function() {
  console.log(JSON.stringify(this.data));
  let len = this.data.length;
  let middle = len / 2;
  if (len % 2 === 0) {
    return parseFloat((this.data[middle] + this.data[middle - 1]) / 2);
  }
  return parseFloat(this.data[Math.floor(middle)]);
};

/** 
 * Your MedianFinder object will be instantiated and called as such:
 * var obj = new MedianFinder()
 * obj.addNum(num)
 * var param_2 = obj.findMedian()
 */

const test = new MedianFinder();

const d = ["addNum","findMedian","addNum","findMedian","addNum","findMedian","addNum","findMedian","addNum","findMedian","addNum","findMedian","addNum","findMedian","addNum","findMedian","addNum","findMedian","addNum","findMedian","addNum","findMedian"]
const num = [[6],[],[10],[],[2],[],[6],[],[5],[],[0],[],[6],[],[3],[],[1],[],[0],[],[0],[]];
d.forEach((item, i) => {
  test[item](num[i][0]);
});