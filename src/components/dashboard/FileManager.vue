<template>
    <div class="card bg-base-100 shadow-xl h-[400px] relative overflow-hidden">
        <div class="absolute top-0 left-0 right-0 h-12 bg-gradient-to-r from-neutral to-neutral/70">
            <div class="flex items-center h-full px-6">
                <h2 class="text-xl font-semibold text-white">文件管理</h2>
                <div class="flex items-center gap-2 text-white ml-4">
                    <div class="badge badge-sm">总计 126</div>
                    <div class="badge badge-info badge-sm">文档 45</div>
                    <div class="badge badge-success badge-sm">图片 38</div>
                    <div class="badge badge-warning badge-sm">其他 43</div>
                </div>
                <div class="flex gap-2 ml-auto">
                    <button class="btn btn-sm btn-ghost text-white hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        上传
                    </button>
                    <button class="btn btn-sm btn-ghost text-white hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                        新建文件夹
                    </button>
                </div>
            </div>
        </div>
        <div class="card-body h-full flex flex-col pt-16">
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 overflow-y-auto">
                <div v-for="file in recentFiles" :key="file.id"
                    class="flex items-center gap-2 p-3 bg-base-100 border-2 border-base-200/70 hover:border-base-300 shadow-sm hover:shadow-md transition-all rounded-xl cursor-pointer">
                    <div class="flex-none">
                        <svg v-if="file.type === 'doc'" xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <svg v-else-if="file.type === 'image'" xmlns="http://www.w3.org/2000/svg"
                            class="h-8 w-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-warning" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="truncate text-sm">{{ file.name }}</div>
                        <div class="text-xs opacity-50">{{ file.size }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const recentFiles = ref([
    {
        id: 1,
        name: '项目需求文档.docx',
        type: 'doc',
        size: '2.3MB'
    },
    {
        id: 2,
        name: '设计稿.png',
        type: 'image',
        size: '4.1MB'
    },
    {
        id: 3,
        name: '会议记录.pdf',
        type: 'doc',
        size: '1.2MB'
    },
    {
        id: 4,
        name: '原型图.sketch',
        type: 'other',
        size: '8.5MB'
    },
    {
        id: 5,
        name: '技术方案.md',
        type: 'doc',
        size: '256KB'
    },
    {
        id: 6,
        name: 'Logo设计.ai',
        type: 'image',
        size: '3.7MB'
    },
    {
        id: 7,
        name: '数据分析.xlsx',
        type: 'doc',
        size: '1.8MB'
    },
    {
        id: 8,
        name: '页面截图.jpg',
        type: 'image',
        size: '925KB'
    }
])
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