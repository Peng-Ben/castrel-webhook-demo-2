/**
 * @fault-type: typescript-error
 * @category: build-errors
 * @description: 类型定义错误导致TypeScript编译失败
 * @expected-error: Type error
 * @target-file: src/App.jsx
 * @severity: high
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/common/ErrorBoundary';
import Layout from './components/Layout/Layout';
import { TaskProvider } from './context/TaskContext';

// 🚨 故障注入：TypeScript类型错误
// 错误类型：类型不匹配
// 预期结果：如果启用TypeScript检查，编译失败

// Pages
import Home from './pages/Home';
import TaskListPage from './pages/TaskListPage';
import TaskDetailPage from './pages/TaskDetailPage';
import CreateTaskPage from './pages/CreateTaskPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

/**
 * App - 应用根组件
 * 
 * 🚨 故障注入：TypeScript类型错误
 * 错误类型：类型定义不匹配
 * 预期结果：TypeScript编译失败
 */
function App() {
  // 🔴 类型错误：将字符串赋值给数字类型
  const count: number = "123"; // Type 'string' is not assignable to type 'number'
  
  // 🔴 类型错误：使用未定义的类型
  const user: UserType = { name: "test" }; // Cannot find name 'UserType'

  return (
    <Router>
      <TaskProvider>
        <ErrorBoundary>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tasks" element={<TaskListPage />} />
              <Route path="/tasks/:id" element={<TaskDetailPage />} />
              <Route path="/create" element={<CreateTaskPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>
        </ErrorBoundary>
      </TaskProvider>
    </Router>
  );
}

export default App;

