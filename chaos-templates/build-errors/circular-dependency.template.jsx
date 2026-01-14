/**
 * @fault-type: circular-dependency
 * @category: build-errors
 * @description: 模块间存在循环依赖
 * @expected-error: Circular dependency
 * @target-file: src/utils/helpers.js
 * @severity: medium
 */

// 🚨 故障注入：循环依赖
// 错误类型：helpers.js → validators.js → helpers.js
// 预期结果：构建失败或运行时错误

// 🔴 错误：从validators导入，而validators又导入helpers
import { validateTaskData } from './validators';

/**
 * 格式化任务数据
 */
export function formatTaskData(task) {
  // 使用validators中的函数，造成循环依赖
  if (!validateTaskData(task)) {
    throw new Error('Invalid task data');
  }
  
  return {
    ...task,
    formattedDate: formatDate(task.createdAt),
    displayStatus: getStatusDisplay(task.status),
  };
}

/**
 * 格式化日期
 */
export function formatDate(date) {
  return new Date(date).toLocaleDateString('zh-CN');
}

/**
 * 获取状态显示文本
 */
export function getStatusDisplay(status) {
  const statusMap = {
    pending: '待处理',
    'in-progress': '进行中',
    completed: '已完成',
  };
  return statusMap[status] || status;
}

/**
 * 获取优先级显示文本
 */
export function getPriorityDisplay(priority) {
  const priorityMap = {
    low: '低',
    medium: '中',
    high: '高',
  };
  return priorityMap[priority] || priority;
}

