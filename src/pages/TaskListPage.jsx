import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import TaskCard from '../components/features/TaskCard';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import { Link } from 'react-router-dom';

/**
 * TaskListPage - 任务列表页面
 * 
 * 功能：
 * - 展示所有任务
 * - 筛选和排序
 * - 搜索功能
 * - 批量操作
 */
function TaskListPage() {
  const {
    tasks,
    loading,
    error,
    toggleTaskStatus,
    deleteTask,
    searchTasks
  } = useTaskContext();

  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');

  /**
   * 处理搜索
   */
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  /**
   * 获取筛选后的任务
   */
  const getFilteredTasks = () => {
    let filtered = searchQuery ? searchTasks(searchQuery) : tasks;

    // 按状态筛选
    if (filterStatus !== 'all') {
      filtered = filtered.filter(task => task.status === filterStatus);
    }

    // 按优先级筛选
    if (filterPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === filterPriority);
    }

    // 排序
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'createdAt') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (sortBy === 'priority') {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return 0;
    });

    return filtered;
  };

  const filteredTasks = getFilteredTasks();

  if (loading && tasks.length === 0) {
    return <Loading fullScreen text="加载任务列表..." />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-xl mb-4">❌ {error}</div>
        <Button onClick={() => window.location.reload()}>重新加载</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">任务列表</h1>
          <p className="text-gray-600 mt-1">
            共 {filteredTasks.length} 个任务
            {searchQuery && ` (搜索: "${searchQuery}")`}
          </p>
        </div>
        <Link to="/tasks/create">
          <Button variant="primary" size="lg">
            ➕ 创建新任务
          </Button>
        </Link>
      </div>

      {/* 筛选和搜索栏 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* 搜索框 */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              搜索任务
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="搜索标题、描述或标签..."
                value={searchQuery}
                onChange={handleSearch}
                className="input pl-10"
              />
              <svg
                className="absolute left-3 top-3 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* 状态筛选 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              状态
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input"
            >
              <option value="all">全部状态</option>
              <option value="pending">待处理</option>
              <option value="in-progress">进行中</option>
              <option value="completed">已完成</option>
            </select>
          </div>

          {/* 优先级筛选 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              优先级
            </label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="input"
            >
              <option value="all">全部优先级</option>
              <option value="high">高优先级</option>
              <option value="medium">中优先级</option>
              <option value="low">低优先级</option>
            </select>
          </div>
        </div>

        {/* 排序选项 */}
        <div className="mt-4 flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">排序:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('createdAt')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                sortBy === 'createdAt'
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              创建时间
            </button>
            <button
              onClick={() => setSortBy('dueDate')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                sortBy === 'dueDate'
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              截止日期
            </button>
            <button
              onClick={() => setSortBy('priority')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                sortBy === 'priority'
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              优先级
            </button>
          </div>
        </div>
      </div>

      {/* 任务列表 */}
      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleStatus={toggleTaskStatus}
              onDelete={deleteTask}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            没有找到任务
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery
              ? '尝试调整搜索条件或筛选器'
              : '还没有创建任何任务'}
          </p>
          {!searchQuery && (
            <Link to="/tasks/create">
              <Button variant="primary">创建第一个任务</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default TaskListPage;

