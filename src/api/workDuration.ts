import request from '@/utils/request';
import type { ApiResponse } from '@/types/ApiResponse';
import type { WorkDuration } from '@/types/workDuration';

export const workDurationApi = {
  // 获取今天的工作时长
  getWorkDurationToday() {
    return request.get<ApiResponse<WorkDuration>>(`/workDuration`);
  },

  // 更新工作时长
  updateWorkDuration(date: string, workDuration: number) {
    return request.put<ApiResponse<string>>('/workDuration', {
      date,
      workDuration,
    });
  },

  // 获取指定日期范围的工作时长
  getWorkDurationByDateRange(startDate: string, endDate: string) {
    return request.get<ApiResponse<WorkDuration[]>>('/workDuration', {
      params: {
        startDate,
        endDate,
      },
    });
  },
};
