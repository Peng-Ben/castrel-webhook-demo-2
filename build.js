const fs = require('fs');
const path = require('path');

console.log("🚀 开始构建项目...");

// --- 💣 注入典型前端构建错误：找不到 index.html ---
const entryFile = 'index.html';

if (!fs.existsSync(entryFile)) {
    throw new Error(`🚨 构建失败：入口文件 "${entryFile}" 未找到！请确保它存在于项目根目录。`);
}
// ----------------------------------------------------

// 模拟构建过程：
// 1. 定义输出目录名称 (Vercel 默认找 public)
const outputDir = 'public';

// 2. 如果目录不存在，创建它
if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir);
}

// 3. 将 index.html 复制到 public 文件夹里
fs.copyFileSync(entryFile, path.join(outputDir, 'index.html'));

console.log(`✅ 构建成功！文件已复制到 ${outputDir} 目录`);