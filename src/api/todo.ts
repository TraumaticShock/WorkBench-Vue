import request from '@/utils/request';
import type { ApiResponse } from '@/types/ApiResponse';
import type { Todo } from '@/types/todo';

export const todoApi = {
  // 获取今日待办事项
  getTodayTodo(date: string) {
    return request.get<ApiResponse<Todo>>(`/todos/count?date=${date}`);
  },
};
