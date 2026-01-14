/**
 * @fault-type: env-variable-missing
 * @category: build-errors
 * @description: 构建时必需的环境变量缺失
 * @expected-error: Environment variable is not defined
 * @target-file: vite.config.js
 * @severity: medium
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 🚨 故障注入：环境变量缺失
// 错误类型：必需的环境变量未定义
// 预期结果：构建失败

// 🔴 错误：使用未定义的环境变量
const requiredApiUrl = process.env.VITE_REQUIRED_API_URL;
if (!requiredApiUrl) {
  throw new Error('Environment variable VITE_REQUIRED_API_URL is not defined');
}

// 🔴 错误：使用未定义的环境变量
const requiredKey = process.env.VITE_REQUIRED_KEY;
if (!requiredKey) {
  throw new Error('Environment variable VITE_REQUIRED_KEY is not defined');
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
  },
  define: {
    'process.env.VITE_API_URL': JSON.stringify(requiredApiUrl),
    'process.env.VITE_KEY': JSON.stringify(requiredKey),
  },
});

