import request from '@/utils/request';
import type { ApiResponse } from '@/types/ApiResponse';
import type { NoteStatisticsParams, NotePageParams } from '@/types/note';

export const noteApi = {
    // 获取笔记统计数据
    getNoteStatistics(params: NoteStatisticsParams) {
        return request.get<ApiResponse<any>>('/note/statistics', { params });
    },

    // 获取笔记列表
    getNotePage(params: NotePageParams) {
        return request.get<ApiResponse<any>>('/note', { params });
    },
};
