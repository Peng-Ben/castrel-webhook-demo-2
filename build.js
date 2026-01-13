const fs = require('fs');
const path = require('path');

console.log("🚀 开始构建项目...");

// --- 💣 故障注入区 💣 ---
// 取消下面这行的注释，即可触发 Vercel 部署失败
throw new Error("🚨 Castrel测试：人为注入的构建错误！");

// -----------------------

// 模拟构建过程：
// 1. 定义输出目录名称 (Vercel 默认找 public)
const outputDir = 'public';

// 2. 如果目录不存在，创建它
if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir);
}

// 3. 将 index.html 复制到 public 文件夹里
// 这样 Vercel 就能在 public 文件夹里找到网页了
fs.copyFileSync('index.html', path.join(outputDir, 'index.html'));


console.log(`✅ 构建成功！文件已复制到 ${outputDir} 目录`);