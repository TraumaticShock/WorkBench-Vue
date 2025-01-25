import request from '@/utils/request';
import type { ApiResponse } from '@/types/ApiResponse';
import type { NoteCategory } from '@/types/noteCategory';

export const noteCategoryApi = {
  // 获取分类树
  getCategories() {
    return request.get<ApiResponse<NoteCategory[]>>('/note/categories/tree');
  },
  // 创建分类
  createCategory(data: Pick<NoteCategory, 'name' | 'parentId'>) {
    return request.post<ApiResponse<NoteCategory>>('/note/categories', data);
  },
  // 更新分类
  updateCategory(id: string, data: NoteCategory) {
    return request.put<ApiResponse<NoteCategory>>(
      `/note/categories/${id}`,
      data
    );
  },
  // 删除分类
  deleteCategory(id: string) {
    return request.delete<ApiResponse<NoteCategory>>(`/note/categories/${id}`);
  },
};
