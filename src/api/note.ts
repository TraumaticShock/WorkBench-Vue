import request from '@/utils/request';
import type { ApiResponse } from '@/types/ApiResponse';
import type { NoteStatisticsParams, NotePageParams, Note } from '@/types/note';

export const noteApi = {
    // 获取笔记统计数据
    getNoteStatistics(params: NoteStatisticsParams) {
        return request.get<ApiResponse<any>>('/note/statistics', { params });
    },

    // 获取笔记列表
    getNotePage(params: NotePageParams) {
        return request.get<ApiResponse<any>>('/note', { params });
    },

    // 删除笔记
    deleteNote(id: string) {
        return request.delete<ApiResponse<any>>(`/note/${id}`);
    },

    // 创建笔记
    createNote(params: Note) {
        return request.post<ApiResponse<any>>('/note', params);
    },

    // 更新笔记
    updateNote: (id: string, data: Partial<Note>) => {
        return request.put(`/note/${id}`, data)
    }
};
