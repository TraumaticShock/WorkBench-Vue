// 笔记分类实体类型
export interface NoteCategory {
    id?: string;
    name: string;
    parentId?: string;
    children?: NoteCategory[];
    expanded?: boolean;
}