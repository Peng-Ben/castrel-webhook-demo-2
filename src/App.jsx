/**
 * @fault-type: import-error
 * @category: build-errors
 * @description: 错误的import路径，导致模块无法找到
 * @expected-error: Cannot find module
 * @target-file: src/App.jsx
 * @severity: high
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/common/ErrorBoundary';
import Layout from './components/Layout/Layout';
import { TaskProvider } from './context/TaskContext';

// 🚨 故障注入：错误的导入路径
// 正确路径应该是 './pages/Home'，这里故意写错
import Home from './pages/HomePage';  // ❌ 错误：文件不存在
import TaskListPage from './pages/TaskListPages';  // ❌ 错误：文件名拼写错误
import TaskDetailPage from './pages/TaskDetailPage';
import CreateTaskPage from './pages/CreateTaskPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

/**
 * App - 应用根组件
 * 
 * 🚨 故障注入：导入路径错误
 * 错误类型：模块路径不存在
 * 预期结果：Vite编译失败，提示 "Cannot find module"
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

