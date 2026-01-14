#!/usr/bin/env node

/**
 * 自动化测试所有12种故障类型的注入功能
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 所有12种故障类型
const faultTypes = [
  // 语法编译错误
  { type: 'syntax-error', group: '语法编译错误' },
  { type: 'import-error', group: '语法编译错误' },
  { type: 'typescript-error', group: '语法编译错误' },
  { type: 'undefined-variable', group: '语法编译错误' },
  // 依赖配置错误
  { type: 'dependency-missing', group: '依赖配置错误' },
  { type: 'dependency-version-conflict', group: '依赖配置错误' },
  { type: 'env-variable-missing', group: '依赖配置错误' },
  { type: 'vite-config-error', group: '依赖配置错误' },
  // 资源打包错误
  { type: 'css-syntax-error', group: '资源打包错误' },
  { type: 'circular-dependency', group: '资源打包错误' },
  { type: 'build-out-of-memory', group: '资源打包错误' },
  { type: 'asset-size-exceeded', group: '资源打包错误' },
];

const results = {
  success: [],
  failed: [],
  total: faultTypes.length,
};

console.log('\n🧪 开始测试所有12种故障类型的注入功能\n');
console.log('='.repeat(70));

let currentGroup = '';

for (let i = 0; i < faultTypes.length; i++) {
  const { type, group } = faultTypes[i];
  
  // 显示分组标题
  if (group !== currentGroup) {
    currentGroup = group;
    console.log(`\n\n📦 ${group}`);
    console.log('─'.repeat(70));
  }
  
  console.log(`\n${i + 1}. 测试: ${type}`);
  console.log('   ' + '─'.repeat(66));
  
  try {
    // 步骤1: 注入故障
    console.log('   ⏳ 步骤1: 注入故障...');
    const injectOutput = execSync(
      `node scripts/chaos-cli.js inject --type ${type}`,
      {
        cwd: __dirname,
        encoding: 'utf-8',
        stdio: 'pipe',
      }
    );
    
    // 检查是否成功
    if (injectOutput.includes('✅ 故障注入成功')) {
      console.log('   ✅ 注入成功');
    } else {
      throw new Error('注入输出中未找到成功标记');
    }
    
    // 步骤2: 检查文件变更
    console.log('   ⏳ 步骤2: 检查文件变更...');
    const gitStatus = execSync('git status --porcelain', {
      cwd: __dirname,
      encoding: 'utf-8',
    });
    
    if (gitStatus.trim()) {
      const changedFiles = gitStatus.trim().split('\n');
      console.log(`   ✅ 检测到 ${changedFiles.length} 个文件变更`);
      changedFiles.forEach(file => {
        console.log(`      ${file.trim()}`);
      });
    } else {
      throw new Error('未检测到文件变更');
    }
    
    // 步骤3: 检查备份
    console.log('   ⏳ 步骤3: 检查备份...');
    const backupDir = path.join(__dirname, '.chaos-backup');
    if (fs.existsSync(backupDir)) {
      const metadataPath = path.join(backupDir, 'metadata.json');
      if (fs.existsSync(metadataPath)) {
        const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
        console.log(`   ✅ 备份已创建 (故障类型: ${metadata.faultType})`);
      } else {
        throw new Error('备份元数据文件不存在');
      }
    } else {
      throw new Error('备份目录不存在');
    }
    
    // 步骤4: 恢复
    console.log('   ⏳ 步骤4: 恢复正常状态...');
    const restoreOutput = execSync(
      'node scripts/chaos-cli.js restore',
      {
        cwd: __dirname,
        encoding: 'utf-8',
        input: 'y\n',
        stdio: 'pipe',
      }
    );
    
    if (restoreOutput.includes('✅ 已恢复正常状态')) {
      console.log('   ✅ 恢复成功');
    } else {
      throw new Error('恢复输出中未找到成功标记');
    }
    
    // 步骤5: 验证恢复
    console.log('   ⏳ 步骤5: 验证恢复...');
    const gitStatusAfter = execSync('git status --porcelain', {
      cwd: __dirname,
      encoding: 'utf-8',
    });
    
    if (!gitStatusAfter.trim()) {
      console.log('   ✅ 文件已恢复，无未提交变更');
    } else {
      console.log('   ⚠️  警告: 仍有未提交的变更');
    }
    
    console.log(`   ✅ ${type} - 全部测试通过`);
    results.success.push(type);
    
  } catch (error) {
    console.log(`   ❌ 测试失败`);
    console.log(`   错误: ${error.message}`);
    results.failed.push({ 
      type, 
      error: error.message 
    });
    
    // 尝试清理
    try {
      const backupDir = path.join(__dirname, '.chaos-backup');
      if (fs.existsSync(backupDir)) {
        execSync('node scripts/chaos-cli.js restore', {
          cwd: __dirname,
          input: 'y\n',
          stdio: 'pipe',
        });
      }
    } catch (cleanupError) {
      console.log(`   ⚠️  清理失败: ${cleanupError.message}`);
    }
  }
}

// 生成测试报告
console.log('\n\n' + '='.repeat(70));
console.log('\n📊 测试报告\n');
console.log('='.repeat(70));

console.log(`\n总计: ${results.total} 种故障类型`);
console.log(`✅ 成功: ${results.success.length}`);
console.log(`❌ 失败: ${results.failed.length}`);

const successRate = ((results.success.length / results.total) * 100).toFixed(1);
console.log(`📈 成功率: ${successRate}%`);

if (results.success.length > 0) {
  console.log('\n✅ 成功的故障类型:');
  results.success.forEach((type, index) => {
    console.log(`   ${index + 1}. ${type}`);
  });
}

if (results.failed.length > 0) {
  console.log('\n❌ 失败的故障类型:');
  results.failed.forEach((item, index) => {
    console.log(`   ${index + 1}. ${item.type}`);
    console.log(`      原因: ${item.error}`);
  });
}

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

const reportPath = path.join(__dirname, 'test-results.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`\n💾 详细报告已保存: test-results.json`);

console.log('\n' + '='.repeat(70));

if (results.failed.length === 0) {
  console.log('\n🎉 所有故障类型注入功能测试通过！\n');
} else {
  console.log('\n⚠️  部分故障类型测试失败，请检查上述错误信息。\n');
}

// 退出码
process.exit(results.failed.length > 0 ? 1 : 0);

