# 故障测试操作手册

## 📖 使用说明

本手册详细说明如何测试每种**启动失败**的故障类型，包括操作步骤、预期结果和验证方法。

**⚠️ 重要说明**：
- 本手册只包含**构建阶段失败**的错误类型
- 所有故障都会导致**Vercel部署失败**，应用无法启动
- 不包含运行时错误（启动成功但访问失败的情况）

---

## 🚀 快速开始

### 前置条件

```bash
# 1. 确保Node.js版本正确
node --version  # 需要 >= 16.x

# 2. 安装依赖
npm install

# 3. 确保Git仓库干净
git status
```

### 命令格式说明 ⚠️ 重要

**所有 chaos 命令都必须使用 `--` 分隔符！**

```bash
# ✅ 正确的用法
npm run chaos -- list
npm run chaos -- inject --type syntax-error
npm run chaos -- restore

# ❌ 错误的用法（会失败）
npm run chaos -- list
npm run chaos -- inject --type syntax-error
```

**为什么需要 `--`？**
- `--` 告诉 npm 后面的参数是传递给脚本的
- 没有 `--`，npm 会尝试解析参数作为自己的选项
- 这会导致 `❌ 缺少参数: --type` 错误

### 基础命令

```bash
# 查看所有故障类型
npm run chaos -- list

# 查看故障详情
npm run chaos -- info --type syntax-error

# 注入故障
npm run chaos -- inject --type syntax-error

# 恢复正常
npm run chaos -- restore

# 诊断部署配置
npm run diagnose
```

### 3步快速测试

```bash
# 1. 注入故障
npm run chaos -- inject --type syntax-error

# 2. 查看变更
git diff

# 3. 恢复正常
npm run chaos -- restore
# 输入 'y' 确认
```

---

## 🔨 构建错误类型总览

### 错误分类

| 分类 | 故障类型 | 严重程度 | 预期结果 |
|------|---------|---------|---------|
| 语法编译 | syntax-error | 高 | 编译失败 |
| 语法编译 | import-error | 高 | 模块找不到 |
| 语法编译 | typescript-error | 高 | 类型检查失败 |
| 语法编译 | undefined-variable | 高 | 变量未定义 |
| 依赖配置 | dependency-missing | 高 | 依赖安装失败 |
| 依赖配置 | dependency-version-conflict | 高 | 版本冲突 |
| 依赖配置 | env-variable-missing | 中 | 环境变量缺失 |
| 依赖配置 | vite-config-error | 高 | 配置错误 |
| 资源打包 | css-syntax-error | 中 | CSS编译失败 |
| 资源打包 | circular-dependency | 中 | 循环依赖 |
| 资源打包 | build-out-of-memory | 高 | 内存溢出 |
| 资源打包 | asset-size-exceeded | 中 | 文件过大 |

---

## 📋 详细测试步骤

### 1. JSX语法错误 (syntax-error)

**故障描述**：JSX语法错误，缺少闭合标签导致编译失败

**错误原因**：
- 缺少闭合标签 `</div>`
- JSX标签不匹配
- 括号、花括号不配对

**操作步骤**：

```bash
# 步骤1：注入故障
npm run chaos -- inject --type syntax-error

# 步骤2：查看变更
git diff src/pages/Home.jsx

# 步骤3：本地验证（可选）
npm run build  # 应该失败

# 步骤4：提交代码
git add .
git commit -m "test: inject syntax-error for chaos testing"
git push origin main

# 步骤5：等待Vercel部署（约1-2分钟）
# 访问 https://vercel.com/your-project/deployments
```

**预期结果**：
- ✅ Vercel构建失败（Build阶段）
- ✅ Build日志显示：
  ```
  ✘ [ERROR] Expected closing tag
  
  src/pages/Home.jsx:XX:X:
    XX │     </div>
       │     ^
    XX │   {/* Missing closing tag */}
       │
  
  error: Build failed with 1 error
  ```
- ✅ 部署状态：Failed
- ✅ 应用无法访问

