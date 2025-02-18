// 搜索结果类型
export interface SearchResult {
    id: string;
    type: 'todo' | 'file' | 'note';  // 资源类型
    title: string;  // 资源标题
    content: string;  // 资源描述/内容
    categoryName: string;  // 资源分类名称
    url?: string;  // 资源URL（仅文件类型有）
    path?: string;  // 资源路径（仅文件类型有）
    createdAt: string;  // 创建时间
    updatedAt: string;  // 更新时间
    highlight: string;  // 高亮内容（搜索匹配的部分）
} 