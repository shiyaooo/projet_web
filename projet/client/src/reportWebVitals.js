const reportWebVitals = onPerfEntry => { // onPerfEntry 是一个回调函数，如果提供，它会接收 Web Vitals 数据。
    if (onPerfEntry && onPerfEntry instanceof Function) {
      // import('web-vitals') 是 动态导入，用于获取 Web Vitals 库。
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(onPerfEntry);
        getFID(onPerfEntry);
        getFCP(onPerfEntry);
        getLCP(onPerfEntry);
        getTTFB(onPerfEntry);
      });
    }
  };
  
  export default reportWebVitals;

// reportWebVitals 是一个用于 测量 Web 应用性能 的函数, 它的作用是 收集和报告 Web Vitals（网页核心指标），这些指标可以帮助你分析网页的用户体验，如加载速度、交互流畅性等
// 在 React 项目 中，reportWebVitals.js 文件默认用于收集并报告这些 Web Vitals 指标，你可以选择将它们输出到控制台或发送到监控系统。
/*
Web Vitals（网页核心指标）是什么？

Web Vitals 是 Google 提出的网页性能指标，包括以下几个关键参数：
指标	缩写	作用
最大内容绘制	LCP (Largest Contentful Paint)	加载速度（页面主要内容的渲染时间，理想值 <2.5s）
首次输入延迟	FID (First Input Delay)	交互响应时间（用户首次交互的延迟，理想值 <100ms）
累积布局偏移	CLS (Cumulative Layout Shift)	视觉稳定性（页面跳动程度，理想值 <0.1）
首次内容绘制	FCP (First Contentful Paint)	首次内容渲染时间
交互就绪时间	TTFB (Time to First Byte)	服务器响应时间
*/