<template>
    <div class="card bg-base-200 shadow-xl h-full flex flex-col">
        <div class="card-body p-0 flex flex-col h-full">
            <!-- 顶部工具栏 -->
            <div class="px-6 pt-6 pb-4 border-b border-base-300">
                <div class="flex flex-col gap-4">
                    <!-- 标题和新建按钮 -->
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-4">
                            <h2 class="card-title">我的待办</h2>
                            <div class="flex items-center gap-1 text-xs">
                                <div class="badge badge-sm cursor-pointer hover:opacity-80"
                                    :class="[!currentFilter.status && !currentFilter.priority ? 'badge-neutral text-base-100' : 'badge-outline']"
                                    @click="handleTagClick({})">全部 {{ todoStore.state.stats.totalCount || 0 }}</div>
                                <div class="badge badge-error badge-sm cursor-pointer hover:opacity-80"
                                    :class="[currentFilter.priority === 'high' ? 'text-base-100' : 'badge-outline']"
                                    @click="handleTagClick({ priority: 'high' })">紧急 {{ todoStore.state.stats.urgentCount || 0 }}</div>
                                <div class="badge badge-warning badge-sm cursor-pointer hover:opacity-80"
                                    :class="[currentFilter.priority === 'medium' ? 'text-base-100' : 'badge-outline']"
                                    @click="handleTagClick({ priority: 'medium' })">重要 {{ todoStore.state.stats.importantCount || 0 }}</div>
                                <div class="badge badge-accent badge-sm cursor-pointer hover:opacity-80"
                                    :class="[currentFilter.priority === 'low' ? 'text-base-100' : 'badge-outline']"
                                    @click="handleTagClick({ priority: 'low' })">一般 {{ todoStore.state.stats.normalCount || 0 }}</div>
                                <div class="badge badge-success badge-sm cursor-pointer hover:opacity-80"
                                    :class="[currentFilter.status === 'completed' ? 'text-base-100' : 'badge-outline']"
                                    @click="handleTagClick({ status: 'completed' })">已完成 {{ todoStore.state.stats.completeCount || 0 }}</div>
                                <div class="badge badge-secondary badge-sm cursor-pointer hover:opacity-80"
                                    :class="[currentFilter.status === 'pending' ? 'text-base-100' : 'badge-outline']"
                                    @click="handleTagClick({ status: 'pending' })">未完成 {{ todoStore.state.stats.uncompleteCount || 0 }}</div>
                            </div>
                        </div>
                        <button class="btn btn-primary gap-2" @click="selectedTodo = {}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                            </svg>
                            新建待办
                        </button>
                    </div>
                    <!-- 搜索和筛选 -->
                    <div class="flex items-center gap-4">
                        <div class="flex-1 relative">
                            <input type="text" 
                                placeholder="搜索待办..." 
                                class="input input-bordered w-full pl-10" 
                                v-model="searchQuery"
                                @input="handleSearch" />
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 待办列表 -->
            <div class="overflow-y-auto px-6 py-4 flex-1 min-h-0" ref="scrollContainer" id="scrollContainer">
                <!-- 使用 flex 布局平分宽度和高度 -->
                <div class="flex gap-6 h-full">
                    <!-- 待办列表部分 -->
                    <div class="flex-1">
                        <!-- 加载状态和空数据提示 -->
                        <div v-if="loading && !todoStore.state.todoPage.records.length" class="text-center py-2">
                            <span class="loading loading-dots loading-md"></span>
                        </div>
                        <div v-else-if="!todoStore.state.todoPage.records.length"
                            class="text-center py-2 text-gray-500">
                            暂无待办事项
                        </div>
                        <!-- 待办列表项 -->
                        <template v-else>
                            <div v-for="todo in todoStore.state.todoPage.records" :key="todo.id"
                                class="todo-item mb-2 last:mb-0 flex items-center gap-3 p-3 bg-base-100 rounded-lg hover:bg-base-300 transition-colors cursor-pointer"
                                @click="selectTodo(todo)">
                                <input type="checkbox" :checked="todo.status === 'completed'"
                                    class="checkbox checkbox-sm"
                                    @change="toggleTodo(todo.id.toString(), todo.status, $event)" />
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center gap-2 flex-wrap">
                                        <span class="truncate flex-shrink"
                                            :class="{ 'line-through opacity-50': todo.status === 'completed' }">
                                            {{ todo.title }}
                                        </span>
                                        <div class="flex items-center gap-2 flex-wrap">
                                            <div v-if="todo.priority"
                                                :class="`badge ${getPriorityClass(todo.priority)} badge-sm`">
                                                {{ getPriorityText(todo.priority) }}
                                            </div>
                                            <div v-if="todo.category" class="badge badge-ghost badge-sm">
                                                {{ todo.category }}
                                            </div>
                                            <div v-if="todo.dueDate" class="text-xs opacity-50">
                                                {{ new Date(todo.dueDate).toLocaleDateString('zh-CN', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                }) }}
                                                {{ new Date(todo.dueDate).toLocaleDateString('zh-CN', {
                                                    weekday: 'long'
                                                }) }}
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="todo.description"
                                        class="description-text text-xs opacity-50 mt-1 text-left">
                                        {{ todo.description }}
                                    </div>
                                </div>
                                <div class="flex items-center gap-1 flex-shrink-0">
                                    <button class="btn btn-ghost btn-xs btn-square text-error"
                                        @click.stop="handleDelete(todo.id.toString())">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <!-- 分页控制 -->
                            <div class="flex justify-center mt-4">
                                <Pagination 
                                    v-model:current="todoStore.state.todoPage.current"
                                    :total="todoStore.state.todoPage.pages"
                                    @update:current="changePage" />
                            </div>
                        </template>
                    </div>
                    <!-- 待办详情部分 -->
                    <TodoDetail :todo="selectedTodo" @save="saveChanges" @cancel="handleModal('edit_modal', 'close')"
                        class="w-11/12 max-w-3xl h-[calc(100%-3rem)]" />
                </div>
            </div>
        </div>
    </div>

    <!-- 添加删除确认对话框 -->
    <dialog id="delete_confirm_modal" class="modal">
        <div class="modal-box">
            <h3 class="font-bold text-lg">确认删除</h3>
            <p class="py-4">确定要删除这个待办吗？此操作不可撤销。</p>
            <div class="modal-action">
                <button class="btn" @click="handleModal('delete_confirm_modal', 'close')">取消</button>
                <button class="btn btn-error" @click="confirmDelete">删除</button>
            </div>
        </div>
    </dialog>
