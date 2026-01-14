#!/usr/bin/env node

/**
 * 自动化测试所有故障类型的注入功能
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// 所有故障类型
const faultTypes = [
  // 语法编译错误
  'syntax-error',
  'import-error',
  'typescript-error',
  'undefined-variable',
  // 依赖配置错误
  'dependency-missing',
  'dependency-version-conflict',
  'env-variable-missing',
  'vite-config-error',
  // 资源打包错误
  'css-syntax-error',
  'circular-dependency',
  'build-out-of-memory',
  'asset-size-exceeded',
];

const results = {
  success: [],
  failed: [],
  total: faultTypes.length,
};

console.log('\n🧪 开始测试所有故障类型注入功能...\n');
console.log('=' .repeat(60));

for (const faultType of faultTypes) {
  console.log(`\n📝 测试: ${faultType}`);
  console.log('-'.repeat(60));
  
  try {
    // 测试注入
    console.log('  ⏳ 注入故障...');
    execSync(`node scripts/chaos-cli.js inject --type ${faultType}`, {
      cwd: process.cwd(),
      stdio: 'pipe',
    });
    
    // 检查是否有文件变更
    const gitStatus = execSync('git status --porcelain', {
      cwd: process.cwd(),
      encoding: 'utf-8',
    });
    
    if (gitStatus.trim()) {
      console.log('  ✅ 注入成功 - 检测到文件变更');
      results.success.push(faultType);
      
      // 显示变更的文件
      const changedFiles = gitStatus.trim().split('\n').map(line => line.trim());
      console.log(`  📁 变更文件: ${changedFiles.length} 个`);
      changedFiles.forEach(file => {
        console.log(`     ${file}`);
      });
    } else {
      console.log('  ⚠️  警告 - 未检测到文件变更');
      results.failed.push({ type: faultType, reason: '未检测到文件变更' });
    }
    
    // 恢复
    console.log('  ⏳ 恢复正常状态...');
    
    // 检查是否有备份
    const backupDir = path.join(process.cwd(), '.chaos-backup');
    if (fs.existsSync(backupDir)) {
      execSync('node scripts/chaos-cli.js restore', {
        cwd: process.cwd(),
        input: 'y\n',
        stdio: 'pipe',
      });
      console.log('  ✅ 恢复成功');
    } else {
      console.log('  ⚠️  无需恢复（无备份）');
    }
    
  } catch (error) {
    console.log(`  ❌ 测试失败`);
    console.log(`  错误: ${error.message}`);
    results.failed.push({ 
      type: faultType, 
      reason: error.message.split('\n')[0] 
    });
  }
}

// 生成测试报告
console.log('\n');
console.log('='.repeat(60));
console.log('\n📊 测试报告\n');
console.log('='.repeat(60));

console.log(`\n✅ 成功: ${results.success.length}/${results.total}`);
if (results.success.length > 0) {
  results.success.forEach((type, index) => {
    console.log(`   ${index + 1}. ${type}`);
  });
}

if (results.failed.length > 0) {
  console.log(`\n❌ 失败: ${results.failed.length}/${results.total}`);
  results.failed.forEach((item, index) => {
    console.log(`   ${index + 1}. ${item.type}`);
    console.log(`      原因: ${item.reason}`);
  });
}

const successRate = ((results.success.length / results.total) * 100).toFixed(1);
console.log(`\n📈 成功率: ${successRate}%`);

// 保存测试报告
const report = {
  timestamp: new Date().toISOString(),
  total: results.total,
  success: results.success.length,
  failed: results.failed.length,
  successRate: `${successRate}%`,
  details: {
    success: results.success,
    failed: results.failed,
  },
};

const reportPath = path.join(process.cwd(), 'test-results.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`\n💾 测试报告已保存: ${reportPath}`);

console.log('\n' + '='.repeat(60));

// 退出码
process.exit(results.failed.length > 0 ? 1 : 0);

