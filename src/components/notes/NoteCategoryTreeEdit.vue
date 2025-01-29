<template>
    <div class="category-tree border rounded-lg overflow-hidden bg-base-100">
        <div class="p-2">
            <NoteCategoryTreeItem v-for="category in noteCategoryStore.categories" :key="category.id" :category="category"
                :selected-category="selectedCategory" @select="handleSelect" @toggle="handleToggle" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useNoteCategoryStore } from '@/stores/noteCategory'
import type { NoteCategory } from '@/types/noteCategory'
import NoteCategoryTreeItem from './NoteCategoryTreeItem.vue'

const props = defineProps<{
    modelValue?: string
}>()

const emit = defineEmits<{
    'update:modelValue': [value: string]
    'select': [category: NoteCategory]
}>()

const noteCategoryStore = useNoteCategoryStore()

// 当前选中的分类
const selectedCategory = computed(() => {
    if (!props.modelValue) return null
    return findCategory(noteCategoryStore.categories, props.modelValue)
})

// 递归查找分类
function findCategory(categories: NoteCategory[], id: string): NoteCategory | null {
    for (const category of categories) {
        if (category.id === id) return category
        if (category.children?.length) {
            const found = findCategory(category.children, id)
            if (found) return found
        }
    }
    return null
}

const handleSelect = (category: NoteCategory) => {
    emit('update:modelValue', category.id)
    emit('select', category)
}

const handleToggle = (category: NoteCategory) => {
    category.expanded = !category.expanded
}
</script>

<style scoped>
.category-tree {
    @apply transition-all duration-200;
}
</style>