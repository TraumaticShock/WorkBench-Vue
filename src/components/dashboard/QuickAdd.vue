<template>
    <div class="card bg-base-100 shadow-xl h-[300px] relative overflow-hidden">
        <div class="absolute top-0 left-0 right-0 h-12 bg-gradient-to-r from-neutral to-neutral/70">
            <div class="flex items-center justify-between h-full px-6">
                <h2 class="text-xl font-semibold text-white">快速添加</h2>
            </div>
        </div>
        <div class="card-body h-full flex flex-col pt-16">
            <div class="flex flex-col gap-2">
                <button class="btn btn-primary flex items-center gap-2" @click="handleNewTodo">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    新建待办
                </button>
                <button class="btn btn-secondary flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    写笔记
                </button>
            </div>
        </div>
    </div>

    <!-- 新建待办对话框 -->
    <dialog id="todo_modal" class="modal">
        <div class="modal-box max-w-2xl p-0 bg-transparent h-[80vh]">
            <TodoDetail :todo="{}" @save="handleSubmit" @cancel="handleModal('todo_modal', 'close')" />
        </div>
        <form method="dialog" class="modal-backdrop">
            <button>关闭</button>
        </form>
    </dialog>
</template>

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

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import TodoDetail from '@/components/todo/TodoDetail.vue'
import { useTodoStore } from '@/stores/todo'
import type { CreateTodoFormParams } from '@/types/todo'

const todoStore = useTodoStore()

// 统一的 Modal 处理方法
const handleModal = (modalId: string, action: 'show' | 'close') => {
    const modal = document.getElementById(modalId) as HTMLDialogElement
    if (action === 'show') {
        modal?.showModal()
    } else {
        modal?.close()
    }
}

const handleSubmit = async (todoData: CreateTodoFormParams) => {
    try {
        await todoStore.createTodo(todoData)
        handleModal('todo_modal', 'close')
        // 创建成功后刷新统计数据和当前列表
        await Promise.all([
            todoStore.refreshStats(),
            todoStore.getTodoPage({
                page: todoStore.state.todoPage.current,
                size: 10,
                status: todoStore.state.currentFilter.status,
                priority: todoStore.state.currentFilter.priority
            })
        ])
        ElMessage.success('创建待办成功')
    } catch (error: any) {
        console.error('创建待办失败:', error)
        ElMessage.error(error.message || '创建待办失败')
    }
}

// 监听新建待办按钮点击
const handleNewTodo = () => {
    handleModal('todo_modal', 'show')
}
</script>