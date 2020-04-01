/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
var intersection = function(nums1, nums2) {
    const n = new Set(nums1);
    return Array.from(new Set(nums2.filter(i => n.has(i))));
};