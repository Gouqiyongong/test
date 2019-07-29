// import Vue from 'vue'
// import HelloWorld from '@/components/HelloWorld'

const log = console.log;
const sum = require('../../../src/components/sum');
const { parseWithComments } = require('jest-docblock');
const diff = require('jest-diff');


test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});

// jest-docblock
// https://github.com/facebook/jest/blob/master/packages/jest-docblock/README.md
const code = `
/**
 * @flow This is a sample
 * @params string
 */
 console.log('Hello World!');
`;

const parsed = parseWithComments(code);

// prints an object with two attributes: comments and pragmas.
log(parsed);

const a = {a: {b: {c: 5}}};
const b = {a: {b: {c: 6}}};

const result = diff(a, b);

// print diff
log(result);
// 在一个“测试套件”中创建一个将几个相关测试分组在一起的块
describe('这是一个测试块',()=>{
  afterAll(()=>{
    log('我是afterAll，在所有测试项结束后调用');
  });

  afterEach(()=>{
    log('我是afterEach，在每一项测试结束后调用');
  });

  test('测试1',()=>{
    expect(1).toBe(1);
    log('测试1')
  });

  test('测试2',()=>{
    expect(2).toBe(2);
    log('测试2')
  });

  beforeAll(()=>{
    log('我是beforeAll，在所有测试项之前后调用');
  });

  beforeEach(()=>{
    log('我是beforeEach，在每个测试项之前后调用');
  });

});

// 添加匹配器
expect.extend({
  toBeDivisibleBy(received, argument) {
    const pass = received % argument == 0;
    console.log(received,argument)
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be divisible by ${argument}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be divisible by ${argument}`,
        pass: false,
      };
    }
  },
});

test('even and odd numbers', () => {
  expect(100).toBeDivisibleBy(2);
  expect(101).not.toBeDivisibleBy(2);
});

test('resolves to lemon', () => {
  // make sure to add a return statement
  return expect(Promise.resolve('lemon')).resolves.toBe('lemon');
});