**验证方法**：
1. 打开Vercel部署页面
2. 查看Build Logs
3. 确认错误信息包含 "Expected closing tag" 或 "Unexpected token"
4. 确认构建在编译阶段失败
5. 确认部署状态为 "Failed"

**故障分析平台应获取**：
- Commit SHA和消息
- 错误文件：`src/pages/Home.jsx`
- 错误行号
- 错误类型：Syntax Error
- 完整的Build日志

**恢复步骤**：
```bash
# 1. 恢复代码
npm run chaos -- restore
# 输入 'y' 确认

# 2. 验证恢复
npm run build  # 应该成功

# 3. 提交恢复
git add .
git commit -m "fix: restore from syntax-error"
git push origin main

# 4. 确认Vercel部署成功
```

---

### 2. 导入路径错误 (import-error)

**故障描述**：错误的import路径，导致模块无法找到

**错误原因**：
- 文件路径拼写错误
- 文件不存在
- 大小写不匹配
- 相对路径错误

**操作步骤**：

```bash
# 步骤1：注入故障
npm run chaos -- inject --type import-error

# 步骤2：查看变更
git diff src/App.jsx

# 步骤3：提交代码
git add .
git commit -m "refactor: reorganize imports"
git push origin main
```

**预期结果**：
- ✅ Vercel构建失败（Build阶段）
- ✅ Build日志显示：
  ```
  ✘ [ERROR] Could not resolve "./pages/HomePage"
  
  src/App.jsx:X:XX:
    X │ import Home from './pages/HomePage';
      │                   ~~~~~~~~~~~~~~~~~~
      │
  
  error: Cannot find module './pages/HomePage'
  ```
- ✅ 部署状态：Failed

**验证方法**：
1. 检查Build Logs中的错误堆栈
2. 确认提示 "Cannot find module" 或 "Could not resolve"
3. 确认错误的导入路径被标记出来
4. 确认构建在模块解析阶段失败

**故障分析平台应获取**：
- 错误的导入路径
- 目标文件名
- 实际存在的文件名（对比）
- 建议的修复方案

**恢复步骤**：
```bash
npm run chaos -- restore
git add .
git commit -m "fix: correct import paths"
git push origin main
```

---

### 3. TypeScript类型错误 (typescript-error)

**故障描述**：类型定义错误导致TypeScript编译失败

**错误原因**：
- 类型不匹配
- 缺少类型定义
- 接口定义错误
- 泛型使用错误

**操作步骤**：

```bash
npm run chaos -- inject --type typescript-error
git add .
git commit -m "refactor: add type definitions"
git push origin main
```

**预期结果**：
- ✅ Vercel构建失败
- ✅ Build日志显示：
  ```
  ✘ [ERROR] Type 'string' is not assignable to type 'number'
  
  src/App.jsx:XX:X:
    XX │   const count: number = "123";
       │         ^^^^^
  ```

**验证方法**：
1. 确认错误信息包含类型相关描述
2. 确认指出了具体的类型冲突
3. 确认构建在类型检查阶段失败

**恢复步骤**：
```bash
npm run chaos -- restore
git add .
git commit -m "fix: correct type definitions"
git push origin main
```

---

### 4. 未定义变量 (undefined-variable)

**故障描述**：使用未定义的变量或函数

**错误原因**：
- 变量名拼写错误
- 忘记导入
- 作用域错误
- 函数未声明

**操作步骤**：

```bash
npm run chaos -- inject --type undefined-variable
git add .
git commit -m "feat: add new filtering feature"
git push origin main
```

**预期结果**：
- ✅ Vercel构建失败
- ✅ Build日志显示：
  ```
  ✘ [ERROR] 'unknownFunction' is not defined
  
  src/pages/TaskListPage.jsx:XX:X:
    XX │   const result = unknownFunction(data);
       │                  ^^^^^^^^^^^^^^^^^
  ```

**验证方法**：
1. 确认错误信息包含 "is not defined"
2. 确认指出了未定义的变量名
3. 确认构建在编译阶段失败

