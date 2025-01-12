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
                                        @click="getTodoPage">全部 {{ todoStore.totalCount?.count || 0 }}</div>
                                </div>
                                <div class="flex items-center gap-1">
                                    <div class="badge badge-error badge-outline badge-sm cursor-pointer hover:opacity-80"
                                        @click="getTodoPageUrgent">紧急 {{ todoStore.urgentCount?.count || 0 }}</div>
                                </div>
                                <div class="flex items-center gap-1">
                                    <div class="badge badge-warning badge-outline badge-sm cursor-pointer hover:opacity-80"
                                        @click="getTodoPageImportant">重要 {{ todoStore.importantCount?.count || 0 }}
                                    </div>
                                </div>
                                <div class="flex items-center gap-1">
                                    <div class="badge badge-accent badge-outline badge-sm cursor-pointer hover:opacity-80"
                                        @click="getTodoPageNormal">一般 {{ todoStore.normalCount?.count || 0 }}</div>
                                </div>
                                <div class="flex items-center gap-1">
                                    <div class="badge badge-success badge-outline badge-sm cursor-pointer hover:opacity-80"
                                        @click="getTodoPageCompleted">已完成 {{ todoStore.completeCount?.count || 0 }}
                                    </div>
                                </div>
                                <div class="flex items-center gap-1">
                                    <div class="badge badge-secondary badge-outline badge-sm cursor-pointer hover:opacity-80"
                                        @click="getTodoPageUncomplete">未完成 {{ todoStore.uncompleteCount?.count || 0 }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-sm" @click="$emit('add')">
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
                        <div v-if="loading && !todoPage.records.length" class="text-center py-2">
                            <span class="loading loading-dots loading-md"></span>
                        </div>
                        <div v-else-if="!todoPage.records.length" class="text-center py-2 text-gray-500">
                            暂无待办事项
                        </div>
                        <!-- 待办列表项 -->
                        <template v-else>
                            <div v-for="todo in todoPage.records" :key="todo.id"
                                class="mb-2 last:mb-0 flex items-center gap-3 p-3 bg-base-100 rounded-lg hover:bg-base-300 transition-colors cursor-pointer"
                                @click="selectTodo(todo)">
                                <input type="checkbox" :checked="todo.status === 'completed'"
                                    class="checkbox checkbox-sm"
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
                                            {{ new Date(todo.dueDate).toLocaleDateString('zh-CN', { weekday: 'long' })
                                            }}
                                        </div>
                                    </div>
                                    <div v-if="todo.description"
                                        class="text-xs opacity-50 mt-1 line-clamp-2 cursor-pointer text-left"
                                        style="max-height: 2.4em; min-height: 0;">
                                        {{ todo.description }}
                                    </div>
                                </div>
                                <div class="flex items-center gap-1">
                                    <!-- <button class="btn btn-ghost btn-xs btn-square" @click="handleEdit(todo)">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    </button> -->
                                    <button class="btn btn-ghost btn-xs btn-square text-error"
                                        @click="handleDelete(todo.id.toString())">
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
                                <button class="btn btn-xs btn-ghost" :disabled="todoPage.current === 1"
                                    @click="changePage(todoPage.current - 1)">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <span class="text-xs opacity-50">第 {{ todoPage.current }} / {{ todoPage.pages }}
                                    页</span>
                                <button class="btn btn-xs btn-ghost" :disabled="todoPage.current === todoPage.pages"
                                    @click="changePage(todoPage.current + 1)">
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
                                        min="1" :max="todoPage.pages" @keyup.enter="handleJump">
                                    <button class="btn btn-xs btn-primary" @click="handleJump"
                                        :disabled="!isValidJumpPage">
                                        跳转
                                    </button>
                                </div>
                            </div>
                        </template>
                    </div>
                    <!-- 待办详情部分 -->
                    <div class="flex-1 rounded-lg p-4">
                        <div v-if="selectedTodo" class="space-y-4">
                            <!-- 标题 -->
                            <div class="flex items-center justify-between">
                                <input v-model="selectedTodo.title"
                                    class="text-lg font-bold bg-transparent border-b border-transparent hover:border-base-300 focus:border-primary outline-none w-full">
                                <button class="btn btn-primary btn-sm" @click="saveChanges">
                                    保存更改
                                </button>
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
                                <input v-model="selectedTodo.category" class="input input-sm input-bordered"
                                    placeholder="分类">

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
                            <div class="text-xs opacity-50">
                                创建时间：{{ new Date(selectedTodo.createdAt).toLocaleString() }}
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

    <!-- 编辑对话框 -->
    <!-- <TodoEditDialog v-model="showTodoModal" :is-edit="true" :initial-data="currentTodo" @submit="handleSubmit" /> -->

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
import { ref, onMounted, computed } from 'vue'
import type { TodoPage } from '@/types/todo'
import type { CreateTodoForm } from '@/types/todo'
import TodoEditDialog from '@/components/todo/TodoEditDialog.vue'
import type { Todo } from '@/types/todo'

const todoStore = useTodoStore()
const currentDescription = ref('')

const todoPage = ref<TodoPage>({
    records: [],
    total: 0,
    size: 10,
    current: 1,
    pages: 0
})

const showTodoModal = ref(false)

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
        await todoStore.updateTodo(currentTodo.value.id!.toString(), todoData)
        showTodoModal.value = false
        // 刷新列表和计数
        // await fetchTodoList()
        await todoStore.getTotalCount()
        await todoStore.getUrgentCount()
        await todoStore.getImportantCount()
        await todoStore.getNormalCount()
        await todoStore.getCompleteCount()
        await todoStore.getUncompleteCount()
    } catch (error: any) {
        console.error('更新待办失败:', error)
    }
}

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
        const result = await todoStore.getTodoPage({
            page,
            size: 10,
            ...currentFilter.value  // 使用当前筛选条件
        })

        if (append) {
            todoPage.value.records = [...todoPage.value.records, ...result.records]
        } else {
            todoPage.value = result
        }

        hasMore.value = result.records.length === 10
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

