// 树节点类型（文件或目录）
export type TreeNode = FileNode | DirectoryNode;

// 文件状态类型
export interface FileState {
    uploadProgress: number;
    fileTree: TreeNode[];
    currentPath: string;
    fileStatistics: FileStatisticsResponse | null;
}

// 文件信息接口
export interface FileInfo {
    id: string;
    originalName: string;
    storageName: string;
    size: number;
    type: string;
    extension: string;
    path: string;
    url: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

// 文件上传响应
export interface FileUploadResponse {
    id: string;
    url: string;
}

// 文件树节点基础接口
interface BaseNode {
    name: string;
    type: 'file' | 'directory';
    size: number;
}

// 文件节点接口
export interface FileNode extends BaseNode {
    type: 'file';
    fileId: string;
    url: string;
}

// 目录节点接口
interface DirectoryNode extends BaseNode {
    type: 'directory';
    children: TreeNode[];
}

// 文件树响应
export interface FileTreeResponse {
    name: string;
    type: 'directory';
    size: number;
    children: TreeNode[];
}

// 文件统计响应
export interface FileStatisticsResponse {
    typeCount: {
        [key: string]: number;  // 各类型文件数量
    };
    typeSize: {
        [key: string]: number;  // 各类型文件总大小
    };
}