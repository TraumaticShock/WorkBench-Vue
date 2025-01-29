import request from '@/utils/request';
import type { ApiResponse } from '@/types/ApiResponse';
import { FileTreeResponse, FileUploadResponse, FileStatisticsResponse } from '@/types/file';

// 文件管理相关的 API
export const fileApi = {
    // 上传文件
    upload(file: File, path: string = '/') {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('directory', path);
        return request.post<ApiResponse<FileUploadResponse>>('/file/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },  

    // 下载文件
    download(path: string) {
        return request.get('/file/download', {
            params: { path },
            responseType: 'blob',  // 设置响应类型为 blob
            headers: {
                Accept: 'application/octet-stream'
            }
        });
    },

    // 删除文件或目录
    delete(path: string) {
        // DELETE /file?path=documents/report.pdf
        return request.delete<ApiResponse<null>>('/file', {
            params: { path }
        });
    },

    // 创建文件夹
    createDirectory(name: string, path?: string) {
        return request.post<ApiResponse<string>>('/file/directory', null, {
            params: {
                name,
                path
            }
        });
    },

    // 获取文件树
    getFileTree() {
        return request.get<ApiResponse<FileTreeResponse>>('/file/tree');
    },

    // 获取文件统计信息
    getFileStatistics() {
        return request.get<ApiResponse<FileStatisticsResponse>>('/file/statistics');
    }
};
