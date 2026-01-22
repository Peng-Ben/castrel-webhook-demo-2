/**
 * @fault-type: syntax-error
 * @category: build-errors
 * @description: JSX语法错误，缺少闭合标签导致编译失败
 * @expected-error: Unexpected token
 * @target-file: src/pages/Home.jsx
 * @severity: high
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTaskContext } from '../context/TaskContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';

/**
 * Home - 首页组件
 * 
 * 🚨 故障注入：JSX语法错误
 * 错误类型：缺少闭合标签
 * 预期结果：Vite编译失败，无法构建
 */
function Home() {
  const { tasks, loading, getTaskStats } = useTaskContext();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (tasks.length > 0) {
      setStats(getTaskStats());
    }
  }, [tasks, getTaskStats]);

  if (loading && !stats) {
    return <Loading fullScreen text="加载中..." />;
  }

  const recentTasks = tasks.slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 欢迎区域 - 🚨 错误：缺少闭合的 </div> 标签 */}
      <div className="text-center py-12 bg-gradient-to-r from-primary-500 to-primary-700 rounded-lg text-white">
        <h1 className="text-4xl font-bold mb-4">欢迎使用 TaskFlow</h1>
        <p className="text-xl text-primary-100 mb-6">
          高效管理您的任务，提升工作效率
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/tasks/create">
            <Button variant="secondary" size="lg">
              ➕ 创建新任务
            </Button>
          </Link>
          <Link to="/tasks">
            <Button variant="primary" size="lg" className="bg-white text-primary-700 hover:bg-gray-100">
              📋 查看所有任务
            </Button>
          </Link>
        </div>
      {/* 🚨 这里缺少 </div> 闭合标签，会导致编译错误 */}

      {/* 统计卡片 */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">总任务数</p>
                <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default Home;

