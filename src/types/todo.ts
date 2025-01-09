export interface Todo {
  id: number;
  title: string; // 标题
  description?: string; // 描述
  category: string; // 分类
  priority: 'low' | 'medium' | 'high'; // 优先级
  status: 'pending' | 'completed'; // 状态
  dueDate?: string; // 截止日期
  createdAt: string; // 创建时间
  updatedAt: string; // 更新时间
  tags?: string[]; // 标签
}

// 待办事项统计参数
export interface TodoStatisticsParams {
  unit?: 'day' | 'week' | 'category';
  date?: string;
  status?: string;
  priority?: string;
  category?: string;
}

// 待办事项数量统计
export interface TodoCountStats {
  count: number;
  date: string;
  status: string | null;
  priority: string | null;
  category: string | null;
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
