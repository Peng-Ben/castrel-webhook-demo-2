#!/usr/bin/env node

/**
 * 验证所有故障类型的模板文件和配置
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('\n🔍 验证故障注入系统配置\n');
console.log('='.repeat(70));

// 1. 检查故障注册表
console.log('\n📋 步骤1: 检查故障注册表...');
const registryPath = path.join(__dirname, 'scripts/config/faultRegistry.js');
if (fs.existsSync(registryPath)) {
  console.log('   ✅ faultRegistry.js 存在');
  
  // 动态导入
  const { faultRegistry } = await import('./scripts/config/faultRegistry.js');
  const faultTypes = Object.keys(faultRegistry);
  console.log(`   ✅ 注册了 ${faultTypes.length} 种故障类型`);
  
  // 2. 检查每个故障类型的模板文件
  console.log('\n📁 步骤2: 检查模板文件...\n');
  
  const results = {
    total: faultTypes.length,
    templateExists: [],
    templateMissing: [],
    targetFileValid: [],
    targetFileInvalid: [],
  };
  
  for (const faultType of faultTypes) {
    const config = faultRegistry[faultType];
    console.log(`   ${faultType}`);
    console.log(`   ${'─'.repeat(66)}`);
    
    // 检查模板文件
    const templatePath = path.join(__dirname, config.templateFile);
    if (fs.existsSync(templatePath)) {
      console.log(`   ✅ 模板文件存在: ${config.templateFile}`);
      results.templateExists.push(faultType);
      
      // 检查模板内容
      const templateContent = fs.readFileSync(templatePath, 'utf-8');
      const hasMetadata = templateContent.includes('@fault-type') || 
                         templateContent.includes('__chaos_fault__');
      if (hasMetadata) {
        console.log(`   ✅ 模板包含故障元数据`);
      } else {
        console.log(`   ⚠️  模板缺少故障元数据`);
      }
    } else {
      console.log(`   ❌ 模板文件不存在: ${config.templateFile}`);
      results.templateMissing.push(faultType);
    }
    
    // 检查目标文件
    const targetFile = config.targetFiles[0];
    console.log(`   📄 目标文件: ${targetFile}`);
    
    // 检查配置完整性
    console.log(`   📝 描述: ${config.description}`);
    console.log(`   ⚠️  预期错误: ${config.expectedError}`);
    console.log(`   🔴 严重程度: ${config.severity}`);
    console.log(`   💥 构建失败: ${config.buildFails ? '是' : '否'}`);
    console.log('');
  }
  
  // 3. 生成汇总报告
  console.log('='.repeat(70));
  console.log('\n📊 验证报告\n');
  console.log('='.repeat(70));
  
  console.log(`\n总计故障类型: ${results.total}`);
  console.log(`✅ 模板文件存在: ${results.templateExists.length}/${results.total}`);
  console.log(`❌ 模板文件缺失: ${results.templateMissing.length}/${results.total}`);
  
  if (results.templateMissing.length > 0) {
    console.log('\n❌ 缺失的模板文件:');
    results.templateMissing.forEach(type => {
      console.log(`   - ${type}: ${faultRegistry[type].templateFile}`);
    });
  }
  
  const successRate = ((results.templateExists.length / results.total) * 100).toFixed(1);
  console.log(`\n📈 完整率: ${successRate}%`);
  
  // 4. 列出所有模板文件
  console.log('\n📁 模板文件清单:\n');
  const templatesDir = path.join(__dirname, 'chaos-templates/build-errors');
  if (fs.existsSync(templatesDir)) {
    const files = fs.readdirSync(templatesDir);
    files.forEach((file, index) => {
      console.log(`   ${index + 1}. ${file}`);
    });
    console.log(`\n   总计: ${files.length} 个文件`);
  }
  
  console.log('\n' + '='.repeat(70));
  
  if (results.templateMissing.length === 0) {
    console.log('\n✅ 所有故障类型的模板文件都已就绪！\n');
    process.exit(0);
  } else {
    console.log('\n⚠️  部分模板文件缺失，请检查上述信息。\n');
    process.exit(1);
  }
  
} else {
  console.log('   ❌ faultRegistry.js 不存在');
  process.exit(1);
}