**恢复步骤**：
```bash
npm run chaos -- restore
git add .
git commit -m "fix: define missing variable"
git push origin main
```

---

### 5. 依赖包缺失 (dependency-missing)

**故障描述**：package.json中缺少必要的依赖包

**错误原因**：
- 忘记添加依赖
- 依赖被误删除
- package.json损坏

**操作步骤**：

```bash
npm run chaos -- inject --type dependency-missing
git add .
git commit -m "chore: update dependencies"
git push origin main
```

**预期结果**：
- ✅ Vercel构建失败（Install阶段）
- ✅ Build日志显示：
  ```
  npm ERR! code ERESOLVE
  npm ERR! ERESOLVE could not resolve
  npm ERR! 
  npm ERR! While resolving: castrel-webhook-demo@2.0.0
  npm ERR! Found: react@18.3.1
  npm ERR! Could not resolve dependency:
  npm ERR! peer react-router-dom@"*" from castrel-webhook-demo@2.0.0
  ```

**验证方法**：
1. 查看Build Logs的依赖安装阶段
2. 确认缺少的包名
3. 确认构建在 npm install 时就失败了
4. 确认没有进入编译阶段

**故障分析平台应获取**：
- 缺失的依赖包名
- package.json的diff
- 依赖安装日志

**恢复步骤**：
```bash
npm run chaos -- restore
npm install  # 重新安装依赖
git add .
git commit -m "fix: add missing dependency"
git push origin main
```

---

### 6. 依赖版本冲突 (dependency-version-conflict)

**故障描述**：依赖包版本不兼容

**错误原因**：
- 主依赖和子依赖版本冲突
- Peer dependency不满足
- 版本范围不兼容

**操作步骤**：

```bash
npm run chaos -- inject --type dependency-version-conflict
git add .
git commit -m "chore: upgrade dependencies"
git push origin main
```

**预期结果**：
- ✅ Vercel构建失败（Install阶段）
- ✅ Build日志显示：
  ```
  npm ERR! ERESOLVE unable to resolve dependency tree
  npm ERR! 
  npm ERR! While resolving: castrel-webhook-demo@2.0.0
  npm ERR! Found: react@18.3.1
  npm ERR! 
  npm ERR! Could not resolve dependency:
  npm ERR! peer react@"^17.0.0" from some-package@1.0.0
  ```

**验证方法**：
1. 确认错误信息包含版本冲突描述
2. 确认指出了冲突的包和版本
3. 确认构建在依赖解析阶段失败

**恢复步骤**：
```bash
npm run chaos -- restore
npm install
git add .
git commit -m "fix: resolve dependency conflicts"
git push origin main
```

---

### 7. 环境变量缺失 (env-variable-missing)

**故障描述**：构建时必需的环境变量缺失

**错误原因**：
- Vercel环境变量未配置
- .env文件未上传
- 环境变量名错误

**操作步骤**：

```bash
npm run chaos -- inject --type env-variable-missing
git add .
git commit -m "feat: add environment configuration"
git push origin main
```

**预期结果**：
- ✅ Vercel构建失败（Build阶段）
- ✅ Build日志显示：
  ```
  ✘ [ERROR] Environment variable 'VITE_REQUIRED_VAR' is not defined
  
  vite.config.js:X:X:
    X │   const requiredVar = process.env.VITE_REQUIRED_VAR;
      │                       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  ```

**验证方法**：
1. 确认错误信息包含环境变量名
2. 确认指出了缺失的变量
3. 检查Vercel项目设置中的环境变量配置

**故障分析平台应获取**：
- 缺失的环境变量名
- 在哪个文件中被引用
- 建议配置的位置

**恢复步骤**：
```bash
npm run chaos -- restore
git add .
git commit -m "fix: remove required env variable"
git push origin main

# 或者在Vercel中配置环境变量
```

---

### 8. Vite配置错误 (vite-config-error)

**故障描述**：vite.config.js配置错误

**错误原因**：
- 配置语法错误
- 插件配置错误
- 路径配置错误
- 选项不兼容

**操作步骤**：

