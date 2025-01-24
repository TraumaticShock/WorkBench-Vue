<template>
    <div class="card bg-base-100 shadow-xl h-full relative overflow-hidden">
        <!-- 顶部装饰条 -->
        <div class="absolute top-0 left-0 right-0 h-12 bg-gradient-to-r from-neutral to-neutral/70">
            <div class="flex items-center justify-between h-full px-6">
                <div class="flex items-center">
                    <h2 class="text-xl font-semibold text-white">笔记</h2>
                </div>
                <div class="flex items-center gap-2">
                    <button class="btn btn-sm btn-ghost text-white hover:text-white gap-2"
                        @click="showCategoryManage = true">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        分类管理
                    </button>
                </div>
            </div>
        </div>

        <!-- 主内容区域 -->
        <div class="flex h-full pt-12">
            <!-- 左侧分类导航 -->
            <div class="w-[15%] border-r border-base-200 bg-base-100">
                <div class="p-4">
                    <!-- 搜索框 -->
                    <div class="relative mb-4">
                        <input type="text" placeholder="搜索笔记..." class="input input-bordered w-full pl-10" />
                        <svg xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <!-- 分类树 -->
                    <ul class="menu menu-xs">
                        <li>
                            <a class="active">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                全部笔记
                                <span class="badge badge-sm">{{ noteState.stats.count }}</span>
                            </a>
                        </li>

                        <!-- 分类列表 -->
                        <li v-for="(count, category) in noteState.stats.categoryCount" :key="category">
                            <a>
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                </svg>
                                {{ category }}
                                <span class="badge badge-sm">{{ count }}</span>
                            </a>
                        </li>

                        <!-- 特殊分类 -->
                        <div class="divider"></div>
                        <li>
                            <a>
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                                收藏笔记
                                <span class="badge badge-sm badge-warning">0</span>
                            </a>
                        </li>
                        <li>
                            <a>
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                最近更新
                                <span class="badge badge-sm badge-primary">{{ noteState.stats.monthCount }}</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- 右侧内容区域 -->
            <div class="flex-1 overflow-hidden">
                <!-- 笔记列表内容 -->
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useNoteStore } from '@/stores/note'
import { storeToRefs } from 'pinia'

const noteStore = useNoteStore()
const { state: noteState } = storeToRefs(noteStore)
const showCategoryManage = ref(false)

</script>

<style scoped>
.menu :where(li:not(.menu-title):not(:empty))>:where(:not(ul).active) {
    background-color: hsl(var(--p) / 0.1);
    color: hsl(var(--p));
}

/* 自定义滚动条样式 */
::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

::-webkit-scrollbar-track {
    background: transparent;
}

::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
    background: #ccc;
}
</style>