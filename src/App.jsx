import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/common/ErrorBoundary';
import Layout from './components/Layout/Layout';
import { TaskProvider } from './context/TaskContext';

// 页面组件
import Home from './pages/Home';
import TaskListPage from './pages/TaskListPage';
import TaskDetailPage from './pages/TaskDetailPage';
import CreateTaskPage from './pages/CreateTaskPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

/**
 * App - 应用根组件
 * 
 * 职责：
 * - 配置路由系统
 * - 提供全局状态管理（TaskContext）
 * - 错误边界包裹
 * - 布局组件包裹
 */
function App() {
  return (
    <ErrorBoundary>
      <TaskProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tasks" element={<TaskListPage />} />
              <Route path="/tasks/:id" element={<TaskDetailPage />} />
              <Route path="/tasks/create" element={<CreateTaskPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>
        </Router>
      </TaskProvider>
    </ErrorBoundary>
  );
}

export default App;

