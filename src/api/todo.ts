import request from '@/utils/request';
import type { ApiResponse } from '@/types/ApiResponse';
import type { CreateTodoForm, TodoCountStats, TodoPageParams, TodoStatisticsParams } from '@/types/todo';

export const todoApi = {
  // 获取待办统计数据
  getTodoStatistics(params: TodoStatisticsParams) {
    return request.get<ApiResponse<TodoCountStats>>(
      '/todos/statistics',
      { params }
    );
  },
  // 获取待办列表
  getTodoPage(params: TodoPageParams) {
    return request.get<ApiResponse<any>>('/todos', { params });
  },
  // 创建待办
  createTodo(data: CreateTodoForm) {
    return request.post<ApiResponse<any>>('/todos', data);
  },
  // 更新待办
  updateTodo(id: string, data: CreateTodoForm) {
    return request.put<ApiResponse<any>>(`/todos/${id}`, data);
  },
  // 删除待办
  deleteTodo(id: string) {
    return request.delete<ApiResponse<any>>(`/todos/${id}`);
  },
};
