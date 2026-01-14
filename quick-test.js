#!/usr/bin/env node

/**
 * 快速测试剩余的故障类型
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 剩余要测试的故障类型
const faultTypes = [
  'dependency-version-conflict',
  'env-variable-missing',
  'vite-config-error',
  'css-syntax-error',
  'circular-dependency',
  'build-out-of-memory',
  'asset-size-exceeded',
];

async function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      cwd: __dirname,
      stdio: 'inherit',
    });
    
    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });
    
    proc.on('error', reject);
  });
}

async function testFault(faultType) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📝 测试: ${faultType}`);
  console.log('='.repeat(60));
  
  try {
    // 注入故障
    console.log('⏳ 注入故障...');
    await runCommand('node', ['scripts/chaos-cli.js', 'inject', '--type', faultType]);
    console.log('✅ 注入成功\n');
    
    return { type: faultType, success: true };
  } catch (error) {
    console.log(`❌ 注入失败: ${error.message}\n`);
    return { type: faultType, success: false, error: error.message };
  }
}

async function main() {
  console.log('\n🧪 快速测试剩余故障类型\n');
  
  const results = [];
  
  for (const faultType of faultTypes) {
    const result = await testFault(faultType);
    results.push(result);
    
    // 如果成功，等待1秒后继续
    if (result.success) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // 汇总结果
  console.log('\n' + '='.repeat(60));
  console.log('📊 测试汇总');
  console.log('='.repeat(60));
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`\n✅ 成功: ${successful.length}/${results.length}`);
  successful.forEach(r => console.log(`   - ${r.type}`));
  
  if (failed.length > 0) {
    console.log(`\n❌ 失败: ${failed.length}/${results.length}`);
    failed.forEach(r => console.log(`   - ${r.type}: ${r.error}`));
  }
  
  console.log('\n');
}

main().catch(console.error);

