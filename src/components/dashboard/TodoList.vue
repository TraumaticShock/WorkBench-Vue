<template>
    <div class="card bg-base-100 shadow-xl h-[400px] relative overflow-hidden">
        <div class="absolute top-0 left-0 right-0 h-12 bg-gradient-to-r from-neutral to-neutral/70">
            <div class="flex items-center justify-between h-full px-6">
                <h2 class="text-xl font-semibold text-white">待办列表</h2>
                <div class="flex items-center gap-2 text-white">
                    <div class="badge badge-sm cursor-pointer hover:opacity-80"
                        :class="[!currentFilter.status && !currentFilter.priority ? 'badge-neutral text-base-100' : 'badge-outline']"
                        @click="handleTagClick({})">全部 {{ todoStore.state.stats.totalCount }}</div>
                    <div class="badge badge-error badge-sm cursor-pointer hover:opacity-80"
                        :class="[currentFilter.priority === 'high' ? 'text-base-100' : 'badge-outline']"
                        @click="handleTagClick({ priority: 'high' })">紧急 {{ todoStore.state.stats.urgentCount }}</div>
                    <div class="badge badge-success badge-sm cursor-pointer hover:opacity-80"
                        :class="[currentFilter.status === 'completed' ? 'text-base-100' : 'badge-outline']"
                        @click="handleTagClick({ status: 'completed' })">已完成 {{ todoStore.state.stats.completeCount }}
                    </div>
                    <div class="badge badge-warning badge-sm cursor-pointer hover:opacity-80"
                        :class="[currentFilter.status === 'pending' ? 'text-base-100' : 'badge-outline']"
                        @click="handleTagClick({ status: 'pending' })">未完成 {{ todoStore.state.stats.uncompleteCount }}
                    </div>
                </div>
            </div>
        </div>
        <div class="card-body h-full flex flex-col pt-16 p-0">
            <!-- 待办列表项 -->
            <div class="overflow-y-auto px-6 flex-1 min-h-0" ref="scrollContainer" id="scrollContainer"
                @scroll="handleScroll">
                <!-- 列表容器 -->
                <div class="py-2">
                    <!-- 加载状态和空数据提示 -->
                    <div v-if="todoStore.state.loading && !todoStore.state.todoPage.records.length"
                        class="text-center py-2">
                        <span class="loading loading-dots loading-md"></span>
                    </div>
                    <div v-else-if="!todoStore.state.todoPage.records.length" class="text-center py-2 text-gray-500">
                        暂无待办事项
                    </div>

                    <!-- 待办列表项 -->
                    <template v-else>
                        <div v-for="todo in todoStore.state.todoPage.records" :key="todo.id"
                            class="mb-2 last:mb-0 flex items-center gap-3 p-3 bg-base-100 border-2 border-base-200/70 hover:border-base-300 shadow-sm hover:shadow-md transition-all rounded-xl">
                            <input type="checkbox" :checked="todo.status === 'completed'" class="checkbox checkbox-sm"
                                @change="toggleTodo(todo.id.toString(), todo.status)" />
                            <div class="flex-1">
                                <div class="flex items-center gap-2">
                                    <span :class="{ 'line-through opacity-50': todo.status === 'completed' }">{{
                                        todo.title
                                        }}</span>
                                    <div v-if="todo.priority"
                                        :class="`badge ${getPriorityClass(todo.priority)} badge-sm`">
                                        {{ getPriorityText(todo.priority) }}
                                    </div>
                                    <div v-if="todo.category" class="badge badge-ghost badge-sm">
                                        {{ todo.category }}
                                    </div>
                                    <div v-if="todo.dueDate" class="text-xs opacity-50">
                                        {{ new Date(todo.dueDate).toLocaleDateString('zh-CN', {
                                            year: 'numeric', month:
                                                'long', day: 'numeric'
                                        }) }}
                                        {{ new Date(todo.dueDate).toLocaleDateString('zh-CN', { weekday: 'long' }) }}
                                    </div>
                                </div>
                                <div v-if="todo.description"
                                    class="text-xs opacity-50 mt-1 line-clamp-2 cursor-pointer text-left"
                                    style="max-height: 2.4em; min-height: 0;"
                                    @click="openDescription(todo.description)">
                                    {{ todo.description }}
                                </div>
                            </div>
                            <button class="btn btn-ghost btn-xs btn-square" @click="handleEdit(todo)">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                            <button class="btn btn-ghost btn-xs btn-square" @click="handleDelete(todo.id.toString())">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </template>

                    <!-- 底部加载提示 -->
                    <div v-if="todoStore.state.loading && todoStore.state.todoPage.records.length"
                        class="text-center py-2">
                        <span class="loading loading-dots loading-md"></span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 编辑详情 -->
    <dialog id="edit_modal" class="modal">
        <div class="modal-box max-w-2xl p-0 bg-transparent h-[80vh]" @click.stop>
            <TodoDetail :todo="selectedTodo" @save="saveChanges" @cancel="handleModal('edit_modal', 'close')" />
        </div>
        <form method="dialog" class="modal-backdrop">
            <button @click="selectedTodo = null">关闭</button>
        </form>
    </dialog>

    <!-- 修改 Modal -->
    <dialog id="description_modal" class="modal" @click="handleModal('description_modal', 'close')">
        <div class="modal-box" @click.stop>
            <h3 class="font-bold text-lg">备注详情</h3>
            <p class="py-4">{{ currentDescription }}</p>
            <div class="modal-action">
                <button class="btn" @click="handleModal('description_modal', 'close')">关闭</button>
            </div>
        </div>
    </dialog>

    <!-- 编辑对话框 -->
    <TodoEditDialog v-model="showTodoModal" :is-edit="true" :initial-data="selectedTodo" @submit="saveChanges" />

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
import { ref, onMounted } from 'vue'
import TodoEditDialog from '@/components/todo/TodoEditDialog.vue'
import TodoDetail from '@/components/todo/TodoDetail.vue'

