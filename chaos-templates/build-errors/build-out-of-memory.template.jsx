/**
 * @fault-type: build-out-of-memory
 * @category: build-errors
 * @description: 构建过程中内存不足
 * @expected-error: JavaScript heap out of memory
 * @target-file: src/utils/largeData.js
 * @severity: high
 */

// 🚨 故障注入：构建内存溢出
// 错误类型：生成超大数据导致内存不足
// 预期结果：构建过程中内存溢出

/**
 * 生成超大数据集
 * 这会在构建时消耗大量内存
 */
export const generateLargeDataset = () => {
  const data = [];
  
  // 🔴 错误：生成超大数组（10M个元素）
  for (let i = 0; i < 10000000; i++) {
    data.push({
      id: i,
      name: `Item ${i}`,
      description: `This is a very long description for item ${i}`.repeat(100),
      metadata: {
        created: new Date().toISOString(),
        tags: Array(1000).fill(`tag-${i}`),
        properties: Object.fromEntries(
          Array(1000).fill(0).map((_, j) => [`prop${j}`, `value${j}`])
        ),
      },
      // 嵌套大量数据
      nested: {
        level1: {
          level2: {
            level3: {
              data: Array(10000).fill(`nested-data-${i}`),
            },
          },
        },
      },
    });
  }
  
  return data;
};

// 🔴 错误：在模块加载时就生成数据
export const LARGE_CONSTANT_DATA = generateLargeDataset();

// 🔴 错误：生成超大字符串
export const HUGE_STRING = 'x'.repeat(100000000);

// 🔴 错误：创建大量对象
export const MANY_OBJECTS = Array(1000000).fill(0).map((_, i) => ({
  id: i,
  data: Array(1000).fill(`data-${i}`),
}));

/**
 * 递归函数导致栈溢出
 */
export function recursiveFunction(n = 1000000) {
  if (n <= 0) return 0;
  return n + recursiveFunction(n - 1);
}

// 🔴 错误：在模块加载时执行递归
export const RECURSIVE_RESULT = recursiveFunction();

