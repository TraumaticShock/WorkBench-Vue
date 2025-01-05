export interface Todo {
  id: number;
  title: string; // 标题
  description?: string; // 描述
  category: string; // 分类
  priority: 'low' | 'medium' | 'high'; // 优先级
  status: 'pending' | 'in-progress' | 'completed'; // 状态
  dueDate?: string; // 截止日期
  createdAt: string; // 创建时间
  updatedAt: string; // 更新时间
  tags?: string[]; // 标签
}

// 今日待办事项统计
export interface TodayTodoStats {
  countToday: number;
  countYesterday: number;
  change: number;
}

// 待办事项分类
export interface TodoCategory {
  id: string;
  name: string;
  icon: string;
  count: number;
}

// 创建待办表单
export interface CreateTodoForm {
  title: string;
  description?: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  tags?: string[];
}
