import React from 'react';

/**
 * Loading - 加载指示器组件
 * 
 * @param {Object} props
 * @param {'sm'|'md'|'lg'} props.size - 加载器大小
 * @param {string} props.text - 加载文本
 * @param {boolean} props.fullScreen - 是否全屏显示
 * @param {string} props.className - 额外的CSS类名
 */
function Loading({
  size = 'md',
  text = '加载中...',
  fullScreen = false,
  className = ''
}) {
  // 尺寸映射
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const spinnerSize = sizeMap[size];

  // 加载器组件
  。。const spinner = (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`${spinnerSize} border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin`}
      />
      {text && (
        <p className="mt-4 text-gray-600 font-medium animate-pulse">{text}</p>
      )}
    </div>
  );

  // 全屏模式
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  // 普通模式
  return <div className={`flex items-center justify-center p-8 ${className}`}>{spinner}</div>;
}

/**
 * LoadingOverlay - 加载遮罩层组件
 * 用于在内容上方显示加载状态
 */
export function LoadingOverlay({ loading, children }) {
  return (
    <div className="relative">
      {children}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
          <Loading size="md" />
        </div>
      )}
    </div>
  );
}

/**
 * LoadingSkeleton - 骨架屏组件
 * 用于显示内容加载占位符
 */
export function LoadingSkeleton({ rows = 3, className = '' }) {
  return (
    <div className={`animate-pulse space-y-4 ${className}`}>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

export default Loading;

