/**
 * @fault-type: undefined-variable
 * @category: build-errors
 * @description: 使用未定义的变量或函数
 * @expected-error: is not defined
 * @target-file: src/pages/TaskListPage.jsx
 * @severity: high
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTaskContext } from '../context/TaskContext';
import TaskCard from '../components/features/TaskCard';
import Loading from '../components/common/Loading';
import Badge from '../components/common/Badge';

/**
 * TaskListPage - 任务列表页面
 * 
 * 🚨 故障注入：未定义变量
 * 错误类型：使用未定义的函数
 * 预期结果：编译失败
 */
function TaskListPage() {
  const { tasks, loading, fetchTasks } = useTaskContext();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // 🔴 错误：使用未定义的函数
  const filteredTasks = unknownFilterFunction(tasks, filter, searchTerm);
  // ReferenceError: unknownFilterFunction is not defined

  // 🔴 错误：使用未定义的变量
  const sortedTasks = filteredTasks.sort(undefinedSortConfig);
  // ReferenceError: undefinedSortConfig is not defined

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">任务列表</h1>
        <Link
          to="/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          创建任务
        </Link>
      </div>

      {/* 过滤器 */}
      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="搜索任务..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">全部</option>
          <option value="pending">待处理</option>
          <option value="in-progress">进行中</option>
          <option value="completed">已完成</option>
        </select>
      </div>

      {/* 任务列表 */}
      <div className="grid gap-4">
        {sortedTasks.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            暂无任务
          </div>
        ) : (
          sortedTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))
        )}
      </div>
    </div>
  );
}

export default TaskListPage;