</template>

<script setup lang="ts">
import { useTodoStore } from '@/stores/todo'
import type { Todo } from '@/types/todo'
import { ref, onMounted, watch } from 'vue'
import TodoDetail from '@/components/todo/TodoDetail.vue'
import Pagination from '@/components/common/Pagination.vue'

const todoStore = useTodoStore()
const loading = ref(false)
const todoToDelete = ref('')
const selectedTodo = ref<Todo | Partial<Todo> | null>(null)

// 添加当前筛选条件的状态
const currentFilter = ref({
    status: 'pending' as string | undefined,
    priority: undefined as string | undefined
})

// 统一的标签切换处理方法
const handleTagClick = async (filter: { status?: string | undefined, priority?: string | undefined }) => {
    currentFilter.value = {
        status: filter.status ?? undefined,
        priority: filter.priority ?? undefined
    }
    await fetchTodoList(1)
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

// 修改获取待办列表方法
const fetchTodoList = async (page = 1) => {
    if (loading.value) return

    try {
        loading.value = true
        await todoStore.getTodoPage({
            page,
            size: 10,
            ...currentFilter.value,
            search: searchQuery.value
        })
    } catch (error) {
        console.error('获取待办列表失败:', error)
    } finally {
        loading.value = false
    }
}

// 优先级配置
const PRIORITY_CONFIG = {
    high: { class: 'badge-error', text: '紧急' },
    medium: { class: 'badge-warning', text: '重要' },
    low: { class: 'badge-info', text: '一般' }
} as const

const getPriorityClass = (priority: string) =>
    PRIORITY_CONFIG[priority as keyof typeof PRIORITY_CONFIG]?.class || 'badge-ghost'

const getPriorityText = (priority: string) =>
    PRIORITY_CONFIG[priority as keyof typeof PRIORITY_CONFIG]?.text || priority

// 处理删除
const handleDelete = (id: string) => {
    todoToDelete.value = id
    handleModal('delete_confirm_modal', 'show')
}

// 确认删除
const confirmDelete = async () => {
    try {
        await todoStore.deleteTodo(todoToDelete.value)
        handleModal('delete_confirm_modal', 'close')

        // 如果当前页没有数据了且不是第一页，则加载上一页
        if (todoStore.state.todoPage.records.length === 0 && todoStore.state.todoPage.current > 1) {
            await fetchTodoList(todoStore.state.todoPage.current - 1)
        }
    } catch (error) {
        console.error('删除待办失败:', error)
    }
}

// 切换待办状态
const toggleTodo = async (id: string, currentStatus: 'completed' | 'pending', event: Event) => {
    try {
        event.stopPropagation() // 阻止事件冒泡
        const newStatus = currentStatus === 'completed' ? 'pending' : 'completed'
        
        // 先在前端更新状态，提供即时反馈
        const index = todoStore.state.todoPage.records.findIndex(todo => todo.id.toString() === id)
        if (index !== -1) {
            if (currentFilter.value.status) {
                // 如果在特定状态标签下，移除该项
                todoStore.state.todoPage.records.splice(index, 1)
            } else {
                // 否则直接更新状态
                todoStore.state.todoPage.records[index].status = newStatus
            }
        }

        // 后端更新
        await todoStore.updateTodo(id, { status: newStatus } as any)
        
        // 如果当前页没有数据了且不是第一页，则加载上一页
        if (todoStore.state.todoPage.records.length === 0 && todoStore.state.todoPage.current > 1) {
            await fetchTodoList(todoStore.state.todoPage.current - 1)
        }
        
        // 只更新统计数据
        await todoStore.refreshStats()
    } catch (error) {
        console.error('更新待办状态失败:', error)
        // 如果失败，恢复原状态
        await fetchTodoList(todoStore.state.todoPage.current)
    }
}

// 切换页面
const changePage = async (page: number) => {
    if (page < 1 || page > todoStore.state.todoPage.pages) return
    await fetchTodoList(page)
}

// 选择待办
const selectTodo = (todo: Todo) => {
    selectedTodo.value = { ...todo }
}

// 保存更改
const saveChanges = async (updatedTodo: Todo) => {
    try {
        const updateData = {
            title: updatedTodo.title,
            description: updatedTodo.description,
            priority: updatedTodo.priority,
            status: updatedTodo.status,
            dueDate: updatedTodo.dueDate,
            category: updatedTodo.category || '工作'
        }

        if (updatedTodo.id) {
            // 更新现有待办
            await todoStore.updateTodo(updatedTodo.id.toString(), updateData)
            
            // 更新列表中的对应项
            const index = todoStore.state.todoPage.records.findIndex(
                todo => todo.id === updatedTodo.id
            )
            if (index !== -1) {
                todoStore.state.todoPage.records[index] = { ...updatedTodo }
            }
        } else {
            // 创建新待办
            const result = await todoStore.createTodo(updateData)
            // 如果是在第一页，将新创建的待办添加到列表开头
            if (todoStore.state.todoPage.current === 1) {
                todoStore.state.todoPage.records.unshift(result)
            }
        }

        // 只更新统计数据
        await todoStore.refreshStats()
        // 清除选中状态
        selectedTodo.value = null
    } catch (error) {
        console.error('保存待办失败:', error)
    }
}

const searchQuery = ref('')
const searchTimeout = ref<number | null>(null)

// 处理搜索
const handleSearch = () => {
    // 清除之前的定时器
    if (searchTimeout.value) {
        clearTimeout(searchTimeout.value)
    }

    // 设置新的定时器，300ms 后执行搜索
    searchTimeout.value = window.setTimeout(async () => {
        await fetchTodoList(1)
    }, 300)
}

// 监听搜索词变化
watch(searchQuery, () => {
    handleSearch()
})

onMounted(() => {
    fetchTodoList()
    todoStore.refreshStats()
})
</script>

<style scoped>
/* 添加美化的滚动条样式 */
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

/* 待办项样式 */
.todo-item {
    height: 80px;
    /* 设置固定高度 */
    min-height: 80px;
}

/* 描述文本样式 */
.description-text {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    height: 1.5em;
    /* 固定高度为一行 */
}

/* 标题文本样式 */
.truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
    /* 设置最大宽度 */
}
</style>