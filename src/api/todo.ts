import request from '@/utils/request';
import type { ApiResponse } from '@/types/ApiResponse';
import type { TodoCountStats, TodoStatisticsParams } from '@/types/todo';

export const todoApi = {
  getTodoStatistics(params: TodoStatisticsParams) {
    return request.get<ApiResponse<TodoCountStats>>(
      '/todos/statistics',
      { params }  // 直接传递参数对象，让 axios 处理序列化
    );
  }
};
