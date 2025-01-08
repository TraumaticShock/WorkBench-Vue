import request from '@/utils/request';
import type { ApiResponse } from '@/types/ApiResponse';
import type { TodayTodoStats } from '@/types/todo';

export const todoApi = {
  getTodoCount(date?: string, status?: string, priority?: string, category?: string) {
    // 构建请求参数
    const params: { [key: string]: string | undefined } = {};
  
    // 可选参数，若有值则添加到请求参数中
    if (date) params.date = date;
    if (status) params.status = status;
    if (priority) params.priority = priority;
    if (category) params.category = category;
  
    // 使用 URLSearchParams 格式化查询参数
    const queryString = new URLSearchParams(params as Record<string, string>).toString();
  
    // 发送请求
    return request.get<ApiResponse<TodayTodoStats>>(
      `/todos/count?${queryString}`
    );
  }
};
