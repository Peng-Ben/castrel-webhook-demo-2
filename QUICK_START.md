# 快速开始指南

## 🚀 5分钟上手

### 步骤1：安装依赖

```bash
npm install

```

### 步骤2：启动开发服务器

```bash
npm run dev
```

浏览器访问：http://localhost:3000

### 步骤3：体验混沌工程

```bash
# 查看所有故障类型
npm run chaos list

# 注入一个故障（组件崩溃）
npm run chaos inject --type component-crash

# 查看变更
git diff

# 提交代码
git add .
git commit -m "test: inject component crash"
git push origin main

# 等待Vercel部署，观察错误

# 恢复正常
npm run chaos restore
git add .
git commit -m "fix: restore normal state"
git push origin main
```

## 📚 下一步

- 阅读 [README.md](README.md) 了解项目详情
- 阅读 [FAULT_TEST_MANUAL.md](docs/FAULT_TEST_MANUAL.md) 学习如何测试每种故障
- 查看 [在线演示]（如果已部署）

## ⚠️ 注意事项

1. 确保Node.js版本 >= 16.x
2. 首次运行需要安装依赖
3. 混沌工程测试建议在独立的测试环境进行
4. 记得及时恢复故障状态

## 🆘 遇到问题？

查看 [FINAL文档](docs/React混沌工程演练/FINAL_React混沌工程演练.md) 的故障排查部分

