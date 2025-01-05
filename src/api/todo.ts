import request from '@/utils/request';
import type { ApiResponse } from '@/types/ApiResponse';
import type { TodayTodoStats } from '@/types/todo';

export const todoApi = {
  getTodayTodo(date: string) {
    return request.get<ApiResponse<TodayTodoStats>>(
      `/todos/count?date=${date}`
    );
  },
};
