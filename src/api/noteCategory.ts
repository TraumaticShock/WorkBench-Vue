import request from '@/utils/request';
import type { ApiResponse } from '@/types/ApiResponse';
import type { NoteCategory } from '@/types/noteCategory';

export const noteCategoryApi = {
    getCategories() {
        return request.get<ApiResponse<NoteCategory[]>>('/notes/categories/tree');
    },
    createCategory(data: Pick<NoteCategory, 'name' | 'parentId'>) {
        return request.post<ApiResponse<NoteCategory>>('/notes/categories', data);
    },
    updateCategory(id: string, data: NoteCategory) {
        return request.put<ApiResponse<NoteCategory>>(`/notes/categories/${id}`, data);
    },
    deleteCategory(id: string) {
        return request.delete<ApiResponse<NoteCategory>>(`/notes/categories/${id}`);
    }
};