// 待办事项实体类型
export interface Todo {
  id: number;
  title: string; // 标题
  description: string; // 描述
  category: string; // 分类
  priority: 'low' | 'medium' | 'high'; // 优先级
  status: 'pending' | 'completed'; // 状态
  dueDate: string; // 截止日期
  createdAt: string; // 创建时间
  updatedAt: string; // 更新时间
}

// 待办事项统计参数类型
export interface TodoStatisticsParams {
  unit: 'day' | 'week' | 'category' | 'priority';
  date?: string | null;
  status?: string | null;
  priority?: string | null;
  category?: string | null;
}

// 创建待办表单数据类型
export interface CreateTodoFormParams {
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'completed' | 'pending';
  dueDate: string;
}

// 分页获取待办列表参数类型
export interface TodoPageParams {
  page?: number;
  size?: number;
  status?: string;
  priority?: string;
  search?: string;
  append?: boolean;
}

// 添加分页数据类型
export interface TodoPage {
  records: Todo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}