// 处理滚动事件
const handleScroll = async (e: Event) => {
    const target = e.target as HTMLElement
    const scrollBottom = target.scrollHeight - target.scrollTop - target.clientHeight

    // 当滚动到距离底部 50px 时加载更多
    if (scrollBottom < 50 && !loading.value && hasMore.value) {
        await fetchTodoList(currentPage.value + 1, true)
    }
}

const loading = ref(false)
const currentPage = ref(1)
const hasMore = ref(true)

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
        await todoStore.deleteTodo(todoToDelete.value)
        closeDeleteModal()
        // 刷新列表和计数
        await fetchTodoList()
        await todoStore.getTotalCount()
        await todoStore.getUrgentCount()
        await todoStore.getImportantCount()
        await todoStore.getNormalCount()
        await todoStore.getCompleteCount()
        await todoStore.getUncompleteCount()
        await todoStore.getTodayCount()
    } catch (error: any) {
        console.error('删除待办失败:', error)
    }
}

// 修改切换待办状态的方法
const toggleTodo = async (id: string, currentStatus: 'completed' | 'pending') => {
    try {
        const todoIndex = todoPage.value.records.findIndex(todo => todo.id.toString() === id);
        if (todoIndex === -1) return;

        const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
        todoPage.value.records[todoIndex].status = newStatus;

        await Promise.all([
            todoStore.updateTodo(id, { status: newStatus } as any),
            todoStore.getTotalCount(),
            todoStore.getUrgentCount(),
            todoStore.getImportantCount(),
            todoStore.getNormalCount(),
            todoStore.getCompleteCount(),
            todoStore.getUncompleteCount(),
            todoStore.getTodayCount()
        ]).catch(error => {
            todoPage.value.records[todoIndex].status = currentStatus;
            throw error;
        });
    } catch (error) {
        console.error('更新待办状态失败:', error);
    }
};

// 添加切换页面的方法
const changePage = async (page: number) => {
    if (page < 1 || page > todoPage.value.pages) return;
    currentPage.value = page;
    hasMore.value = true;
    await fetchTodoList(page, false);
    scrollToTop();
};

// 添加跳转页码的响应式变量
const jumpPage = ref(1);

// 判断跳转页码是否有效
const isValidJumpPage = computed(() => {
    const page = Number(jumpPage.value);
    return page >= 1 && page <= todoPage.value.pages;
});

// 处理跳转
const handleJump = () => {
    if (isValidJumpPage.value) {
        changePage(Number(jumpPage.value));
    }
};

// 添加选中的待办
const selectedTodo = ref<Todo | null>(null);

// 选择待办的方法
const selectTodo = (todo: Todo) => {
    selectedTodo.value = todo;
};

// 保存更改
const saveChanges = async () => {
    if (!selectedTodo.value) return;

    try {
        await todoStore.updateTodo(selectedTodo.value.id.toString(), {
            title: selectedTodo.value.title,
            description: selectedTodo.value.description,
            priority: selectedTodo.value.priority,
            category: selectedTodo.value.category,
            status: selectedTodo.value.status,
            dueDate: selectedTodo.value.dueDate,
        });

        // 更新列表中的对应项
        const index = todoPage.value.records.findIndex(
            todo => todo.id === selectedTodo.value?.id
        );
        if (index !== -1) {
            todoPage.value.records[index] = { ...selectedTodo.value };
        }

        // 刷新计数
        await Promise.all([
            todoStore.getTotalCount(),
            todoStore.getUrgentCount(),
            todoStore.getImportantCount(),
            todoStore.getNormalCount(),
            todoStore.getCompleteCount(),
            todoStore.getUncompleteCount(),
        ]);
    } catch (error) {
        console.error('更新待办失败:', error);
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