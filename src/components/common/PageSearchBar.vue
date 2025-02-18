<template>
    <div class="form-control relative w-full">
        <!-- 搜索图标 -->
        <div class="absolute left-0 top-0 h-full flex items-center px-3">
            <!-- 加载中动画 -->
            <span v-if="isLoading" class="loading loading-spinner loading-sm"></span>
            <!-- 搜索图标 -->
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 opacity-50" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </div>
        <input v-model="keyword" 
            type="text" 
            :placeholder="placeholder" 
            class="input input-bordered w-full pl-10" 
            @input="handleInput"
            @focus="showDropdown = true"
        />
        
        <!-- 搜索结果下拉框 -->
        <div v-if="showDropdown && (isLoading || keyword)" 
            class="absolute top-full left-0 w-full mt-1 bg-base-100 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
            <!-- 加载中 -->
            <div v-if="isLoading" class="p-4 text-center">
                <span class="loading loading-dots loading-md"></span>
            </div>
            <!-- 搜索结果列表 -->
            <template v-else>
                <div v-if="searchResults.length > 0">
                    <div v-for="result in searchResults" :key="result.id" 
                        class="p-3 hover:bg-base-200 cursor-pointer"
                        @click="handleResultClick(result)">
                        <div class="flex items-center gap-2">
                            <!-- 根据类型显示不同图标 -->
                            <svg v-if="result.type === 'file'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <svg v-else-if="result.type === 'note'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <div class="flex-1">
                                <div class="font-medium">{{ result.title }}</div>
                                <div class="text-sm opacity-70" v-html="result.highlight"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 无结果提示 -->
                <div v-else class="p-4 text-center opacity-70">
                    未找到相关内容
                </div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { searchApi } from '@/api/search'
import type { SearchResult } from '@/types/search'
import { useDebounce } from '@/hooks/useDebounce'

const props = defineProps<{
    type: 'todo' | 'note' | 'file'
    placeholder?: string
}>()

const emit = defineEmits<{
    'result-click': [result: SearchResult]
}>()

const keyword = ref('')
const searchResults = ref<SearchResult[]>([])
const showDropdown = ref(false)
const isLoading = ref(false)

// 根据类型选择对应的搜索方法
const getSearchMethod = (type: string) => {
    switch (type) {
        case 'todo':
            return searchApi.searchTodo
        case 'note':
            return searchApi.searchNote
        case 'file':
            return searchApi.searchFile
        default:
            return searchApi.search
    }
}

// 使用防抖处理搜索
const debouncedSearch = useDebounce(async (value: string) => {
    if (!value.trim()) {
        searchResults.value = []
        isLoading.value = false
        return
    }
    try {
        const searchMethod = getSearchMethod(props.type)
        const response = await searchMethod(value)
        if (response.data.code === 200) {
            searchResults.value = response.data.data
        }
    } catch (error) {
        console.error('搜索失败:', error)
        searchResults.value = []
    } finally {
        isLoading.value = false
    }
}, 300)

// 处理输入
const handleInput = () => {
    if (keyword.value.trim()) {
        isLoading.value = true
        debouncedSearch(keyword.value)
    } else {
        searchResults.value = []
        isLoading.value = false
    }
}

// 处理搜索按钮点击
const handleSearch = () => {
    if (keyword.value.trim()) {
        isLoading.value = true
        debouncedSearch(keyword.value)
    }
}

// 处理搜索结果点击
const handleResultClick = (result: SearchResult) => {
    showDropdown.value = false
    emit('result-click', result)
}

// 点击外部关闭下拉框
const closeDropdown = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (!target.closest('.form-control')) {
        showDropdown.value = false
    }
}

// 监听点击事件
window.addEventListener('click', closeDropdown)
</script>

<style scoped>
:deep(.highlight) {
    color: var(--primary);
    font-weight: 500;
}
</style> 