```bash
npm run chaos -- inject --type vite-config-error
git add .
git commit -m "chore: update vite configuration"
git push origin main
```

**预期结果**：
- ✅ Vercel构建失败（Build阶段）
- ✅ Build日志显示：
  ```
  failed to load config from /vercel/path0/vite.config.js
  error during build:
  Error: Invalid configuration option
  ```

**验证方法**：
1. 确认错误信息指向vite.config.js
2. 确认描述了具体的配置错误
3. 确认构建在配置加载阶段失败

**恢复步骤**：
```bash
npm run chaos -- restore
git add .
git commit -m "fix: correct vite configuration"
git push origin main
```

---

### 9. CSS语法错误 (css-syntax-error)

**故障描述**：CSS或TailwindCSS配置错误

**错误原因**：
- CSS语法错误
- TailwindCSS指令错误
- PostCSS配置错误
- 选择器语法错误

**操作步骤**：

```bash
npm run chaos -- inject --type css-syntax-error
git add .
git commit -m "style: update global styles"
git push origin main
```

**预期结果**：
- ✅ Vercel构建失败（Build阶段）
- ✅ Build日志显示：
  ```
  ✘ [ERROR] CssSyntaxError: Unknown word
  
  src/styles/index.css:X:X:
    X │   @apply invalid-class-name;
      │          ^^^^^^^^^^^^^^^^^^
  ```

**验证方法**：
1. 确认错误信息包含CSS相关描述
2. 确认指出了具体的语法错误
3. 确认构建在样式编译阶段失败

**恢复步骤**：
```bash
npm run chaos -- restore
git add .
git commit -m "fix: correct CSS syntax"
git push origin main
```

---

### 10. 循环依赖 (circular-dependency)

**故障描述**：模块间存在循环依赖

**错误原因**：
- A导入B，B又导入A
- 多个模块形成依赖环
- 工具函数互相引用

**操作步骤**：

```bash
npm run chaos -- inject --type circular-dependency
git add .
git commit -m "refactor: reorganize utility functions"
git push origin main
```

**预期结果**：
- ✅ Vercel构建失败（Build阶段）
- ✅ Build日志显示：
  ```
  ✘ [ERROR] Circular dependency detected
  
  src/utils/helpers.js → src/utils/validators.js → src/utils/helpers.js
  ```

**验证方法**：
1. 确认错误信息包含 "Circular dependency"
2. 确认显示了依赖链路
3. 确认构建在模块解析阶段失败

**恢复步骤**：
```bash
npm run chaos -- restore
git add .
git commit -m "fix: resolve circular dependency"
git push origin main
```

---

### 11. 构建内存溢出 (build-out-of-memory)

**故障描述**：构建过程中内存不足

**错误原因**：
- 打包文件过大
- 内存配置不足
- 无限循环导致内存泄漏
- 构建配置不当

**操作步骤**：

```bash
npm run chaos -- inject --type build-out-of-memory
git add .
git commit -m "feat: add large dataset"
git push origin main
```

**预期结果**：
- ✅ Vercel构建失败（Build阶段）
- ✅ Build日志显示：
  ```
  <--- Last few GCs --->
  
  FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
  ```

**验证方法**：
1. 确认错误信息包含 "out of memory"
2. 确认显示了内存使用情况
3. 确认构建在打包阶段失败

**恢复步骤**：
```bash
npm run chaos -- restore
git add .
git commit -m "fix: optimize build memory usage"
git push origin main
```

---

### 12. 资源文件过大 (asset-size-exceeded)

**故障描述**：打包后的文件超过限制

**错误原因**：
- 单个文件过大
- 未进行代码分割
- 包含大量静态资源
- 未压缩优化

**操作步骤**：

```bash
npm run chaos -- inject --type asset-size-exceeded
git add .
git commit -m "feat: add rich content"
git push origin main
```

**预期结果**：
- ✅ Vercel构建失败或警告
- ✅ Build日志显示：
  ```
  (!) Some chunks are larger than 500 KBs after minification
  
  dist/assets/index-abc123.js (1.2 MB)
  
  ✘ [ERROR] Asset exceeds recommended size limit
  ```

