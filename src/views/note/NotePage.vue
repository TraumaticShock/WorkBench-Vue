<template>
    <div class="card bg-base-200 shadow-xl h-full flex flex-col">
        <div class="card-body p-0 flex flex-col h-full">
            <!-- 顶部搜索和工具栏 -->
            <div class="px-6 pt-6 pb-4 border-b border-base-300">
                <div class="flex flex-col gap-4">
                    <!-- 标题和新建按钮 -->
                    <div class="flex items-center justify-between">
                        <h2 class="card-title">我的笔记</h2>
                        <button class="btn btn-primary gap-2" @click="router.push('/note/edit')">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            写笔记
                        </button>
                    </div>
                    <!-- 搜索和筛选 -->
                    <div class="flex items-center gap-4">
                        <div class="flex-1 relative">
                            <input type="text" placeholder="搜索笔记..." class="input input-bordered w-full pl-10" />
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 opacity-50"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <div class="dropdown">
                            <label tabindex="0" class="btn btn-ghost gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                                筛选
                            </label>
                            <ul tabindex="0" class="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-52">
                                <li><a @click="handleTagClick({})">全部笔记</a></li>
                                <li><a @click="handleTagClick({ category: 'work' })">工作笔记</a></li>
                                <li><a @click="handleTagClick({ category: 'study' })">学习笔记</a></li>
                                <li><a @click="handleTagClick({ category: 'life' })">生活随笔</a></li>
                            </ul>
                        </div>
                        <div class="dropdown">
                            <label tabindex="0" class="btn btn-ghost gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M4 6h16M4 12h16m-7 6h7" />
                                </svg>
                                排序
                            </label>
                            <ul tabindex="0" class="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-52">
                                <li><a>最近更新</a></li>
                                <li><a>最近创建</a></li>
                                <li><a>标题排序</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 笔记列表区域 -->
            <div class="overflow-y-auto px-6 py-4 flex-1 min-h-0" ref="scrollContainer" id="scrollContainer">
                <!-- 加载状态 -->
                <div v-if="loading" class="flex items-center justify-center py-12">
                    <div class="loading loading-dots loading-lg"></div>
                </div>

                <!-- 空状态 -->
                <div v-else-if="!noteStore.state.notePage.records.length" class="flex flex-col items-center justify-center py-12 gap-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 opacity-20" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p class="text-base-content/50">暂无笔记，开始写作吧</p>
                    <button class="btn btn-primary btn-sm gap-2" @click="router.push('/note/edit')">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        新建笔记
                    </button>
                </div>

                <!-- 笔记列表 -->
                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div v-for="note in noteStore.state.notePage.records" :key="note.id"
                        class="card bg-base-100 hover:shadow-lg transition-all duration-300 group">
                        <div class="card-body p-5">
                            <!-- 笔记标题和操作按钮 -->
                            <div class="flex items-start justify-between">
                                <h3 class="card-title text-base group-hover:text-primary transition-colors line-clamp-2">
                                    {{ note.title }}
                                </h3>
                                <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button class="btn btn-ghost btn-xs btn-square"
                                        @click.stop="router.push(`/note/edit/${note.id}`)">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    </button>
                                    <button class="btn btn-ghost btn-xs btn-square text-error"
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
                            <div class="text-sm opacity-60 line-clamp-3 mt-2 mb-4 min-h-[4.5em]">
                                {{ note.content }}
                            </div>

                            <!-- 底部信息 -->
                            <div class="flex items-center justify-between text-xs opacity-50">
                                <div class="flex items-center gap-3">
                                    <span class="badge badge-sm">{{ note.category }}</span>
                                    <span>{{ new Date(note.updatedAt).toLocaleDateString() }}</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                    {{ note.wordCount || 0 }} 字
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 分页 -->
                <div v-if="noteStore.state.notePage.records.length" class="flex justify-center mt-8">
                    <div class="join">
                        <button class="join-item btn btn-sm" 
                            :disabled="noteStore.state.notePage.current === 1"
                            @click="changePage(noteStore.state.notePage.current - 1)">«</button>
                        <button class="join-item btn btn-sm">
                            {{ noteStore.state.notePage.current }} / {{ noteStore.state.notePage.pages }}
                        </button>
                        <button class="join-item btn btn-sm"
                            :disabled="noteStore.state.notePage.current === noteStore.state.notePage.pages"
                            @click="changePage(noteStore.state.notePage.current + 1)">»</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 删除确认对话框 -->
    <dialog id="delete_confirm_modal" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
            <h3 class="font-bold text-lg">删除笔记</h3>
            <p class="py-4">确定要删除这个笔记吗？此操作不可撤销。</p>
            <div class="modal-action">
                <button class="btn btn-ghost" @click="handleModal('delete_confirm_modal', 'close')">取消</button>
                <button class="btn btn-error" @click="confirmDelete">删除</button>
            </div>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button>关闭</button>
        </form>
    </dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNoteStore } from '@/stores/note'

const router = useRouter()
const noteStore = useNoteStore()
const loading = ref(false)
const noteToDelete = ref('')

// 添加当前筛选条件的状态
const currentFilter = ref({
    category: undefined as string | undefined,
})

// 统一的标签切换处理方法
const handleTagClick = async (filter: { category?: string }) => {
    currentFilter.value = {
        category: filter.category ?? undefined,
    }
    await fetchNoteList(1)
}

// 统一的 Modal 处理方法
const handleModal = (modalId: string, action: 'show' | 'close') => {
    const modal = document.getElementById(modalId) as HTMLDialogElement
    if (action === 'show') {
        modal?.showModal()
    } else {
        modal?.close()
    }
}

// 获取笔记列表
const fetchNoteList = async (page = 1) => {
    if (loading.value) return

    try {
        loading.value = true
        await noteStore.getNotePage({
            page,
            size: 12,
            ...currentFilter.value,
        })
    } catch (error) {
        console.error('获取笔记列表失败:', error)
    } finally {
        loading.value = false
    }
}

// 处理删除
const handleDelete = (id: string) => {
    noteToDelete.value = id
    handleModal('delete_confirm_modal', 'show')
}

// 确认删除
const confirmDelete = async () => {
    try {
        await noteStore.deleteNote(noteToDelete.value)
        handleModal('delete_confirm_modal', 'close')
        
        // 如果当前页没有数据了且不是第一页，则加载上一页
        if (noteStore.state.notePage.records.length === 0 && noteStore.state.notePage.current > 1) {
            await fetchNoteList(noteStore.state.notePage.current - 1)
        }
    } catch (error) {
        console.error('删除笔记失败:', error)
    }
}

// 切换页面
const changePage = async (page: number) => {
    if (page < 1 || page > noteStore.state.notePage.pages) return
    await fetchNoteList(page)
}

// 初始化
onMounted(() => {
    fetchNoteList()
})
</script>

<style scoped>
/* 滚动条样式 */
.overflow-y-auto::-webkit-scrollbar {
    width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
    background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.3);
}

/* 文本截断 */
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style> 