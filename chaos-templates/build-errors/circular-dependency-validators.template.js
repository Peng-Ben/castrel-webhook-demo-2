/**
 * validators.js - 配合circular-dependency故障的辅助文件
 * 这个文件会被创建在 src/utils/validators.js
 * 它会导入 helpers.js，形成循环依赖
 */

// 🔴 循环依赖：validators.js 导入 helpers.js
import { formatTaskData } from './helpers';

/**
 * 验证任务数据
 */
export function validateTaskData(task) {
  if (!task || typeof task !== 'object') {
    return false;
  }
  
  // 这里又使用了helpers中的函数，加剧循环依赖
  const formatted = formatTaskData(task);
  
  return !!(task.title && task.status);
}

/**
 * 验证任务标题
 */
export function validateTitle(title) {
  return typeof title === 'string' && title.trim().length > 0;
}

