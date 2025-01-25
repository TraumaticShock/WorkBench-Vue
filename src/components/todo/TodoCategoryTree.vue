<template>
    <div class="category-tree border rounded-lg overflow-hidden bg-base-100">
        <div class="p-2">
            <CategoryTreeItem v-for="category in todoCategoryStore.categories" :key="category.id" :category="category"
                :selected-category="selectedCategory" @select="handleSelect" @toggle="handleToggle" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTodoCategoryStore } from '@/stores/todoCategory'
import type { TodoCategory } from '@/types/todoCategory'
import CategoryTreeItem from './TodoCategoryTreeItem.vue'

const props = defineProps<{
    modelValue?: string
}>()

const emit = defineEmits<{
    'update:modelValue': [value: string]
    'select': [category: TodoCategory]
}>()

const todoCategoryStore = useTodoCategoryStore()

// 当前选中的分类
const selectedCategory = computed(() => {
    if (!props.modelValue) return null
    return findCategory(todoCategoryStore.categories, props.modelValue)
})

// 递归查找分类
function findCategory(categories: TodoCategory[], id: string): TodoCategory | null {
    for (const category of categories) {
        if (category.id === id) return category
        if (category.children?.length) {
            const found = findCategory(category.children, id)
            if (found) return found
        }
    }
    return null
}

const handleSelect = (category: TodoCategory) => {
    emit('update:modelValue', category.id)
    emit('select', category)
}

const handleToggle = (category: TodoCategory) => {
    category.expanded = !category.expanded
}
</script>

<style scoped>
.category-tree {
    @apply transition-all duration-200;
}
</style>