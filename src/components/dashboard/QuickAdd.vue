<template>
    <div class="card bg-base-200 shadow-xl h-[300px]">
        <div class="card-body">
            <h2 class="card-title text-sm">快速添加</h2>
            <div class="flex flex-col gap-2">
                <div class="flex items-center gap-2">
                    <button class="btn btn-primary flex-1" @click="showTodoModal = true">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        新建待办
                    </button>
                    <button class="btn btn-secondary flex-1">
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

        <!-- 待办编辑对话框 -->
        <TodoEditDialog 
            v-model="showTodoModal"
            @submit="handleSubmit"
        />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import TodoEditDialog from '@/components/todo/TodoEditDialog.vue'
import { useTodoStore } from '@/stores/todo'
import type { CreateTodoForm } from '@/types/todo'

const todoStore = useTodoStore()
const showTodoModal = ref(false)

const handleSubmit = async (todoData: CreateTodoForm) => {
    try {
        await todoStore.createTodo(todoData)
        showTodoModal.value = false
        // 刷新待办列表
        await todoStore.getTodayCount()
    } catch (error: any) {
        console.error('创建待办失败:', error)
        ElMessage.error(error.message || '创建待办失败')
    }
}
</script>