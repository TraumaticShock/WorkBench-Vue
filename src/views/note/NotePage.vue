<template>
    <div class="card bg-base-100 shadow-xl h-[calc(100vh-100px)] relative overflow-hidden">
        <!-- 顶部装饰条 -->
        <div class="absolute top-0 left-0 right-0 h-12 bg-gradient-to-r from-neutral to-neutral/70">
            <div class="flex items-center h-full px-6">
                <h2 class="text-xl font-semibold text-white">我的笔记</h2>
                <div class="flex items-center gap-2 ml-auto">
                    <button class="btn btn-sm btn-ghost text-white hover:text-white gap-2"
                        @click="showCategoryManage = true">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        分类管理
                    </button>
                    <button class="btn btn-sm btn-ghost text-white hover:text-white gap-2" @click="handleCreateNote">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        写笔记
                    </button>
                </div>
            </div>
        </div>

        <!-- 主要内容区域 -->
        <div class="pt-12 h-full flex flex-col">
            <!-- 搜索栏 -->
            <div class="p-4 border-b border-base-200">
                <div class="relative">
                    <PageSearchBar 
                        type="note"
                        placeholder="搜索笔记..."
                        @result-click="handleSearchResultClick" 
                    />
                </div>
            </div>
            <!-- 内容区域 -->
            <div class="flex-1 flex overflow-hidden">
                <!-- 左侧分类列表 -->
                <div class="w-[15%] border-r border-base-200 bg-base-100 overflow-y-auto">
                    <div class="p-4">
                        <!-- 分类列表内容 -->
                        <!-- 分类树 -->
                        <CategoryTree :categories="categories" :selected-id="selectedCategoryId"
                            :total-count="noteState.stats.count" :month-count="noteState.stats.monthCount"
                            :favorite-count="0" :category-count="noteState.stats.categoryCount"
                            @select="handleCategorySelect" />
                    </div>
                </div>

                <!-- 右侧笔记列表 -->
                <div class="flex-1 overflow-hidden flex flex-col">
                    <!-- 笔记列表区域 -->
                    <div class="overflow-y-auto p-6 flex-1">
                        <!-- 加载状态 -->
                        <div v-if="loading" class="flex items-center justify-center py-12">
                            <div class="loading loading-dots loading-lg"></div>
                        </div>

                        <!-- 空状态 -->
                        <div v-else-if="false" class="flex flex-col items-center justify-center py-12 gap-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 opacity-20" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <p class="text-base-content/50">暂无笔记，开始写作吧</p>
                            <button class="btn btn-primary btn-sm gap-2" @click="handleCreateNote">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                写笔记
                            </button>
                        </div>

                        <!-- 笔记列表 -->
                        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <!-- 笔记卡片 -->
                            <div v-for="note in noteState.notePage.records" :key="note.id"
                                class="card bg-base-200/50 hover:shadow-xl transition-all duration-300 group border border-base-300 dark:border-base-content/20"
                                @click="router.push({ name: 'noteDetail', params: { id: note.id } })">
                                <div class="card-body p-6">
                                    <!-- 笔记标题和操作按钮 -->
                                    <div class="flex items-start justify-between">
                                        <h3
                                            class="card-title text-base group-hover:text-primary transition-colors line-clamp-2">
                                            {{ note.title }}
                                        </h3>
                                        <div
                                            class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button class="btn btn-ghost btn-xs btn-square hover:bg-base-300/50"
                                                @click.stop="handleNoteClick(note.id)">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                                    viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                            </button>
                                            <button class="btn btn-ghost btn-xs btn-square text-error hover:bg-error/10"
                                                @click.stop="handleDelete(note.id)">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                                    viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    <!-- 笔记内容预览 -->
                                    <div class="text-sm opacity-60 line-clamp-3 mt-3 mb-4 min-h-[4.5em]">
                                        {{ note.content }}
                                    </div>

                                    <!-- 底部信息 -->
                                    <div
                                        class="flex items-center justify-between text-xs opacity-50 mt-auto pt-2 border-t border-base-300/50">
                                        <div class="flex items-center gap-3">
                                            <span class="badge badge-sm badge-ghost">{{
                                                noteCategoryStore.getCategoryName(note.category_id) }}</span>
                                            <span>{{ new Date(note.createdAt).toLocaleDateString('zh-CN', {
                                                year: 'numeric', month:
                                                    'long', day: 'numeric'
                                            }) }}</span>
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                            {{ note.content?.length || 0 }} 字
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 分页控制 -->
                    <div class="mt-6 mb-6 flex justify-center">
                        <Pagination v-model:current="noteStore.state.notePage.current" :total="noteState.notePage.pages" />
                    </div>
                </div>
            </div>
        </div>

        <NoteCategoryManageDialog v-model="showCategoryManage" />

        <!-- 添加 ConfirmDialog 组件 -->
        <ConfirmDialog
            v-model="showDeleteConfirm"
            title="确认删除"
            message="确定要删除这篇笔记吗？此操作不可恢复。"
            confirm-text="确定删除"
            cancel-text="取消"
            confirm-button-class="btn-error"
            @confirm="confirmDelete"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useNoteStore } from '@/stores/note'
