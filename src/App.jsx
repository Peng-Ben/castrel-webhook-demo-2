/**
 * @fault-type: build-out-of-memory (App.jsx with import)
 * @description: App.jsx 导入大数据文件，触发构建时内存溢出
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import ErrorBoundary from './components/common/ErrorBoundary';
import { TaskProvider } from './context/TaskContext';

// Pages
import Home from './pages/Home';
import TaskListPage from './pages/TaskListPage';
import TaskDetailPage from './pages/TaskDetailPage';
import CreateTaskPage from './pages/CreateTaskPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

// 🔴 故障注入：导入大数据文件
// 这会在构建时加载并执行 largeData.js，导致内存溢出
import { 
  LARGE_CONSTANT_DATA, 
  HUGE_STRING, 
  MANY_OBJECTS,
  MORE_DATA,
  getTotalDataSize 
} from './utils/largeData';

// 🔴 在模块顶层使用这些数据，确保它们被加载
console.log('📊 加载大数据文件...');
console.log('数据大小:', getTotalDataSize());
console.log('LARGE_CONSTANT_DATA 前10项:', LARGE_CONSTANT_DATA.slice(0, 10));
console.log('HUGE_STRING 长度:', HUGE_STRING.length);
console.log('MANY_OBJECTS 数量:', MANY_OBJECTS.length);
console.log('MORE_DATA 数组数量:', MORE_DATA.arrays.length);

function App() {
  // 🔴 在组件中也引用这些数据
  React.useEffect(() => {
    console.log('App 组件加载，数据大小:', getTotalDataSize());
  }, []);

  return (
    <ErrorBoundary>
      <TaskProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="tasks" element={<TaskListPage />} />
              <Route path="tasks/:id" element={<TaskDetailPage />} />
              <Route path="create" element={<CreateTaskPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TaskProvider>
    </ErrorBoundary>
  );
}

export default App;

