/**
 * @fault-type: asset-size-exceeded
 * @category: build-errors
 * @description: 打包后的文件超过限制
 * @expected-error: Asset exceeds recommended size limit
 * @target-file: src/utils/heavyAssets.js
 * @severity: medium
 */

// 🚨 故障注入：资源文件过大
// 错误类型：单个文件打包后超过大小限制
// 预期结果：Vite警告或构建失败

/**
 * 超大的静态数据
 * 这会导致打包后的bundle过大
 */

// 🔴 错误：包含超大的Base64图片数据
export const LARGE_IMAGE_DATA = `data:image/png;base64,${'A'.repeat(5000000)}`;

// 🔴 错误：包含大量的静态配置数据
export const MASSIVE_CONFIG = {
  // 生成10000个配置项
  ...Object.fromEntries(
    Array(10000).fill(0).map((_, i) => [
      `config_${i}`,
      {
        id: i,
        name: `Configuration ${i}`,
        description: `This is a very detailed description for configuration ${i}`.repeat(50),
        settings: Object.fromEntries(
          Array(100).fill(0).map((_, j) => [`setting_${j}`, `value_${i}_${j}`])
        ),
        metadata: {
          created: new Date().toISOString(),
          tags: Array(100).fill(`tag-${i}`),
          permissions: Array(100).fill(`permission-${i}`),
        },
      },
    ])
  ),
};

// 🔴 错误：包含大量的翻译数据
export const TRANSLATIONS = {
  en: Object.fromEntries(
    Array(10000).fill(0).map((_, i) => [
      `key_${i}`,
      `This is translation ${i} in English with a very long text`.repeat(20),
    ])
  ),
  zh: Object.fromEntries(
    Array(10000).fill(0).map((_, i) => [
      `key_${i}`,
      `这是第${i}个翻译，包含非常长的文本`.repeat(20),
    ])
  ),
  ja: Object.fromEntries(
    Array(10000).fill(0).map((_, i) => [
      `key_${i}`,
      `これは翻訳${i}で、非常に長いテキストが含まれています`.repeat(20),
    ])
  ),
};

// 🔴 错误：包含大量的模拟数据
export const MOCK_DATA = Array(50000).fill(0).map((_, i) => ({
  id: i,
  title: `Item ${i}`,
  description: `This is a detailed description for item ${i}`.repeat(30),
  content: `This is the main content for item ${i}`.repeat(100),
  metadata: {
    author: `Author ${i}`,
    created: new Date().toISOString(),
    tags: Array(50).fill(`tag-${i}`),
    categories: Array(20).fill(`category-${i}`),
    comments: Array(100).fill(0).map((_, j) => ({
      id: j,
      text: `Comment ${j} for item ${i}`.repeat(10),
      author: `Commenter ${j}`,
    })),
  },
  relatedItems: Array(100).fill(i),
  statistics: {
    views: i * 1000,
    likes: i * 100,
    shares: i * 10,
    history: Array(365).fill(0).map((_, d) => ({
      date: new Date(Date.now() - d * 86400000).toISOString(),
      views: Math.floor(Math.random() * 1000),
    })),
  },
}));

// 🔴 错误：导入大量第三方库（如果未使用tree-shaking）
// 这会增加bundle大小
export { default as _ } from 'lodash'; // 整个lodash库

