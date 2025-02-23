/// <reference types="vite/client" />
/// <reference types="element-plus/global" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module 'markdown-it' {
  const MarkdownIt: any;
  export default MarkdownIt;
}

declare module 'markdown-it-anchor' {
  const anchor: any;
  export default anchor;
}

declare module 'markdown-it-toc-done-right' {
  const tocPlugin: any;
  export default tocPlugin;
}

declare module '@/components/dashboard/charts/*' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// 全局类型声明
declare global {
  interface Window {
    // 添加任何需要的全局窗口属性
  }
}
