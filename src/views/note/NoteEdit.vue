<template>
    <div class="card bg-base-100 shadow-xl h-full relative overflow-hidden">
        <!-- 顶部装饰条 -->
        <div class="absolute top-0 left-0 right-0 h-12 bg-gradient-to-r from-neutral to-neutral/70">
            <div class="flex items-center h-full px-6">
                <h2 class="text-xl font-semibold text-white">编辑笔记</h2>
                <div class="flex items-center gap-2 ml-auto">
                    <button class="btn btn-sm btn-ghost text-white hover:text-white gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        保存
                    </button>
                    <button class="btn btn-sm btn-ghost text-white hover:text-white gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        取消
                    </button>
                </div>
            </div>
        </div>

        <!-- 主要内容区域 -->
        <div class="pt-16 h-full flex">
            <!-- 左侧编辑区域 -->
            <div class="w-[70%] border-r border-base-200 p-6 flex flex-col gap-6">
                <!-- 标题输入 -->
                <div class="form-control w-full">
                    <input type="text" placeholder="请输入标题..." v-model="note.title"
                        class="input input-lg input-ghost w-full text-xl font-medium px-0 focus:outline-none" />
                </div>

                <!-- 内容编辑区域 -->
                <div class="flex-1 relative">
                    <textarea class="textarea textarea-ghost w-full h-full resize-none focus:outline-none"
                        placeholder="开始写作..." v-model="note.content"></textarea>
                </div>
            </div>

            <!-- 右侧设置面板 -->
            <div class="w-[30%] p-6 space-y-6">
                <!-- 分类选择 -->
                <div class="form-control w-full">
                    <label class="label">
                        <span class="label-text font-medium">分类</span>
                    </label>
                    <select class="select select-bordered w-full" v-model="note.categoryId">
                        <option disabled value="">选择分类</option>
                        <option v-for="category in noteCategoryStore.categories" :key="category.id"
                            :value="category.id">
                            {{ category.name }}
                        </option>
                    </select>
                </div>

                <!-- 标签输入 -->
                <div class="form-control w-full">
                    <label class="label">
                        <span class="label-text font-medium">标签</span>
                    </label>
                    <input type="text" placeholder="输入标签，按回车添加" class="input input-bordered w-full" />
                    <div class="flex flex-wrap gap-2 mt-2">
                        <div v-for="tag in note.tags" :key="tag" class="badge badge-neutral gap-1">
                            {{ tag }}
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 cursor-pointer" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    </div>
                </div>

                <!-- 笔记信息 -->
                <div class="space-y-2 text-sm opacity-50">
                    <div>创建时间：{{ note.createTime || '暂无' }}</div>
                    <div>更新时间：{{ note.updateTime || '暂无' }}</div>
                    <div>字数统计：{{ note.content?.length || 0 }} 字</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useNoteStore } from '@/stores/note'
import { useNoteCategoryStore } from '@/stores/noteCategory'
import { Note } from '@/types/note'

const route = useRoute()
const noteStore = useNoteStore()
const noteCategoryStore = useNoteCategoryStore()
const noteId = route.params.id as string || ''

// 创建响应式变量存储笔记数据
const note = ref<Note>({
    id: '',
    title: '',
    content: '',
    categoryId: '',
    categoryName: '',
    createTime: '',
    updateTime: '',
    tags: []
})

onMounted(() => {
    if (noteId) {
        const noteData = noteStore.state.notePage.records.find((n: Note) => n.id === noteId)
        if (noteData) {
            note.value = noteData
        }
    }
})
</script>

<style scoped>
.card {
    border-radius: 1rem;
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