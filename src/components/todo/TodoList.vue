<template>
    <div class="card bg-base-200 shadow-xl h-full flex flex-col">
        <div class="card-body p-0 flex flex-col h-full">
            <!-- 工具栏 -->
            <div class="px-6 pt-6 pb-4 border-b border-base-300">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4">
                        <h2 class="card-title text-sm">任务列表</h2>
                        <div class="tabs tabs-boxed">
                            <a class="tab" :class="{ 'tab-active': modelValue === 'all' }"
                                @click="$emit('update:modelValue', 'all')">全部</a>
                            <a class="tab" :class="{ 'tab-active': modelValue === 'pending' }"
                                @click="$emit('update:modelValue', 'pending')">待处理</a>
                            <a class="tab" :class="{ 'tab-active': modelValue === 'completed' }"
                                @click="$emit('update:modelValue', 'completed')">已完成</a>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-sm" @click="$emit('add')">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        新建任务
                    </button>
                </div>
            </div>

            <!-- 任务列表 -->
            <div class="flex-1 overflow-y-auto px-6 py-4">
                <div class="space-y-4">
                    <div v-for="todo in todos" :key="todo.id"
                        class="card bg-base-100 hover:bg-base-300 transition-colors">
                        <div class="card-body p-4">
                            <div class="flex items-start gap-4">
                                <input type="checkbox" :checked="todo.completed" class="checkbox checkbox-primary"
                                    @change="$emit('toggle', todo.id)" />
                                <div class="flex-1">
                                    <div class="flex items-center gap-2">
                                        <h3 class="font-medium" :class="{ 'line-through opacity-50': todo.completed }">
                                            {{ todo.title }}
                                        </h3>
                                        <div class="flex gap-1">
                                            <div class="badge badge-sm" :class="getPriorityClass(todo.priority)">
                                                {{ getPriorityText(todo.priority) }}
                                            </div>
                                            <div v-for="tag in todo.tags" :key="tag"
                                                class="badge badge-sm badge-outline">
                                                {{ tag }}
                                            </div>
                                        </div>
                                    </div>
                                    <p class="text-sm opacity-70 mt-1">{{ todo.description }}</p>
                                    <div class="flex items-center gap-4 mt-2">
                                        <progress class="progress w-56" :class="getProgressClass(todo.progress)"
                                            :value="todo.progress" max="100"></progress>
                                        <span class="text-xs opacity-50">{{ todo.progress }}%</span>
                                    </div>
                                    <div class="flex items-center justify-between mt-2 text-xs opacity-50">
                                        <div class="flex items-center gap-4">
                                            <span>{{ todo.category }}</span>
                                            <span>截止: {{ todo.dueDate }}</span>
                                        </div>
                                        <div class="flex gap-2">
                                            <button class="btn btn-ghost btn-xs" @click="$emit('edit', todo.id)">
                                                编辑
                                            </button>
                                            <button class="btn btn-ghost btn-xs text-error"
                                                @click="$emit('delete', todo.id)">
                                                删除
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { todoList, todoCategories, todoStats } from '@/mock/data';

// 接收父组件传的 todos
defineProps<{
    todos: Array<{
        id: number
        title: string
        description?: string
        completed: boolean
        priority: string
        category?: string
        dueDate?: string
        progress?: number
        tags?: string[]
    }>
    modelValue: string
}>()

// 定义事件
defineEmits<{
    (e: 'edit-todo', todo: any): void
    (e: 'toggle', id: number): void
    (e: 'update:modelValue', value: string): void
    (e: 'edit', id: number): void
    (e: 'delete', id: number): void
    (e: 'add'): void
}>()

// 移除本地的 todos 数据，改用 props

const getPriorityClass = (priority: string) => {
    const classes = {
        high: 'badge-error',
        medium: 'badge-warning',
        low: 'badge-info'
    }
    return classes[priority] || ''
}

const getPriorityText = (priority: string) => {
    const texts = {
        high: '紧急',
        medium: '重要',
        low: '普通'
    }
    return texts[priority] || ''
}

const getProgressClass = (progress: number) => {
    if (progress >= 100) return 'progress-success'
    if (progress >= 70) return 'progress-info'
    if (progress >= 30) return 'progress-warning'
    return 'progress-error'
}
</script>