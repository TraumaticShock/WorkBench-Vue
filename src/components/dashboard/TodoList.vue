<template>
    <div class="card bg-base-200 shadow-xl h-[400px] flex flex-col">
        <!-- 固定的头部 -->
        <div class="p-6 pb-2">
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-4">
                    <h2 class="card-title text-sm">待办列表</h2>
                    <div class="flex items-center gap-2 text-xs">
                        <div class="flex items-center gap-1">
                            <div class="badge badge-sm cursor-pointer hover:opacity-80"
                                :class="{ 'badge-neutral': currentFilter === 'all' }" @click="setFilter('all')">全部 {{
                                    totalCount }}</div>
                        </div>
                        <div class="flex items-center gap-1">
                            <div class="badge badge-error badge-sm cursor-pointer hover:opacity-80"
                                :class="{ 'badge-outline': currentFilter !== 'urgent' }" @click="setFilter('urgent')">紧急
                                {{ urgentCount }}</div>
                        </div>
                        <div class="flex items-center gap-1">
                            <div class="badge badge-warning badge-sm cursor-pointer hover:opacity-80"
                                :class="{ 'badge-outline': currentFilter !== 'important' }"
                                @click="setFilter('important')">重要 {{ importantCount }}</div>
                        </div>
                        <div class="flex items-center gap-1">
                            <div class="badge badge-accent badge-sm cursor-pointer hover:opacity-80"
                                :class="{ 'badge-outline': currentFilter !== 'important' }"
                                @click="setFilter('important')">一般 {{ importantCount }}</div>
                        </div>
                        <div class="flex items-center gap-1">
                            <div class="badge badge-success badge-sm cursor-pointer hover:opacity-80"
                                :class="{ 'badge-outline': currentFilter !== 'completed' }"
                                @click="setFilter('completed')">已完成 {{ completedCount }}</div>
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
        </div>

        <!-- 可滚动的内容区 -->
        <div class="flex-1 overflow-y-auto p-6 pt-2">
            <div class="space-y-2">
                <div v-for="todo in filteredTodos" :key="todo.id"
                    class="flex items-center gap-3 p-3 bg-base-100 rounded-lg hover:bg-base-300 transition-colors">
                    <input type="checkbox" :checked="todo.completed" class="checkbox checkbox-sm"
                        @change="toggleTodo(todo.id)" />
                    <div class="flex-1">
                        <div class="flex items-center gap-2">
                            <span :class="{ 'line-through opacity-50': todo.completed }">{{ todo.title }}</span>
                            <div v-if="todo.priority" :class="`badge ${getPriorityClass(todo.priority)} badge-sm`">
                                {{ getPriorityText(todo.priority) }}
                            </div>
                            <div v-if="todo.category" class="badge badge-ghost badge-sm">
                                {{ todo.category }}
                            </div>
                            <div v-if="todo.dueDate" class="text-xs opacity-50">{{ todo.dueDate }}</div>
                        </div>
                        <div v-if="todo.description" class="text-xs opacity-50 mt-1">{{ todo.description }}</div>
                    </div>
                    <div class="flex items-center gap-1">
                        <button class="btn btn-ghost btn-xs btn-square" @click.stop="$emit('edit-todo', todo)">
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
</script>

<style scoped>
/* 隐藏 Webkit 浏览器的滚动条 (Chrome, Safari) */
.overflow-y-auto::-webkit-scrollbar {
    display: none;
}

/* 为 Firefox 隐藏滚动条 */
.overflow-y-auto {
    scrollbar-width: none;
}
</style>