const todoStore = useTodoStore()
const currentDescription = ref('')
const showTodoModal = ref(false)
const todoToDelete = ref('')
const selectedTodo = ref<Todo | null>(null)

onMounted(() => {
    // 获取待办列表
    fetchTodoList(1, false)
})

// 获取待办列表方法
const fetchTodoList = async (page = 1, append = false) => {
    if (todoStore.state.loading) return

    try {
        todoStore.state.loading = true
        await todoStore.getTodoPage({
            page,
            size: 10,
            ...currentFilter.value,
            append
        })
    } catch (error) {
        console.error('获取待办列表失败:', error)
    } finally {
        todoStore.state.loading = false
    }
}

// 添加当前筛选条件的状态
const currentFilter = ref({
    status: 'pending' as string | undefined,
    priority: undefined as string | undefined
})

// 统一的标签切换处理方法
const handleTagClick = async (filter: { status?: string | undefined, priority?: string | undefined }) => {
    await todoStore.initTodoPage()
    currentFilter.value = {
        status: filter.status ?? undefined,
        priority: filter.priority ?? undefined
    }
    await fetchTodoList(1, false)
    scrollToTop()
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

// 优先级相关的常量
const PRIORITY_CONFIG = {
    high: { class: 'badge-error', text: '紧急' },
    medium: { class: 'badge-warning', text: '重要' },
    low: { class: 'badge-info', text: '一般' }
} as const

const getPriorityClass = (priority: string) =>
    PRIORITY_CONFIG[priority as keyof typeof PRIORITY_CONFIG]?.class || 'badge-ghost'

const getPriorityText = (priority: string) =>
    PRIORITY_CONFIG[priority as keyof typeof PRIORITY_CONFIG]?.text || priority

const scrollToTop = () => {
    document.getElementById('scrollContainer')?.scrollTo({ top: 0, behavior: 'smooth' })
}

// 处理编辑
const handleEdit = (todo: Todo) => {
    selectedTodo.value = { ...todo }
    handleModal('edit_modal', 'show')
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

        await todoStore.updateTodo(updatedTodo.id.toString(), updateData)
        selectedTodo.value = null
        handleModal('edit_modal', 'close')
    } catch (error) {
        console.error('更新待办失败:', error)
    }
}

const openDescription = (description: string) => {
    currentDescription.value = description
    handleModal('description_modal', 'show')
}

const handleScroll = async (e: Event) => {
    const target = e.target as HTMLElement
    const scrollBottom = target.scrollHeight - target.scrollTop - target.clientHeight

    if (scrollBottom < 50 && !todoStore.state.loading && todoStore.state.todoPage.pages > todoStore.state.todoPage.current) {
        await fetchTodoList(todoStore.state.todoPage.current + 1, true)
    }
}

const handleDelete = (id: string) => {
    todoToDelete.value = id
    handleModal('delete_confirm_modal', 'show')
}

const confirmDelete = async () => {
    try {
        await todoStore.deleteTodo(todoToDelete.value)
        handleModal('delete_confirm_modal', 'close')
    } catch (error) {
        console.error('删除待办失败:', error)
    }
}

const toggleTodo = async (id: string, currentStatus: 'completed' | 'pending') => {
    try {
        await todoStore.toggleTodoStatus(id, currentStatus)
    } catch (error) {
        console.error('更新待办状态失败:', error)
    }
}

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