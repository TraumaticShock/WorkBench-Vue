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

// 笔记状态类型
export interface NoteState {
  stats: {
    count: number;
    monthCount: number;
    categoryCount: Record<string, number>;
  };
  notePage: {
    records: any[];
    total: number;
    size: number;
    current: number;
    pages: number;
  };
}

// 笔记类型
export interface Note {
  id: string;
  title: string;
  content: string;
  category_id?: string;
  categoryName?: string;
  createTime?: string;
  updateTime?: string;
  tags?: string[];
}
