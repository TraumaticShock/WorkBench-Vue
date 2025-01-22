// 待办分类实体类型
export interface TodoCategory {
    id?: string;
    name: string;
    parentId?: string;
    children?: TodoCategory[];
    expanded?: boolean;
}