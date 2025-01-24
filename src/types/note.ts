// 待办事项统计参数类型
export interface NoteStatisticsParams {
    unit: 'day' | 'month' | 'category';
    date?: string | null;
    tag?: string | null;
    category?: string | null;
  }

// 分页获取笔记列表参数类型
export interface NotePageParams {
    page?: number;
    size?: number;
    category?: string;
}

