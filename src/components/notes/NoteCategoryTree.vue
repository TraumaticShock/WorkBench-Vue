<template>
    <ul class="menu menu-xs">
        <!-- 全部笔记 -->
        <li>
            <a :class="{ active: selectedId === 'all' }" @click="$emit('select', 'all')">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                全部笔记
                <span class="badge badge-sm">{{ totalCount }}</span>
            </a>
        </li>

        <template v-for="category in categories" :key="category.id">
            <li>
                <a :class="{ active: selectedId === category.id }" @click="$emit('select', category.id)">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    {{ category.name }}
                    <span class="badge badge-sm">{{ categoryCount[category.name] || 0 }}</span>
                </a>
                <!-- 子分类 -->
                <ul v-if="category.children && category.children.length">
                    <li v-for="child in category.children" :key="child.id">
                        <a :class="{ active: selectedId === child.id }" @click="$emit('select', child.id)">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                            </svg>
                            {{ child.name }}
                            <span class="badge badge-sm">{{ categoryCount[child.name] || 0 }}</span>
                        </a>
                        <!-- 递归渲染子分类 -->
                        <ul v-if="child.children && child.children.length">
                            <li v-for="grandChild in child.children" :key="grandChild.id">
                                <a :class="{ active: selectedId === grandChild.id }"
                                    @click="$emit('select', grandChild.id)">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                    </svg>
                                    {{ grandChild.name }}
                                    <span class="badge badge-sm">{{ categoryCount[grandChild.name] || 0 }}</span>
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </li>
        </template>

        <!-- 特殊分类 -->
        <div class="divider"></div>
        <li>
            <a :class="{ active: selectedId === 'favorite' }" @click="$emit('select', 'favorite')">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                收藏笔记
                <span class="badge badge-sm badge-warning">{{ favoriteCount }}</span>
            </a>
        </li>
        <li>
            <a :class="{ active: selectedId === 'recent' }" @click="$emit('select', 'recent')">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                最近更新
                <span class="badge badge-sm badge-primary">{{ monthCount }}</span>
            </a>
        </li>
    </ul>
</template>

<script setup lang="ts">
import { NoteCategory } from '@/types/noteCategory'

defineProps<{
    categories: NoteCategory[]
    selectedId: string
    totalCount: number
    monthCount: number
    favoriteCount: number
    categoryCount: Record<string, number>
}>()

defineEmits<{
    (e: 'select', id: string): void
}>()
</script>

<style scoped>
.menu :where(li:not(.menu-title) > *:not(ul):not(details):not(.menu-title)) {
    padding-left: 1rem;
    padding-right: 1rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    text-align: left;
}

.menu :where(li:not(.menu-title):not(:empty))> :where(*:not(ul):not(details):not(.menu-title)) {
    gap: 0.75rem;
}

.menu :where(li:not(.menu-title) > *:not(ul):not(details):not(.menu-title)):hover {
    background-color: hsl(var(--bc) / 0.1);
}

.menu :where(li:not(.menu-title) > *:not(ul):not(details):not(.menu-title)).active {
    background-color: hsl(var(--p) / 0.1);
    color: hsl(var(--p));
}

.menu :where(li:not(.menu-title) > details > ul):before {
    left: 1.5rem;
}

.menu :where(li:not(.menu-title) > details > ul):after {
    left: 1.5rem;
}

.menu :where(li:not(.menu-title) > details > ul) {
    margin-left: 1rem;
}
</style>