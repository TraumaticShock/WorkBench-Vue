<template>
    <div class="card bg-base-200 shadow-xl h-full flex flex-col">
        <div class="card-body p-0 flex flex-col h-full">
            <!-- 工具栏 -->
            <div class="px-6 pt-6 pb-4 border-b border-base-300">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4">
                        <div class="flex items-center gap-4">
                            <h2 class="card-title text-sm">待办列表</h2>
                            <div class="flex items-center gap-2 text-xs">
                                <div class="flex items-center gap-1">
                                    <div class="badge badge-outline badge-sm cursor-pointer hover:opacity-80"
                                        @click="handleTagClick({})">全部 {{ todoStore.state.stats.totalCount || 0 }}</div>
                                </div>
                                <div class="flex items-center gap-1">
                                    <div class="badge badge-error badge-outline badge-sm cursor-pointer hover:opacity-80"
                                        @click="handleTagClick({ priority: 'high' })">紧急 {{ todoStore.state.stats.urgentCount || 0 }}</div>
                                </div>
                                <div class="flex items-center gap-1">
                                    <div class="badge badge-warning badge-outline badge-sm cursor-pointer hover:opacity-80"
                                        @click="handleTagClick({ priority: 'medium' })">重要 {{ todoStore.state.stats.importantCount || 0 }}
                                    </div>
                                </div>
                                <div class="flex items-center gap-1">
                                    <div class="badge badge-accent badge-outline badge-sm cursor-pointer hover:opacity-80"
                                        @click="handleTagClick({ priority: 'low' })">一般 {{ todoStore.state.stats.normalCount || 0 }}</div>
                                </div>
                                <div class="flex items-center gap-1">
                                    <div class="badge badge-success badge-outline badge-sm cursor-pointer hover:opacity-80"
                                        @click="handleTagClick({ status: 'completed' })">已完成 {{ todoStore.state.stats.completeCount || 0 }}
                                    </div>
                                </div>
                                <div class="flex items-center gap-1">
                                    <div class="badge badge-secondary badge-outline badge-sm cursor-pointer hover:opacity-80"
                                        @click="handleTagClick({ status: 'pending' })">未完成 {{ todoStore.state.stats.uncompleteCount || 0 }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-sm" @click="showTodoModal = true">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        新建待办
                    </button>
                </div>
            </div>

            <!-- 待办列表 -->
            <div class="overflow-y-auto px-6 flex-1 min-h-0" ref="scrollContainer" id="scrollContainer">
                <!-- 使用 flex 布局平分宽度和高度 -->
                <div class="flex gap-6 h-full">
                    <!-- 待办列表部分 -->
                    <div class="flex-1">
                        <!-- 加载状态和空数据提示 -->
                        <div v-if="loading && !todoStore.state.todoPage.records.length" class="text-center py-2">
                            <span class="loading loading-dots loading-md"></span>
                        </div>
                        <div v-else-if="!todoStore.state.todoPage.records.length" class="text-center py-2 text-gray-500">
                            暂无待办事项
                        </div>
                        <!-- 待办列表项 -->
                        <template v-else>
                            <div v-for="todo in todoStore.state.todoPage.records" :key="todo.id"
                                class="todo-item mb-2 last:mb-0 flex items-center gap-3 p-3 bg-base-100 rounded-lg hover:bg-base-300 transition-colors cursor-pointer"
                                @click="selectTodo(todo)">
                                <input type="checkbox" :checked="todo.status === 'completed'"
                                    class="checkbox checkbox-sm"
                                    @change="toggleTodo(todo.id.toString(), todo.status)" />
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center gap-2 flex-wrap">
                                        <span class="truncate flex-shrink" :class="{ 'line-through opacity-50': todo.status === 'completed' }">
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
                                                {{ new Date(todo.dueDate).toLocaleDateString('zh-CN', { weekday: 'long' }) }}
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
                            <!-- 分页部分 -->
                            <div class="py-2 border-t border-base-300 flex items-center justify-center gap-2 mt-4">
                                <button class="btn btn-xs btn-ghost" :disabled="todoStore.state.todoPage.current === 1"
                                    @click="changePage(todoStore.state.todoPage.current - 1)">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <span class="text-xs opacity-50">第 {{ todoStore.state.todoPage.current }} / {{ todoStore.state.todoPage.pages }}
                                    页</span>
                                <button class="btn btn-xs btn-ghost" :disabled="todoStore.state.todoPage.current === todoStore.state.todoPage.pages"
                                    @click="changePage(todoStore.state.todoPage.current + 1)">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                                <!-- 添加页面跳转功能 -->
                                <div class="flex items-center gap-2 ml-4">
                                    <span class="text-xs opacity-50">跳转到</span>
                                    <input type="number" class="input input-xs input-bordered w-14" v-model="jumpPage"
                                        min="1" :max="todoStore.state.todoPage.pages" @keyup.enter="handleJump">
                                    <button class="btn btn-xs btn-primary" @click="handleJump"
                                        :disabled="!isValidJumpPage">
                                        跳转
                                    </button>
                                </div>
                            </div>
                        </template>
                    </div>
                    <!-- 待办详情部分 -->
                    <div class="flex-1 rounded-lg p-4 relative">
                        <div v-if="selectedTodo" class="space-y-4">
                            <!-- 标题 -->
                            <div class="flex items-center">
                                <input v-model="selectedTodo.title"
                                    class="text-lg font-bold bg-transparent border-b border-transparent hover:border-base-300 focus:border-primary outline-none w-full">
                            </div>

                            <!-- 标签和状态 -->
                            <div class="flex items-center gap-2">
                                <!-- 优先级选择 -->
                                <select v-model="selectedTodo.priority" class="select select-sm select-bordered">
                                    <option value="high">紧急</option>
                                    <option value="medium">重要</option>
                                    <option value="low">一般</option>
                                </select>

                                <!-- 分类输入 -->
                                <!-- <input v-model="selectedTodo.category" class="input input-sm input-bordered"
                                    placeholder="分类"> -->
                                <select class="select select-bordered" v-model="selectedTodo.category" required>
                                    <option value="">请选择分类</option>
                                    <option v-for="category in categories" :key="category.id" :value="category.name">
                                        {{ category.name }}
                                    </option>
                                </select>

                                <!-- 状态切换 -->
                                <select v-model="selectedTodo.status" class="select select-sm select-bordered">
                                    <option value="pending">进行中</option>
                                    <option value="completed">已完成</option>
                                </select>
                            </div>

                            <!-- 截止日期 -->
                            <div class="form-control">
                                <label class="label">
                                    <span class="label-text text-sm opacity-70">截止日期</span>
                                </label>
                                <input type="datetime-local" v-model="selectedTodo.dueDate"
                                    class="input input-sm input-bordered">
                            </div>

                            <!-- 描述 -->
                            <div class="form-control">
                                <label class="label">
                                    <span class="label-text text-sm opacity-70">描述</span>
                                </label>
                                <textarea v-model="selectedTodo.description"
                                    class="textarea textarea-bordered min-h-[600px]" placeholder="添加描述..."></textarea>
                            </div>

                            <!-- 创建时间 -->
                            <div class="text-xs opacity-50 mb-16">
                                创建时间：{{ new Date(selectedTodo.createdAt).toLocaleString() }}
                            </div>

                            <!-- 保存按钮 - 固定在右下角 -->
                            <div class="absolute bottom-4 right-4">
                                <button class="btn btn-primary" @click="saveChanges">
                                    保存更改
                                </button>
                            </div>
                        </div>
                        <div v-else class="h-full flex items-center justify-center text-sm opacity-50">
                            选择一个待办查看详情
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 待办编辑对话框 -->
    <TodoEditDialog v-model="showTodoModal" @submit="handleSubmit" />

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
import type { CreateTodoFormParams, Todo } from '@/types/todo'
import { ref, onMounted, computed } from 'vue'
import TodoEditDialog from '@/components/todo/TodoEditDialog.vue'

const todoStore = useTodoStore()
const showTodoModal = ref(false)
const loading = ref(false)
const jumpPage = ref(1)
const todoToDelete = ref('')
const selectedTodo = ref<Todo | null>(null)
    const categories = ref([
    { id: '1', name: '工作' },
    { id: '2', name: '生活' },
    { id: '3', name: '学习' }
]);

// 添加当前筛选条件的状态
const currentFilter = ref({
    status: undefined as string | undefined,
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
            append: false // 明确指定不使用追加模式
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

// 处理创建待办
const handleSubmit = async (todoData: CreateTodoFormParams) => {
    try {
        await todoStore.createTodo(todoData)
        showTodoModal.value = false
        await todoStore.refreshAllTodoData()
    } catch (error) {
        console.error('创建待办失败:', error)
    }
}

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
const toggleTodo = async (id: string, currentStatus: 'completed' | 'pending') => {
    try {
        const newStatus = currentStatus === 'completed' ? 'pending' : 'completed'
        await todoStore.updateTodo(id, { status: newStatus } as any)
    } catch (error) {
        console.error('更新待办状态失败:', error)
    }
}

// 切换页面
const changePage = async (page: number) => {
    if (page < 1 || page > todoStore.state.todoPage.pages) return
    await fetchTodoList(page)
}

// 判断跳转页码是否有效
const isValidJumpPage = computed(() => {
    const page = Number(jumpPage.value)
    return page >= 1 && page <= todoStore.state.todoPage.pages
})

// 处理跳转
const handleJump = () => {
    if (isValidJumpPage.value) {
        changePage(Number(jumpPage.value))
    }
}

// 选择待办
const selectTodo = (todo: Todo) => {
    selectedTodo.value = { ...todo }
}

// 保存更改
const saveChanges = async () => {
    if (!selectedTodo.value) return

    try {
        const updateData = {
            title: selectedTodo.value.title,
            description: selectedTodo.value.description,
            priority: selectedTodo.value.priority,
            category: selectedTodo.value.category,
            dueDate: selectedTodo.value.dueDate,
            status: selectedTodo.value.status
        }
        
        await todoStore.updateTodo(selectedTodo.value.id.toString(), updateData)
        
        // 更新列表中的对应项
        const index = todoStore.state.todoPage.records.findIndex(
            todo => todo.id === selectedTodo.value?.id
        )
        if (index !== -1) {
            todoStore.state.todoPage.records[index] = { ...selectedTodo.value }
        }
    } catch (error) {
        console.error('更新待办失败:', error)
    }
}

onMounted(() => {
    fetchTodoList()
    todoStore.refreshAllTodoData()
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
    height: 80px; /* 设置固定高度 */
    min-height: 80px;
}

/* 描述文本样式 */
.description-text {
    display: -webkit-box;
    -webkit-line-clamp: 1; /* 只显示一行 */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    height: 1.5em; /* 固定高度为一行 */
}

/* 标题文本样式 */
.truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px; /* 设置最大宽度 */
}
</style>