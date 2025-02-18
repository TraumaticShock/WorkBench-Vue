import request from '@/utils/request';
import type { ApiResponse } from '@/types/ApiResponse';
import { SearchResult } from '@/types/search';

// 搜索相关的 API
export const searchApi = {
    // 全局搜索
    search(keyword: string) {
        return request.get<ApiResponse<SearchResult[]>>('/search', {
            params: { keyword }
        });
    },

    // 搜索待办
    searchTodo(keyword: string) {
        return request.get<ApiResponse<SearchResult[]>>('/search', {
            params: { 
                keyword,
                types: 'todo'
            }
        });
    },

    // 搜索笔记
    searchNote(keyword: string) {
        return request.get<ApiResponse<SearchResult[]>>('/search', {
            params: { 
                keyword,
                types: 'note'
            }
        });     
    },

    // 搜索文件
    searchFile(keyword: string) {
        return request.get<ApiResponse<SearchResult[]>>('/search', {
            params: { 
                keyword,
                types: 'file'
            }
        });
    }
}