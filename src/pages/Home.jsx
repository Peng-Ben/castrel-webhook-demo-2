import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTaskContext } from '../context/TaskContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';

/**
 * Home - 首页组件
 * 
 * 功能：
 * - 显示任务统计信息
 * - 展示最近的任务
 * - 提供快速操作入口
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

  // 获取最近的任务
  const recentTasks = tasks.slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 欢迎区域 */}
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
      </div>

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

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">待处理</p>
                <p className="text-3xl font-bold text-yellow-900">{stats.pending}</p>
              </div>
              <div className="text-4xl">⏳</div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">进行中</p>
                <p className="text-3xl font-bold text-purple-900">{stats.inProgress}</p>
              </div>
              <div className="text-4xl">🚀</div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">已完成</p>
                <p className="text-3xl font-bold text-green-900">{stats.completed}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </Card>
        </div>
      )}

      {/* 最近任务 */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">最近任务</h2>
          <Link to="/tasks">
            <Button variant="secondary" size="sm">
              查看全部 →
            </Button>
          </Link>
        </div>

        {recentTasks.length > 0 ? (
          <div className="space-y-4">
            {recentTasks.map((task) => (
              <Link key={task.id} to={`/tasks/${task.id}`}>
                <Card hoverable className="transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{task.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-1">{task.description}</p>
                    </div>
                    <div className="ml-4">
                      <span className={`badge ${
                        task.status === 'completed' ? 'badge-success' :
                        task.status === 'in-progress' ? 'badge-info' :
                        'badge-warning'
                      }`}>
                        {task.status === 'completed' ? '已完成' :
                         task.status === 'in-progress' ? '进行中' : '待处理'}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-lg">还没有任务，创建第一个任务吧！</p>
            </div>
          </Card>
        )}
      </div>

      {/* 功能介绍 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="font-bold text-lg mb-2">任务管理</h3>
            <p className="text-sm text-gray-600">
              创建、编辑、删除任务，轻松管理您的工作流程
            </p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="font-bold text-lg mb-2">优先级设置</h3>
            <p className="text-sm text-gray-600">
              为任务设置优先级，合理安排工作顺序
            </p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="font-bold text-lg mb-2">统计分析</h3>
            <p className="text-sm text-gray-600">
              实时查看任务统计，掌握工作进度
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Home;