import { useNoteCategoryStore } from '@/stores/noteCategory'
import { storeToRefs } from 'pinia'
import CategoryTree from '@/components/notes/NoteCategoryTree.vue'
import { useRouter } from 'vue-router'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import type { NoteCategory } from '@/types/noteCategory'
import PageSearchBar from '@/components/common/PageSearchBar.vue'
import type { SearchResult } from '@/types/search'

const noteCategoryStore = useNoteCategoryStore()
const noteStore = useNoteStore()
const router = useRouter()

const { state: noteState } = storeToRefs(noteStore)
const categories = storeToRefs(noteCategoryStore).categories
const selectedCategoryId = ref('all')
const loading = ref(false)
const showCategoryManage = ref(false)
const showDeleteConfirm = ref(false)
const noteToDelete = ref<string>('')

const handleCategorySelect = (id: string) => {
    selectedCategoryId.value = id
    noteStore.actions.getNotePage({
        page: 1,
        size: 9,
        category: id === 'all' ? undefined : id
    })
}

const handleNoteClick = (id: string) => {
    router.push({ name: 'noteEdit', params: { id } });
}

const handleDelete = (id: string) => {
    noteToDelete.value = id
    showDeleteConfirm.value = true
}

const getCategoryTotalCount = (category: NoteCategory): number => {
    // 获取当前分类的直接计数
    const currentCount = noteState.value.stats.categoryCount[category.id] || 0
    
    // 如果没有子分类，直接返回当前计数
    if (!category.children?.length) {
        return currentCount
    }
    
    // 递归计算所有子分类的数量
    const childrenCount = category.children.reduce((total, child) => {
        // 递归调用以获取子分类及其所有后代的计数
        return total + getCategoryTotalCount(child)
    }, 0)
    
    // 返回当前分类计数加上所有子孙分类的计数
    return currentCount + childrenCount
}

const confirmDelete = async () => {
    try {
        await noteStore.actions.deleteNote(noteToDelete.value)
    } catch (error) {
        console.error('删除笔记失败:', error)
    }
}

const handleCreateNote = () => {
    router.push({ name: 'noteEdit' });  // 跳转到编辑页面，不带 id 参数表示新建
}

// 处理搜索结果点击
const handleSearchResultClick = (result: SearchResult) => {
    if (result.type === 'note') {
        router.push(`/note/detail/${result.id}`)
    }
}

onMounted(() => {
    Promise.all([
        noteCategoryStore.actions.getCategories(),
        noteStore.actions.getNotePage({ page: 1, size: 9 })
    ])
})
</script>

<style scoped>
.menu :where(li:not(.menu-title):not(:empty))>:where(:not(ul).active) {
    background-color: hsl(var(--p) / 0.1);
    color: hsl(var(--p));
}

.card {
    border-radius: 1rem;
}

/* 自定义滚动条样式 */
::-webkit-scrollbar {
    width: 4px;
    height: 4px;
}

::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 2px;
}

::-webkit-scrollbar-thumb {
    background: hsl(var(--bc) / 0.2);
    border-radius: 2px;
    transition: all 0.2s ease-in-out;
}

::-webkit-scrollbar-thumb:hover {
    background: hsl(var(--bc) / 0.3);
}

/* 隐藏滚动条但保持可滚动 */
.hide-scrollbar {
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
    /* IE and Edge */
}

.hide-scrollbar::-webkit-scrollbar {
    display: none;
    /* Chrome, Safari and Opera */
}

/* 文本截断 */
.line-clamp-2 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow: hidden;
}

.line-clamp-3 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    overflow: hidden;
}
</style>