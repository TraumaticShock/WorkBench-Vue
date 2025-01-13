<template>
    <div class="card bg-base-200 shadow-xl h-[400px] flex flex-col">
        <!-- 固定的头部 -->
        <div class="p-6 pb-2 flex-none">
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-4">
                    <h2 class="card-title text-sm">待办列表</h2>
                    <div class="flex items-center gap-2 text-xs">
                        <div class="flex items-center gap-1">
                            <div class="badge badge-outline badge-sm cursor-pointer hover:opacity-80"
                                @click="getTodoPage">全部 {{ todoStore.totalCount?.count || 0 }}</div>
                        </div>
                        <div class="flex items-center gap-1">
                            <div class="badge badge-error badge-outline badge-sm cursor-pointer hover:opacity-80"
                                @click="getTodoPageUrgent">紧急 {{ todoStore.urgentCount?.count || 0 }}</div>
                        </div>
                        <div class="flex items-center gap-1">
                            <div class="badge badge-warning badge-outline badge-sm cursor-pointer hover:opacity-80"
                                @click="getTodoPageImportant">重要 {{ todoStore.importantCount?.count || 0 }}</div>
                        </div>
                        <div class="flex items-center gap-1">
                            <div class="badge badge-accent badge-outline badge-sm cursor-pointer hover:opacity-80"
                                @click="getTodoPageNormal">一般 {{ todoStore.normalCount?.count || 0 }}</div>
                        </div>
                        <div class="flex items-center gap-1">
                            <div class="badge badge-success badge-outline badge-sm cursor-pointer hover:opacity-80"
                                @click="getTodoPageCompleted">已完成 {{ todoStore.completeCount?.count || 0 }}</div>
                        </div>
                        <div class="flex items-center gap-1">
                            <div class="badge badge-secondary badge-outline badge-sm cursor-pointer hover:opacity-80"
                                @click="getTodoPageUncomplete">未完成 {{ todoStore.uncompleteCount?.count || 0 }}</div>
                        </div>
                    </div>
                </div>
                <div class="flex gap-2">
                    <button class="btn btn-sm btn-ghost">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                        </svg>
                        排序
                    </button>
                </div>
            </div>
        </div>

        <!-- 修改内容区域 -->
        <div class="overflow-y-auto px-6 flex-1 min-h-0" ref="scrollContainer" id="scrollContainer"
            @scroll="handleScroll">
            <!-- 列表容器 -->
            <div class="py-2">
                <!-- 加载状态和空数据提示 -->
                <div v-if="loading && !todoPage.records.length" class="text-center py-2">
                    <span class="loading loading-dots loading-md"></span>
                </div>
                <div v-else-if="!todoPage.records.length" class="text-center py-2 text-gray-500">
                    暂无待办事项
                </div>

                <!-- 待办列表项 -->
                <template v-else>
                    <div v-for="todo in todoPage.records" :key="todo.id"
                        class="mb-2 last:mb-0 flex items-center gap-3 p-3 bg-base-100 rounded-lg hover:bg-base-300 transition-colors">
                        <input type="checkbox" :checked="todo.status === 'completed'" class="checkbox checkbox-sm"
                            @change="toggleTodo(todo.id.toString(), todo.status)" />
                        <div class="flex-1">
                            <div class="flex items-center gap-2">
                                <span :class="{ 'line-through opacity-50': todo.status === 'completed' }">{{ todo.title
                                    }}</span>
                                <div v-if="todo.priority" :class="`badge ${getPriorityClass(todo.priority)} badge-sm`">
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
                                style="max-height: 2.4em; min-height: 0;" @click="openDescription(todo.description)">
                                {{ todo.description }}
                            </div>
                        </div>
                        <div class="flex items-center gap-1">
                            <button class="btn btn-ghost btn-xs btn-square" @click="handleEdit(todo)">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                            </button>
                            <button class="btn btn-ghost btn-xs btn-square text-error"
                                @click="handleDelete(todo.id.toString())">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </template>

                <!-- 底部加载提示 -->
                <div v-if="loading && todoPage.records.length" class="text-center py-2">
                    <span class="loading loading-dots loading-md"></span>
                </div>
            </div>
        </div>
    </div>

    <!-- 修改 Modal -->
    <dialog id="description_modal" class="modal" @click="closeModal">
        <div class="modal-box" @click.stop>
            <h3 class="font-bold text-lg">备注详情</h3>
            <p class="py-4">{{ currentDescription }}</p>
            <div class="modal-action">
                <button class="btn" @click="closeModal">关闭</button>
            </div>
        </div>
    </dialog>

    <!-- 编辑对话框 -->
    <TodoEditDialog v-model="showTodoModal" :is-edit="true" :initial-data="currentTodo" @submit="handleSubmit" />

    <!-- 添加删除确认对话框 -->
    <dialog id="delete_confirm_modal" class="modal">
        <div class="modal-box">
            <h3 class="font-bold text-lg">确认删除</h3>
            <p class="py-4">确定要删除这个待办吗？此操作不可撤销。</p>
            <div class="modal-action">
                <button class="btn" @click="closeDeleteModal">取消</button>
                <button class="btn btn-error" @click="confirmDelete">删除</button>
            </div>
        </div>
    </dialog>
</template>

<script setup lang="ts">
import { useTodoStore } from '@/stores/todo'
import type { CreateTodoForm, Todo } from '@/types/todo'
import { ref, onMounted } from 'vue'
import TodoEditDialog from '@/components/todo/TodoEditDialog.vue'
import { storeToRefs } from 'pinia'