**验证方法**：
1. 确认错误信息包含文件大小
2. 确认指出了超限的文件
3. 确认构建在打包或部署阶段失败

**恢复步骤**：
```bash
npm run chaos -- restore
git add .
git commit -m "fix: optimize asset size"
git push origin main
```

---

## 🔄 完整演练流程

### 标准测试流程

```bash
# 1. 选择要测试的故障类型
npm run chaos -- list

# 2. 查看故障详情
npm run chaos -- info --type syntax-error

# 3. 注入故障
npm run chaos -- inject --type syntax-error

# 4. 查看代码变更
git diff

# 5. 提交代码
git add .
git commit -m "test: inject syntax error"
git push origin main

# 6. 等待Vercel部署（约1-2分钟）
# 访问 https://vercel.com/your-project/deployments

# 7. 验证构建失败
# - 检查部署状态：Failed
# - 查看Build Logs
# - 确认错误信息

# 8. 故障分析平台验证
# - 确认收到GitHub Webhook
# - 确认获取到Commit信息
# - 确认获取到Build日志
# - 确认错误类型识别正确

# 9. 恢复正常
npm run chaos -- restore
git add .
git commit -m "fix: restore normal state"
git push origin main

# 10. 验证恢复成功
# - 检查部署状态：Success
# - 访问应用URL确认正常
```

---

## 📊 测试检查清单

### 构建错误测试清单

**语法和编译错误**：
- [ ] syntax-error - JSX语法错误
- [ ] import-error - 导入路径错误
- [ ] typescript-error - TypeScript类型错误
- [ ] undefined-variable - 未定义变量

**依赖和配置错误**：
- [ ] dependency-missing - 依赖包缺失
- [ ] dependency-version-conflict - 依赖版本冲突
- [ ] env-variable-missing - 环境变量缺失
- [ ] vite-config-error - Vite配置错误

**资源和打包错误**：
- [ ] css-syntax-error - CSS语法错误
- [ ] circular-dependency - 循环依赖
- [ ] build-out-of-memory - 构建内存溢出
- [ ] asset-size-exceeded - 资源文件过大

---

## 💡 最佳实践

### 测试前准备
1. ✅ 确保本地代码已提交
2. ✅ 确保Vercel项目已配置
3. ✅ 确保GitHub Webhook已设置
4. ✅ 准备好故障分析平台

### 测试过程中
1. ✅ 每次只测试一种故障
2. ✅ 详细记录Build日志
3. ✅ 截图保存错误信息
4. ✅ 记录部署失败的时间点

### 测试后清理
1. ✅ 使用 `npm run chaos -- restore` 恢复
2. ✅ 确认恢复后构建成功
3. ✅ 提交恢复的代码
4. ✅ 验证Vercel部署成功

---

## ⚠️ 重要注意事项

1. **所有故障都会导致部署失败**
   - 应用无法启动
   - 无法访问应用URL
   - 只能通过Build日志分析错误

2. **不要在生产环境测试**
   - 仅在测试/演练环境使用
   - 确保使用独立的Vercel项目

3. **及时恢复**
   - 测试完成后立即恢复
   - 避免错误代码长时间存在

4. **监控部署配额**
   - Vercel免费版有部署次数限制
   - 合理安排测试频率

---

## 🆘 故障排查

### 问题1：命令参数无法识别

**错误信息**：
```
npm warn Unknown cli config "--type"
❌ 缺少参数: --type
```

**原因**：缺少 `--` 分隔符

**解决方案**：
```bash
# ❌ 错误
npm run chaos inject --type syntax-error

# ✅ 正确
npm run chaos -- inject --type syntax-error
#              ^^^ 注意这里的 --
```

---

### 问题2：CLI命令无法执行

**错误信息**：
```
command not found: chaos
```

**解决方案**：
```bash
# 检查Node.js版本
node --version  # 需要 >= 16.x

# 重新安装依赖
rm -rf node_modules package-lock.json
npm install

# 验证安装
npm run chaos -- list
```

