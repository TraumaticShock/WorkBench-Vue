// 待办事项分类
export const todoCategories = [
  { id: '1', name: '工作', icon: 'briefcase', count: 12 },
  { id: '2', name: '学习', icon: 'book', count: 8 },
  { id: '3', name: '生活', icon: 'home', count: 5 },
  { id: '4', name: '其他', icon: 'dots-horizontal', count: 3 },
];

// 待办事项列表
export const todoList = [
  {
    id: 1,
    title: '完成项目文档',
    description: '编写项目技术文档和使用说明',
    category: '工作',
    priority: 'high',
    status: 'pending',
    dueDate: '2024-01-05',
    createdAt: '2024-01-01',
  },
  {
    id: 2,
    title: 'Vue3 学习',
    description: '学习 Composition API 和 TypeScript',
    category: '学习',
    priority: 'medium',
    status: 'in-progress',
    dueDate: '2024-01-10',
    createdAt: '2024-01-02',
  },
  {
    id: 3,
    title: '健身计划',
    description: '每天跑步30分钟',
    category: '生活',
    priority: 'low',
    status: 'completed',
    dueDate: '2024-01-15',
    createdAt: '2024-01-03',
  },
];

// 统计数据
export const todoStats = {
  total: 28,
  pending: 12,
  completed: 16,
  completionRate: 57,
};
