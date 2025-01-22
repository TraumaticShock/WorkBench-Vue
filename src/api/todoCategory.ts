import request from '@/utils/request';
import type { ApiResponse } from '@/types/ApiResponse';
import type { TodoCategory } from '@/types/todoCategory';

export const todoCategoryApi = {
    getCategories() {
        return request.get<ApiResponse<TodoCategory[]>>('/todos/categories/tree');
    },
    createCategory(data: Pick<TodoCategory, 'name' | 'parentId'>) {
        return request.post<ApiResponse<TodoCategory>>('/todos/categories', data);
    },
    updateCategory(id: string, data: TodoCategory) {
        return request.put<ApiResponse<TodoCategory>>(`/todos/categories/${id}`, data);
    },
    deleteCategory(id: string) {
        return request.delete<ApiResponse<TodoCategory>>(`/todos/categories/${id}`);
    }
};