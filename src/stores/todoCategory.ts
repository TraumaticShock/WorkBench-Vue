import { defineStore } from 'pinia';
import { ref } from 'vue';
import { todoCategoryApi } from '@/api/todoCategory';
import type { TodoCategory } from '@/types/todoCategory';

export const useTodoCategoryStore = defineStore('todoCategory', () => {
    const categories = ref<TodoCategory[]>([]);

    // 获取分类名称的方法
    const getCategoryName = (categoryId: string) => {
        const findCategoryInTree = (categories: TodoCategory[], id: string): string => {
            for (const category of categories) {
                if (category.id === id) {
                    return category.name
                }
                if (category.children?.length) {
                    const found = findCategoryInTree(category.children, id)
                    if (found) return found
                }
            }
            return ''
        }
        return findCategoryInTree(categories.value, categoryId) || '未分类'
    }

    const getCategories = async () => {
        const result = await todoCategoryApi.getCategories();
        categories.value = result.data.data;
    };

    const createCategory = async (name: string, parentId?: string) => {
        const result = await todoCategoryApi.createCategory({ name, parentId });
        await getCategories(); // 重新获取分类树
        return result.data.data;
    };

    const updateCategory = async (id: string, category: TodoCategory) => {
        const result = await todoCategoryApi.updateCategory(id, category);
        await getCategories(); // 重新获取分类树
        return result.data.data;
    };

    const deleteCategory = async (id: string) => {
        const result = await todoCategoryApi.deleteCategory(id);
        await getCategories(); // 重新获取分类树
        return result.data.data;
    };

    return {
        categories,
        getCategories,
        createCategory,
        updateCategory,
        deleteCategory,
        getCategoryName
    };
});
