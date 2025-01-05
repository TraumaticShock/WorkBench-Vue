<template>
    <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
            <!-- 工具栏 -->
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-4">
                    <h2 class="card-title text-sm">笔记列表</h2>
                    <div class="join">
                        <button class="btn btn-sm join-item" :class="{ 'btn-active': viewMode === 'grid' }"
                            @click="$emit('update:viewMode', 'grid')">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </button>
                        <button class="btn btn-sm join-item" :class="{ 'btn-active': viewMode === 'list' }"
                            @click="$emit('update:viewMode', 'list')">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="flex gap-2">
                    <button class="btn btn-primary btn-sm" @click="$emit('add')">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        新建笔记
                    </button>
                </div>
            </div>

            <!-- 笔记列表 -->
            <div :class="viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'">
                <div v-for="note in notes" :key="note.id"
                    class="card bg-base-100 hover:bg-base-300 transition-colors cursor-pointer">
                    <div class="card-body p-4">
                        <div class="flex items-start justify-between">
                            <h3 class="card-title text-base">{{ note.title }}</h3>
                            <div class="dropdown dropdown-end">
                                <button tabindex="0" class="btn btn-ghost btn-xs btn-square">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                    </svg>
                                </button>
                                <ul tabindex="0"
                                    class="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-32">
                                    <li><a @click="$emit('edit', note.id)">编辑</a></li>
                                    <li><a @click="$emit('delete', note.id)" class="text-error">删除</a></li>
                                </ul>
                            </div>
                        </div>
                        <p class="text-sm opacity-70 line-clamp-2">{{ note.content }}</p>
                        <div class="flex flex-wrap gap-1 mt-2">
                            <div v-for="tag in note.tags" :key="tag" class="badge badge-sm">{{ tag }}</div>
                        </div>
                        <div class="flex items-center justify-between mt-4 text-xs opacity-50">
                            <span>{{ note.category }}</span>
                            <span>{{ note.updatedAt }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Note {
    id: number
    title: string
    content: string
    category: string
    tags: string[]
    createdAt: string
    updatedAt: string
    pinned: boolean
}

defineProps<{
    notes: Note[]
    viewMode: 'grid' | 'list'
}>()

defineEmits<{
    (e: 'update:viewMode', value: 'grid' | 'list'): void
    (e: 'edit', id: number): void
    (e: 'delete', id: number): void
    (e: 'add'): void
}>()
</script>