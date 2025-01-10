import request from '@/utils/request';
import type { ApiResponse } from '@/types/ApiResponse';
import type { CreateTodoForm, TodoCountStats, TodoStatisticsParams } from '@/types/todo';

export const todoApi = {
  getTodoStatistics(params: TodoStatisticsParams) {
    return request.get<ApiResponse<TodoCountStats>>(
      '/todos/statistics',
      { params }
    );
  },
  createTodo(data: CreateTodoForm) {
    return request.post<ApiResponse<any>>('/todos', data);
  },
};
