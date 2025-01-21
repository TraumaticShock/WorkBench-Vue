import { defineStore } from 'pinia';
import { ref } from 'vue';
import { todoCategoryApi } from '@/api/todoCategory';
import type { TodoCategory } from '@/types/todoCategory';

export const useTodoCategoryStore = defineStore('todoCategory', () => {
    const categories = ref<TodoCategory[]>([]);

    const getCategories = async () => {
        const result = await todoCategoryApi.getCategories();
        categories.value = result.data.data;
    };

    const createCategory = async (name: string, parentId?: string) => {
        const result = await todoCategoryApi.createCategory({ name, parentId });
        await getCategories(); // 重新获取分类树
        return result.data.data;
    };

    return {
        categories,
        getCategories,
        createCategory
    };
});
