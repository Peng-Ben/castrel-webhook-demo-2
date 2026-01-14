#!/usr/bin/env node

/**
 * Vercel部署诊断工具
 * 用于检查项目配置是否正确
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(filePath, description) {
  const fullPath = path.resolve(projectRoot, filePath);
  const exists = fs.existsSync(fullPath);
  if (exists) {
    log(`✅ ${description}: ${filePath}`, 'green');
    return true;
  } else {
    log(`❌ ${description}不存在: ${filePath}`, 'red');
    return false;
  }
}

function checkJSON(filePath, checks) {
  try {
    const fullPath = path.resolve(projectRoot, filePath);
    const content = fs.readFileSync(fullPath, 'utf8');
    const json = JSON.parse(content);
    
    let allPassed = true;
    checks.forEach(({ path: checkPath, expected, description }) => {
      const value = checkPath.split('.').reduce((obj, key) => obj?.[key], json);
      const passed = expected ? value === expected : value !== undefined;
      
      if (passed) {
        log(`  ✅ ${description}`, 'green');
      } else {
        log(`  ❌ ${description}`, 'red');
        log(`     期望: ${expected || '存在'}, 实际: ${value || '不存在'}`, 'yellow');
        allPassed = false;
      }
    });
    
    return allPassed;
  } catch (error) {
    log(`  ❌ 解析失败: ${error.message}`, 'red');
    return false;
  }
}

console.log('\n' + '='.repeat(60));
log('🔍 Vercel部署诊断工具', 'bold');
console.log('='.repeat(60) + '\n');

// 1. 检查必需文件
log('📁 检查必需文件...', 'blue');
const hasPackageJson = checkFile('package.json', 'package.json');
const hasVercelJson = checkFile('vercel.json', 'vercel.json');
const hasViteConfig = checkFile('vite.config.js', 'vite.config.js');
const hasIndexHtml = checkFile('index.html', 'index.html');
const hasSrcMain = checkFile('src/main.jsx', 'src/main.jsx');
console.log();

// 2. 检查package.json
log('📦 检查 package.json...', 'blue');
checkJSON('package.json', [
  { path: 'scripts.build', description: 'build脚本存在' },
  { path: 'scripts.dev', description: 'dev脚本存在' },
  { path: 'dependencies.react', description: 'React依赖存在' },
  { path: 'dependencies.react-router-dom', description: 'React Router依赖存在' },
]);
console.log();

// 3. 检查vercel.json
log('⚙️  检查 vercel.json...', 'blue');
const vercelConfig = JSON.parse(fs.readFileSync(path.resolve(projectRoot, 'vercel.json'), 'utf8'));
log(`  ℹ️  配置内容:`, 'blue');
console.log(JSON.stringify(vercelConfig, null, 2));

// 检查关键配置
if (vercelConfig.routes) {
  const hasFilesystemHandler = vercelConfig.routes.some(r => r.handle === 'filesystem');
  const hasCatchAllRoute = vercelConfig.routes.some(r => r.src === '/(.*)' || r.src === '/(.*).html');
  
  if (hasFilesystemHandler) {
    log(`  ✅ 包含 filesystem handler`, 'green');
  } else {
    log(`  ⚠️  缺少 filesystem handler（可能导致静态资源加载失败）`, 'yellow');
  }
  
  if (hasCatchAllRoute) {
    log(`  ✅ 包含 catch-all 路由`, 'green');
  } else {
    log(`  ❌ 缺少 catch-all 路由（SPA路由将无法工作）`, 'red');
  }
}
console.log();

// 4. 检查vite.config.js
log('⚡ 检查 vite.config.js...', 'blue');
const viteConfig = fs.readFileSync(path.resolve(projectRoot, 'vite.config.js'), 'utf8');
if (viteConfig.includes("base: '/'") || viteConfig.includes('base:"/"')) {
  log(`  ✅ base配置正确`, 'green');
} else {
  log(`  ⚠️  未找到 base: '/' 配置`, 'yellow');
}

if (viteConfig.includes("outDir: 'dist'") || viteConfig.includes('outDir:"dist"')) {
  log(`  ✅ outDir配置正确`, 'green');
} else {
  log(`  ⚠️  未找到 outDir: 'dist' 配置`, 'yellow');
}
console.log();

// 5. 检查构建产物
log('🏗️  检查构建产物...', 'blue');
const distPath = path.resolve(projectRoot, 'dist');
const distExists = fs.existsSync(distPath);
if (distExists) {
  log(`  ✅ dist目录存在`, 'green');
  
  const distIndexPath = path.resolve(projectRoot, 'dist/index.html');
  const distAssetsPath = path.resolve(projectRoot, 'dist/assets');
  const distIndexExists = fs.existsSync(distIndexPath);
  const distAssetsExists = fs.existsSync(distAssetsPath);
  
  if (distIndexExists) {
    log(`  ✅ dist/index.html存在`, 'green');
    
    // 检查index.html内容
    const distIndexContent = fs.readFileSync(distIndexPath, 'utf8');
    if (distIndexContent.includes('<div id="root">')) {
      log(`  ✅ index.html包含root元素`, 'green');
    }
    if (distIndexContent.includes('type="module"')) {
      log(`  ✅ index.html包含模块脚本`, 'green');
    }
  } else {
    log(`  ❌ dist/index.html不存在`, 'red');
  }
  
  if (distAssetsExists) {
    log(`  ✅ dist/assets目录存在`, 'green');
    const assets = fs.readdirSync(distAssetsPath);
    log(`  ℹ️  资源文件数量: ${assets.length}`, 'blue');
  } else {
    log(`  ❌ dist/assets目录不存在`, 'red');
  }
} else {
  log(`  ⚠️  dist目录不存在（请先运行 npm run build）`, 'yellow');
}
console.log();

// 6. 检查路由配置
log('🛣️  检查路由配置...', 'blue');
const appContent = fs.readFileSync(path.resolve(projectRoot, 'src/App.jsx'), 'utf8');
if (appContent.includes('BrowserRouter')) {
  log(`  ✅ 使用 BrowserRouter`, 'green');
  log(`  ℹ️  需要确保Vercel配置正确以支持SPA路由`, 'blue');
} else if (appContent.includes('HashRouter')) {
  log(`  ⚠️  使用 HashRouter（URL会包含#号）`, 'yellow');
} else {
  log(`  ❌ 未找到Router配置`, 'red');
}
console.log();

// 7. 总结和建议
console.log('='.repeat(60));
log('📋 诊断总结', 'bold');
console.log('='.repeat(60));

if (hasPackageJson && hasVercelJson && hasViteConfig && distExists) {
  log('\n✅ 基本配置正确！', 'green');
  log('\n📝 下一步操作:', 'blue');
  log('  1. 提交更改: git add . && git commit -m "fix: update Vercel config"', 'reset');
  log('  2. 推送代码: git push origin main', 'reset');
  log('  3. 等待Vercel自动部署', 'reset');
  log('  4. 测试部署结果', 'reset');
} else {
  log('\n⚠️  发现一些问题，请按照上述提示修复', 'yellow');
}

log('\n💡 如果部署后仍然空白，请检查:', 'blue');
log('  1. 浏览器开发者工具 Console（F12）', 'reset');
log('  2. Network标签，查看资源加载状态', 'reset');
log('  3. Vercel部署日志', 'reset');
log('  4. 本地运行 npm run preview 测试构建产物', 'reset');

log('\n📚 详细文档: VERCEL_DEPLOYMENT_GUIDE.md\n', 'blue');