---

### 问题3：备份恢复失败

**错误信息**：
```
❌ 未找到备份文件
```

**原因**：
- 没有先注入故障
- 备份目录被删除
- 备份文件损坏

**解决方案**：
```bash
# 方案1：从Git恢复
git status
git checkout -- .

# 方案2：从远程恢复
git fetch origin
git reset --hard origin/main

# 方案3：查看备份状态
ls -la .chaos-backup/
cat .chaos-backup/metadata.json
```

---

### 问题4：Git冲突

**错误信息**：
```
error: Your local changes would be overwritten by merge
```

**解决方案**：
```bash
# 方案1：暂存当前修改
git stash
npm run chaos -- restore
git stash pop

# 方案2：提交当前修改
git add .
git commit -m "temp: save work"
npm run chaos -- restore
```

---

### 问题5：Vercel部署卡住

**现象**：部署一直显示 "Building..."

**解决方案**：
1. 登录Vercel控制台：`https://vercel.com/your-project`
2. 找到卡住的部署
3. 点击 "Cancel Deployment"
4. 重新推送代码：
   ```bash
   git commit --allow-empty -m "chore: trigger rebuild"
   git push origin main
   ```

---

### 问题6：构建成功但页面空白

**现象**：Vercel显示部署成功，但访问页面空白

**原因**：React Router配置问题

**解决方案**：
```bash
# 1. 运行诊断工具
npm run diagnose

# 2. 检查浏览器Console（F12）
# 查看是否有JavaScript错误

# 3. 检查Network标签
# 确认所有资源加载成功（状态码200）

# 4. 本地测试构建产物
npm run build
npm run preview
# 访问 http://localhost:4173
```

**如果本地正常，生产异常**：
- 检查 `vercel.json` 配置
- 确保包含正确的路由规则
- 参考项目根目录的配置文件

---

### 问题7：故障注入后无法构建

**现象**：本地 `npm run build` 失败

**这是正常的！** ✅

**说明**：
- 所有故障都会导致构建失败
- 这正是我们要测试的场景
- 如果需要本地构建，请先恢复：
  ```bash
  npm run chaos -- restore
  npm run build
  ```

---

## 💡 使用技巧

### 技巧1：批量测试脚本

创建 `test-all-faults.sh`：

```bash
#!/bin/bash

# 定义要测试的故障类型
faults=(
  "syntax-error"
  "import-error"
  "undefined-variable"
  "dependency-missing"
  "vite-config-error"
)

echo "🚀 开始批量测试..."
echo ""

for fault in "${faults[@]}"; do
  echo "=========================================="
  echo "📝 测试故障: $fault"
  echo "=========================================="
  
  # 注入故障
  npm run chaos -- inject --type "$fault"
  
  # 显示变更
  echo ""
  echo "📊 代码变更："
  git diff --stat
  
  # 等待用户确认
  echo ""
  read -p "👉 按Enter键恢复并继续下一个测试..."
  
  # 恢复
  echo "y" | npm run chaos -- restore
  
  echo ""
  echo "✅ $fault 测试完成"
  echo ""
done

echo "=========================================="
echo "🎉 所有测试完成！"
echo "=========================================="
```

**使用方法**：
```bash
chmod +x test-all-faults.sh
./test-all-faults.sh
```

---

### 技巧2：快速切换故障

```bash
# 一行命令：恢复 + 注入新故障
npm run chaos -- restore && npm run chaos -- inject --type import-error
```

---

### 技巧3：查看当前状态

```bash
# 检查是否有注入的故障
git status

# 查看备份信息
cat .chaos-backup/metadata.json 2>/dev/null || echo "✅ 无故障注入"

# 查看备份的文件列表
ls -la .chaos-backup/
```

---

### 技巧4：创建命令别名（可选）

在 `~/.bashrc` 或 `~/.zshrc` 中添加：

```bash
# Chaos CLI 别名
alias chaos='npm run chaos --'
alias chaos-list='npm run chaos -- list'
alias chaos-restore='npm run chaos -- restore'
```

