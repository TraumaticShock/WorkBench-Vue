<template>
    <div class="card bg-base-200 shadow-xl h-[400px]">
        <div class="card-body">
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-4">
                    <h2 class="card-title text-sm">待办列表</h2>
                    <div class="flex items-center gap-2 text-xs">
                        <div class="flex items-center gap-1">
                            <div class="badge badge-sm">全部 12</div>
                        </div>
                        <div class="flex items-center gap-1">
                            <div class="badge badge-error badge-sm">紧急 2</div>
                        </div>
                        <div class="flex items-center gap-1">
                            <div class="badge badge-warning badge-sm">重要 3</div>
                        </div>
                        <div class="flex items-center gap-1">
                            <div class="badge badge-success badge-sm">已完成 5</div>
                        </div>
                    </div>
                </div>
                <div class="flex gap-2">
                    <button class="btn btn-sm btn-ghost">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        筛选
                    </button>
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
            <div class="space-y-2">
                <div v-for="todo in todos" :key="todo.id"
                    class="flex items-center gap-3 p-3 bg-base-100 rounded-lg hover:bg-base-300 transition-colors">
                    <input type="checkbox" :checked="todo.completed" class="checkbox checkbox-sm"
                        @change="toggleTodo(todo.id)" />
                    <div class="flex-1">
                        <div class="flex items-center gap-2">
                            <span :class="{ 'line-through opacity-50': todo.completed }">{{ todo.title }}</span>
                            <div v-if="todo.priority" :class="`badge ${getPriorityClass(todo.priority)} badge-sm`">
                                {{ getPriorityText(todo.priority) }}
                            </div>
                            <div v-if="todo.dueDate" class="text-xs opacity-50">{{ todo.dueDate }}</div>
                        </div>
                        <div v-if="todo.description" class="text-xs opacity-50 mt-1">{{ todo.description }}</div>
                    </div>
                    <div class="flex items-center gap-1">
                        <button class="btn btn-ghost btn-xs btn-square">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </button>
                        <button class="btn btn-ghost btn-xs btn-square text-error">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const todos = ref([
    {
        id: 1,
        title: '完成项目文档',
        description: '编写项目技术文档和使用说明',
        completed: false,
        priority: 'high',
        dueDate: '今天 14:00'
    },
    {
        id: 2,
        title: '代码审查',
        description: '审查前端新功能代码',
        completed: false,
        priority: 'medium',
        dueDate: '明天'
    },
    {
        id: 3,
        title: '团队周会',
        completed: true,
        priority: 'low',
        dueDate: '已完成'
    },
    {
        id: 4,
        title: 'Bug修复',
        description: '修复用户反馈的登录问题',
        completed: false,
        priority: 'low',
        dueDate: '本周五'
    }
])

const getPriorityClass = (priority: string) => {
    const classes = {
        high: 'badge-error',
        medium: 'badge-warning',
        low: 'badge-info',
        '': ''
    }
    return classes[priority] || ''
}

const getPriorityText = (priority: string) => {
    const texts = {
        high: '紧急',
        medium: '重要',
        low: '普通',
        '': ''
    }
    return texts[priority] || ''
}

const toggleTodo = (id: number) => {
    const todo = todos.value.find(t => t.id === id)
    if (todo) {
        todo.completed = !todo.completed
    }
}
</script>

<style scoped></style>