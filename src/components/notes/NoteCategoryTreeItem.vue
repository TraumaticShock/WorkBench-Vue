<template>
    <div class="category-item">
        <div class="flex items-center gap-2 p-2 rounded-lg hover:bg-base-200 cursor-pointer group"
            :class="{ 'active': selectedCategory?.id === category.id }" @click="$emit('select', category)">
            <!-- 展开/折叠按钮 -->
            <button v-if="category.children?.length" class="btn btn-xs btn-ghost btn-square"
                @click.stop="$emit('toggle', category)">
                <svg xmlns="http://www.w3.org/2000/svg"
                    :class="['h-4 w-4 transition-transform', { 'rotate-90': category.expanded }]" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
            </button>
            <div v-else class="w-4"></div>
            <!-- 分类图标 -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 opacity-50" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <!-- 分类名称 -->
            <span class="flex-1 truncate">{{ category.name }}</span>
            <!-- 添加子分类按钮 -->
            <button class="btn btn-xs btn-ghost btn-square opacity-0 group-hover:opacity-100 transition-opacity"
                @click.stop="$emit('add', category.id)">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
            </button>
            <!-- 子分类数量 -->
            <span v-if="category.children?.length" class="badge badge-sm">{{ category.children.length }}</span>
        </div>
        <!-- 子分类 -->
        <div v-if="category.children?.length && category.expanded" class="ml-6 mt-1 border-l-2 border-base-200 pl-2">
            <NoteCategoryTreeItem v-for="child in category.children" :key="child.id" :category="child"
                :selected-category="selectedCategory" @select="$emit('select', $event)"
                @toggle="$emit('toggle', $event)" @add="$emit('add', $event)" />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { NoteCategory } from '@/types/noteCategory';
import { defineAsyncComponent } from 'vue';

// 递归引用自身组件
const NoteCategoryTreeItem = defineAsyncComponent(() => import('./NoteCategoryTreeItem.vue'));

defineProps<{
    category: NoteCategory
    selectedCategory: NoteCategory | null
}>()

defineEmits<{
    select: [category: NoteCategory]
    toggle: [category: NoteCategory]
    add: [parentId: string]
}>()
</script>

<style scoped>
.category-item>div.active {
    @apply bg-primary/10;
}

.category-item {
    @apply transition-all duration-200;
}
</style>