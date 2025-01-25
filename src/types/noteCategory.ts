// 笔记分类类型
export interface NoteCategory {
  id?: string;
  name: string;
  parentId?: string;
  children?: NoteCategory[];
  expanded?: boolean;
}

// 创建笔记分类的参数类型
export interface CreateNoteCategoryRequest {
  name: string;
  parentId?: string | null;
}

// 更新笔记分类的参数类型
export interface UpdateNoteCategoryRequest {
  id: string;
  name: string;
  parentId?: string | null;
}
