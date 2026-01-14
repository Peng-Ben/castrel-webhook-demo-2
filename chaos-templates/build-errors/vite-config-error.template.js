/**
 * @fault-type: vite-config-error
 * @category: build-errors
 * @description: vite.config.js配置错误
 * @expected-error: Invalid configuration
 * @target-file: vite.config.js
 * @severity: high
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 🚨 故障注入：Vite配置错误
// 错误类型：无效的配置选项
// 预期结果：Vite无法启动，构建失败

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    // 🔴 错误：无效的配置选项
    invalidOption: true, // Unknown option
    target: 'invalid-target', // Invalid target
    minify: 'invalid-minifier', // Invalid minifier
  },
  // 🔴 错误：无效的resolve配置
  resolve: {
    alias: {
      '@': 'invalid/path/that/does/not/exist',
    },
  },
  // 🔴 错误：无效的server配置
  server: {
    port: 'not-a-number', // Port must be a number
    strictPort: 'not-a-boolean', // Must be boolean
  },
});

