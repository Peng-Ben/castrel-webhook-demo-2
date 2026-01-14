/**
 * Fault Registry - 故障类型注册表
 * 
 * 定义所有支持的故障类型及其配置信息
 * 
 * ⚠️ 重要：本注册表只包含会导致启动失败的错误类型
 * 即：构建阶段失败，无法成功部署的错误
 */

export const faultRegistry = {
  // ==================== 构建错误 - 语法和编译错误 ====================
  
  'syntax-error': {
    name: 'JSX语法错误',
    category: 'build-errors',
    description: 'JSX语法错误，缺少闭合标签导致编译失败',
    targetFiles: ['src/pages/Home.jsx'],
    templateFile: 'chaos-templates/build-errors/syntax-error.template.jsx',
    expectedError: 'Unexpected token',
    severity: 'high',
    buildFails: true,
    deployFails: true
  },

  'import-error': {
    name: '导入路径错误',
    category: 'build-errors',
    description: '错误的import路径，导致模块无法找到，编译失败',
    targetFiles: ['src/App.jsx'],
    templateFile: 'chaos-templates/build-errors/import-error.template.jsx',
    expectedError: 'Cannot find module',
    severity: 'high',
    buildFails: true,
    deployFails: true
  },

  'typescript-error': {
    name: 'TypeScript类型错误',
    category: 'build-errors',
    description: '类型定义错误导致TypeScript编译失败（如果使用TS）',
    targetFiles: ['src/App.jsx'],
    templateFile: 'chaos-templates/build-errors/typescript-error.template.jsx',
    expectedError: 'Type error',
    severity: 'high',
    buildFails: true,
    deployFails: true
  },

  'undefined-variable': {
    name: '未定义变量',
    category: 'build-errors',
    description: '使用未定义的变量或函数，导致编译失败',
    targetFiles: ['src/pages/TaskListPage.jsx'],
    templateFile: 'chaos-templates/build-errors/undefined-variable.template.jsx',
    expectedError: 'is not defined',
    severity: 'high',
    buildFails: true,
    deployFails: true
  },

  // ==================== 构建错误 - 依赖和配置错误 ====================

  'dependency-missing': {
    name: '依赖包缺失',
    category: 'build-errors',
    description: 'package.json中缺少必要的依赖包，npm install失败',
    targetFiles: ['package.json'],
    templateFile: 'chaos-templates/build-errors/dependency-missing.template.json',
    expectedError: 'Cannot find package',
    severity: 'high',
    buildFails: true,
    deployFails: true
  },

  'dependency-version-conflict': {
    name: '依赖版本冲突',
    category: 'build-errors',
    description: '依赖包版本不兼容，导致安装或编译失败',
    targetFiles: ['package.json'],
    templateFile: 'chaos-templates/build-errors/dependency-version-conflict.template.json',
    expectedError: 'ERESOLVE unable to resolve dependency tree',
    severity: 'high',
    buildFails: true,
    deployFails: true
  },

  'env-variable-missing': {
    name: '环境变量缺失',
    category: 'build-errors',
    description: '构建时必需的环境变量缺失，导致构建失败',
    targetFiles: ['vite.config.js'],
    templateFile: 'chaos-templates/build-errors/env-variable-missing.template.js',
    expectedError: 'Environment variable is not defined',
    severity: 'medium',
    buildFails: true,
    deployFails: true
  },

  'vite-config-error': {
    name: 'Vite配置错误',
    category: 'build-errors',
    description: 'vite.config.js配置错误，导致构建工具无法启动',
    targetFiles: ['vite.config.js'],
    templateFile: 'chaos-templates/build-errors/vite-config-error.template.js',
    expectedError: 'Invalid configuration',
    severity: 'high',
    buildFails: true,
    deployFails: true
  },

  // ==================== 构建错误 - 资源和打包错误 ====================

  'css-syntax-error': {
    name: 'CSS语法错误',
    category: 'build-errors',
    description: 'CSS或TailwindCSS配置错误，导致样式编译失败',
    targetFiles: ['src/styles/index.css'],
    templateFile: 'chaos-templates/build-errors/css-syntax-error.template.css',
    expectedError: 'CssSyntaxError',
    severity: 'medium',
    buildFails: true,
    deployFails: true
  },

  'circular-dependency': {
    name: '循环依赖',
    category: 'build-errors',
    description: '模块间存在循环依赖，导致构建失败或无限循环',
    targetFiles: ['src/utils/helpers.js'],
    templateFile: 'chaos-templates/build-errors/circular-dependency.template.jsx',
    expectedError: 'Circular dependency detected',
    severity: 'medium',
    buildFails: true,
    deployFails: true
  },

  'build-out-of-memory': {
    name: '构建内存溢出',
    category: 'build-errors',
    description: '构建过程中内存不足，导致构建失败',
    targetFiles: ['vite.config.js'],
    templateFile: 'chaos-templates/build-errors/build-out-of-memory.template.jsx',
    expectedError: 'JavaScript heap out of memory',
    severity: 'high',
    buildFails: true,
    deployFails: true
  },

  'asset-size-exceeded': {
    name: '资源文件过大',
    category: 'build-errors',
    description: '打包后的文件超过限制，导致部署失败',
    targetFiles: ['src/pages/Home.jsx'],
    templateFile: 'chaos-templates/build-errors/asset-size-exceeded.template.jsx',
    expectedError: 'Asset exceeds size limit',
    severity: 'medium',
    buildFails: true,
    deployFails: true
  }
};

/**
 * 获取所有故障类型
 */
export function getAllFaults() {
  return Object.keys(faultRegistry);
}

/**
 * 根据类型获取故障配置
 */
export function getFaultConfig(type) {
  return faultRegistry[type];
}

/**
 * 按分类获取故障列表
 */
export function getFaultsByCategory() {
  const categories = {
    'build-errors': []
  };

  Object.entries(faultRegistry).forEach(([type, config]) => {
    if (categories[config.category]) {
      categories[config.category].push({ type, ...config });
    }
  });

  return categories;
}

/**
 * 获取故障统计信息
 */
export function getFaultStats() {
  const stats = {
    total: 0,
    byCategory: {},
    bySeverity: {
      high: 0,
      medium: 0,
      low: 0
    }
  };

  Object.values(faultRegistry).forEach((config) => {
    stats.total++;
    stats.byCategory[config.category] = (stats.byCategory[config.category] || 0) + 1;
    stats.bySeverity[config.severity]++;
  });

  return stats;
}

export default faultRegistry;