const todoStore = useTodoStore()
const { todoPage } = storeToRefs(todoStore)
const currentDescription = ref('')
const showTodoModal = ref(false)
const loading = ref(false)
const currentPage = ref(1)
const hasMore = ref(true)


// 添加当前编辑的待办数据
const currentTodo = ref<Partial<Todo>>({})

// 处理编辑按钮点击
const handleEdit = (todo: Todo) => {
    currentTodo.value = { ...todo }
    showTodoModal.value = true
}

// 处理编辑提交
const handleSubmit = async (todoData: CreateTodoForm) => {
    try {
        await todoStore.updateTodo(currentTodo.value.id!.toString(), todoData);
        showTodoModal.value = false;
    } catch (error: any) {
        console.error('更新待办失败:', error);
    }
};

// 添加当前筛选条件的状态
const currentFilter = ref({
    status: undefined as string | undefined,
    priority: undefined as string | undefined
})

// 修改获取待办列表方法，使用当前筛选条件
const fetchTodoList = async (page = 1, append = false) => {
    if (loading.value || (!append && !hasMore.value)) return

    try {
        loading.value = true
        await todoStore.getTodoPage({
            page,
            size: 10,
            ...currentFilter.value
        })

        hasMore.value = todoPage.value.records.length === 10
        currentPage.value = page
    } catch (error) {
        console.error('获取待办列表失败:', error)
    } finally {
        loading.value = false
    }
}

// 获取优先级样式
const getPriorityClass = (priority: string) => {
    const classes = {
        high: 'badge-error',
        medium: 'badge-warning',
        low: 'badge-info'
    }
    return classes[priority as keyof typeof classes] || 'badge-ghost'
}

// 获取优先级文本
const getPriorityText = (priority: string) => {
    const texts = {
        high: '紧急',
        medium: '重要',
        low: '一般'
    }
    return texts[priority as keyof typeof texts] || priority
}

// 添加滚动到顶部方法
const scrollToTop = () => {
    const container = document.getElementById('scrollContainer')
    container?.scrollTo({ top: 0, behavior: 'smooth' })
}

// 修改标签点击事件，设置对应的筛选条件
const getTodoPage = async () => {
    currentFilter.value = { status: undefined, priority: undefined }
    currentPage.value = 1
    hasMore.value = true
    await fetchTodoList(1, false)
    scrollToTop()
}

const getTodoPageUrgent = async () => {
    currentFilter.value = { status: undefined, priority: 'high' }
    currentPage.value = 1
    hasMore.value = true
    await fetchTodoList(1, false)
    scrollToTop()
}

// 点击重要标签事件
const getTodoPageImportant = async () => {
    currentFilter.value = { status: undefined, priority: 'medium' }
    currentPage.value = 1
    hasMore.value = true
    await fetchTodoList(1, false)
    scrollToTop()
}

// 点击一般标签事件
const getTodoPageNormal = async () => {
    currentFilter.value = { status: undefined, priority: 'low' }
    currentPage.value = 1
    hasMore.value = true
    await fetchTodoList(1, false)
    scrollToTop()
}

// 点击已完成标签事件
const getTodoPageCompleted = async () => {
    currentFilter.value = { status: 'completed', priority: undefined }
    currentPage.value = 1
    hasMore.value = true
    await fetchTodoList(1, false)
    scrollToTop()
}

// 点击未完成标签事件
const getTodoPageUncomplete = async () => {
    currentFilter.value = { status: 'pending', priority: undefined }
    currentPage.value = 1
    hasMore.value = true
    await fetchTodoList(1, false)
    scrollToTop()
}

// 打开描述详情
const openDescription = (description: string) => {
    currentDescription.value = description
    const modal = document.getElementById('description_modal') as HTMLDialogElement
    modal?.showModal()
}

// 处理滚动事件
const handleScroll = async (e: Event) => {
    const target = e.target as HTMLElement
    const scrollBottom = target.scrollHeight - target.scrollTop - target.clientHeight

    // 当滚动到距离底部 50px 时加载更多
    if (scrollBottom < 50 && !loading.value && hasMore.value) {
        await fetchTodoList(currentPage.value + 1, true)
    }
}

// 添加关闭 modal 的方法
const closeModal = () => {
    const modal = document.getElementById('description_modal') as HTMLDialogElement
    modal?.close()
}

// 添加待删除的ID
const todoToDelete = ref('')

// 修改删除方法
const handleDelete = (id: string) => {
    todoToDelete.value = id
    const modal = document.getElementById('delete_confirm_modal') as HTMLDialogElement
    modal?.showModal()
}

// 关闭删除确认框
const closeDeleteModal = () => {
    const modal = document.getElementById('delete_confirm_modal') as HTMLDialogElement
    modal?.close()
}

// 确认删除
const confirmDelete = async () => {
    try {
        await todoStore.deleteTodo(todoToDelete.value);
        closeDeleteModal();
    } catch (error: any) {
        console.error('删除待办失败:', error);
    }
};

// 修改切换待办状态的方法
const toggleTodo = async (id: string, currentStatus: 'completed' | 'pending') => {
    try {
        const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
        await todoStore.updateTodo(id, { status: newStatus } as any);
    } catch (error) {
        console.error('更新待办状态失败:', error);
    }
};


onMounted(() => {
    fetchTodoList()
    todoStore.getTotalCount()
    todoStore.getUrgentCount()
    todoStore.getImportantCount()
    todoStore.getNormalCount()
    todoStore.getCompleteCount()
    todoStore.getUncompleteCount()
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

/* 添加描述文本的样式 */
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>