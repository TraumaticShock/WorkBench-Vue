<template>
    <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
            <!-- 工具栏 -->
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-4">
                    <h2 class="card-title text-sm">文件列表</h2>
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
                    <button class="btn btn-primary btn-sm" @click="$emit('upload')">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        上传文件
                    </button>
                    <button class="btn btn-secondary btn-sm" @click="$emit('create-folder')">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                        </svg>
                        新建文件夹
                    </button>
                </div>
            </div>

            <!-- 文件列表 -->
            <div :class="viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'">
                <div v-for="file in files" :key="file.id"
                    class="card bg-base-100 hover:bg-base-300 transition-colors cursor-pointer">
                    <div class="card-body p-4">
                        <div class="flex items-start justify-between">
                            <div class="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8"
                                    :class="getFileIconColor(file.type)" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        :d="getFileIconPath(file.type)" />
                                </svg>
                                <div>
                                    <div class="font-medium">{{ file.name }}</div>
                                    <div class="text-xs opacity-50">{{ file.size }}</div>
                                </div>
                            </div>
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
                                    <li><a>下载</a></li>
                                    <li><a>重命名</a></li>
                                    <li><a @click="$emit('delete', file.id)" class="text-error">删除</a></li>
                                </ul>
                            </div>
                        </div>
                        <div class="flex items-center justify-between mt-2 text-xs opacity-50">
                            <span>{{ file.path }}</span>
                            <span>{{ file.updatedAt }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface File {
    id: number
    name: string
    type: string
    size: string
    category: string
    updatedAt: string
    path: string
}

defineProps<{
    files: File[]
    viewMode: 'grid' | 'list'
}>()

defineEmits<{
    (e: 'update:viewMode', value: 'grid' | 'list'): void
    (e: 'upload'): void
    (e: 'delete', id: number): void
    (e: 'create-folder'): void
}>()

const getFileIconPath = (type: string) => {
    switch (type) {
        case 'folder':
            return 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z'
        case 'doc':
            return 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
        case 'image':
            return 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
        case 'video':
            return 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
        default:
            return 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z'
    }
}

const getFileIconColor = (type: string) => {
    switch (type) {
        case 'folder':
            return 'text-warning'
        case 'doc':
            return 'text-primary'
        case 'image':
            return 'text-success'
        case 'video':
            return 'text-secondary'
        default:
            return 'text-info'
    }
}
</script>