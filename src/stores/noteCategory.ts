import { defineStore } from 'pinia';
import { ref } from 'vue';
import { noteCategoryApi } from '@/api/noteCategory';
import type { NoteCategory } from '@/types/noteCategory';

export const useNoteCategoryStore = defineStore('noteCategory', () => {
    const categories = ref<NoteCategory[]>([]);

    // 获取分类名称的方法
    const getCategoryName = (categoryId: string) => {
        const findCategoryInTree = (categories: NoteCategory[], id: string): string => {
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

    // 获取分类树
    const getCategories = async () => {
        const result = await noteCategoryApi.getCategories();
        categories.value = result.data.data;
    };

    const createCategory = async (name: string, parentId?: string) => {
        const result = await noteCategoryApi.createCategory({ name, parentId });
        await getCategories(); // 重新获取分类树
        return result.data.data;
    };

    const updateCategory = async (id: string, category: NoteCategory) => {
        const result = await noteCategoryApi.updateCategory(id, category);
        await getCategories(); // 重新获取分类树
        return result.data.data;
    };

    const deleteCategory = async (id: string) => {
        const result = await noteCategoryApi.deleteCategory(id);
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