然后就可以使用：
```bash
chaos list
chaos inject --type syntax-error
chaos restore
```

---

## 📊 测试记录模板

建议为每次测试创建记录：

```markdown
## 测试记录

**测试日期**：2026-01-14
**测试人员**：张三
**故障类型**：syntax-error

### 测试步骤
- [x] 注入故障
- [x] 提交代码
- [x] 推送到GitHub
- [x] 观察Vercel部署
- [x] 查看Build日志
- [x] 恢复正常

### 测试结果
- **部署状态**：Failed ✅
- **错误类型**：Expected closing tag ✅
- **错误文件**：src/pages/Home.jsx ✅
- **错误行号**：57 ✅
- **Build时间**：约45秒

### Build日志摘要
```
✘ [ERROR] Expected closing tag
src/pages/Home.jsx:57:5
```

### 故障分析平台表现
- [x] 正确接收Webhook通知
- [x] 正确解析Build日志
- [x] 正确识别错误类型
- [x] 生成准确的分析报告

### 备注
测试顺利，所有功能正常。
```

---

## 🎓 最佳实践

### 1. 测试前准备
- ✅ 确保Git工作区干净
- ✅ 确保本地代码与远程同步
- ✅ 确保Vercel项目配置正确
- ✅ 准备好记录测试结果

### 2. 测试过程中
- ✅ 每次只测试一种故障
- ✅ 详细记录每个步骤
- ✅ 截图保存关键信息
- ✅ 记录时间戳和部署ID

### 3. 测试后清理
- ✅ 立即恢复正常状态
- ✅ 验证恢复后构建成功
- ✅ 提交恢复的代码
- ✅ 确认生产环境正常

### 4. 文档记录
- ✅ 记录测试结果
- ✅ 保存Build日志
- ✅ 记录遇到的问题
- ✅ 总结经验教训

---

## 📈 测试进度跟踪

使用此清单跟踪测试进度：

### 语法和编译错误
- [ ] syntax-error - JSX语法错误
- [ ] import-error - 导入路径错误
- [ ] typescript-error - TypeScript类型错误
- [ ] undefined-variable - 未定义变量

### 依赖和配置错误
- [ ] dependency-missing - 依赖包缺失
- [ ] dependency-version-conflict - 依赖版本冲突
- [ ] env-variable-missing - 环境变量缺失
- [ ] vite-config-error - Vite配置错误

### 资源和打包错误
- [ ] css-syntax-error - CSS语法错误
- [ ] circular-dependency - 循环依赖
- [ ] build-out-of-memory - 构建内存溢出
- [ ] asset-size-exceeded - 资源文件过大

---

## 🔗 相关资源

### 项目文档
- **README.md** - 项目概述和快速开始
- **vercel.json** - Vercel部署配置
- **vite.config.js** - Vite构建配置

### 外部资源
- [Vercel文档](https://vercel.com/docs)
- [Vite文档](https://vitejs.dev/)
- [React Router文档](https://reactrouter.com/)

### 工具和命令
```bash
# 查看所有可用命令
npm run

# 诊断部署配置
npm run diagnose

# 查看故障列表
npm run chaos -- list

# 查看故障详情
npm run chaos -- info --type syntax-error
```

---

## 📞 技术支持

### 遇到问题？

1. **查看文档**
   - 阅读本手册的故障排查部分
   - 查看项目README.md

2. **运行诊断**
   ```bash
   npm run diagnose
   ```

3. **检查配置**
   - 验证 `vercel.json`
   - 验证 `vite.config.js`
   - 验证 `package.json`

4. **查看日志**
   - 浏览器Console（F12）
   - Vercel Build Logs
   - 本地终端输出

### 联系方式

如有问题，请：
- 查看项目README.md
- 提交GitHub Issues
- 查看项目文档

---

**祝测试顺利！** 🎉

记住：
- ✅ 永远使用 `--` 分隔符
- ✅ 每次只测试一种故障
- ✅ 测试后及时恢复
- ✅ 详细记录测试结果
