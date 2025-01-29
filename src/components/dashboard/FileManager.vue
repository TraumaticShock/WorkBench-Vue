<template>

    <div class="card bg-base-100 shadow-xl h-[400px] relative overflow-hidden">
        <!-- 隐藏的文件输入框 -->
        <input
            ref="fileInput"
            type="file"
            class="hidden"
            @change="handleFileChange"
        />
        
        <div class="absolute top-0 left-0 right-0 h-12 bg-gradient-to-r from-neutral to-neutral/70">
            <div class="flex items-center h-full px-6">
                <h2 class="text-xl font-semibold text-white">我的文件</h2>
                <div class="flex items-center gap-2 text-white ml-4">
                    <div class="badge badge-sm">总计 {{ fileStore.state.fileStatistics?.typeCount.totalCount }}</div>
                    <div class="badge badge-info badge-sm">文档 {{ fileStore.state.fileStatistics?.typeCount.文档? fileStore.state.fileStatistics?.typeCount.文档 : 0 }}</div>
                    <div class="badge badge-success badge-sm">图片 {{ fileStore.state.fileStatistics?.typeCount.图片? fileStore.state.fileStatistics?.typeCount.图片 : 0 }}</div>
                    <div class="badge badge-warning badge-sm">其他 {{ fileStore.state.fileStatistics?.typeCount.其他? fileStore.state.fileStatistics?.typeCount.其他 : 0 }}</div>
                </div>
                <div class="flex gap-2 ml-auto">
                    <button class="btn btn-sm btn-ghost text-white hover:text-white relative" @click="handleUploadClick">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                        上传
                        <!-- 上传进度条 -->
                        <div v-if="state.uploadProgress > 0 && state.uploadProgress < 100"
                            class="absolute bottom-0 left-0 h-0.5 bg-primary transition-all"
                            :style="{ width: state.uploadProgress + '%' }">
                        </div>
                        </button>
                    <button class="btn btn-sm btn-ghost text-white hover:text-white" @click="showCreateFolderDialog">
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
        <div class="pt-12 h-full flex flex-col">


                        <!-- 路径导航栏 -->
                        <div class="px-6 py-3 border-b border-base-200 flex items-center gap-2 bg-base-100/50 backdrop-blur-sm">
                <button class="btn btn-ghost btn-sm btn-circle" @click="handlePathClick('/')" 
                    :class="{'text-primary': state.currentPath === '/'}">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                </button>
                <button v-if="state.currentPath !== '/'" 
                    class="btn btn-ghost btn-sm btn-circle" 
                    @click="handleBackClick"
                    title="返回上一层">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div class="divider divider-horizontal mx-0"></div>
                <div class="breadcrumbs text-sm">
                    <ul>
                        <template v-for="(segment, index) in pathSegments" :key="index">
                            <li>
                                <a @click="handlePathClick(getPathUpToIndex(index))"
                                   class="hover:text-primary transition-colors cursor-pointer flex items-center gap-1"
                                   :class="{'text-primary font-medium': index === pathSegments.length - 1}">
                                    <svg v-if="index === pathSegments.length - 1" 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        class="h-4 w-4" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor">
                                        <path stroke-linecap="round" 
                                            stroke-linejoin="round" 
                                            stroke-width="2" 
                                            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                        </svg>
                                    {{ segment }}
                                </a>
                            </li>
                        </template>
                                    </ul>
                                </div>
                            </div>
            <!-- 文件列表 -->
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 overflow-y-auto p-4">
                <div v-for="node in fileStore.getCurrentDirContent()" :key="node.name"
                    class="flex items-center gap-2 p-3 bg-base-100 border-2 border-base-200/70 hover:border-base-300 shadow-sm hover:shadow-md transition-all rounded-xl cursor-pointer group"
                    @dblclick="handleNodeDoubleClick(node)">
                    <div class="flex-none">
                        <svg v-if="node.type === 'directory'" xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-warning"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                        </svg>
                        <svg v-else-if="node.type === 'file' && isImageFile(node)" xmlns="http://www.w3.org/2000/svg"
                            class="h-8 w-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <svg v-else-if="node.type === 'file' && isDocFile(node)" xmlns="http://www.w3.org/2000/svg" 
                            class="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-neutral"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="truncate text-sm">{{ node.name }}</div>
                        <div class="text-xs opacity-50">{{ formatFileSize(node.size) }}</div>
                    </div>
                    <div class="flex gap-1">
                        <!-- 下载按钮 - 仅对文件显示 -->
                        <button v-if="node.type === 'file'"
                            class="btn btn-ghost btn-xs btn-circle opacity-0 group-hover:opacity-100 transition-opacity"
                            @click.stop="handleDownload(`${state.currentPath === '/' ? '' : state.currentPath}/${node.name}`)"
                            title="下载">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                        </button>
                        <!-- 删除按钮 -->
                        <button class="btn btn-ghost btn-xs btn-circle opacity-0 group-hover:opacity-100 transition-opacity"
                            @click.stop="handleDelete(node)"
                            title="删除">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 新建文件夹对话框 -->
    <dialog ref="createFolderDialog" class="modal">
        <div class="modal-box">
            <h3 class="font-bold text-lg mb-4">新建文件夹</h3>
            <input type="text" v-model="newFolderName" placeholder="请输入文件夹名称" 
                class="input input-bordered w-full" 
                @keyup.enter="handleCreateFolder"/>
            <div class="modal-action">
                <button class="btn" @click="closeCreateFolderDialog">取消</button>
                <button class="btn btn-primary" @click="handleCreateFolder" 
                    :disabled="!newFolderName.trim()">创建</button>
            </div>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button>关闭</button>
        </form>
    </dialog>

    <!-- 确认对话框 -->
    <ConfirmDialog
        v-model="showConfirmDialog"
        title="确认删除"
        :message="confirmMessage"
        confirmText="删除"
        cancelText="取消"
        confirmButtonClass="btn-error"
        @confirm="handleConfirmDelete"
    />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFileStore } from '@/stores/file'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { formatFileSize } from '@/utils'
import type { FileNode, TreeNode } from '@/types/file'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

onMounted(async () => {
    await fileStore.getFileTree()
    await fileStore.getFileStatistics()
})

const fileStore = useFileStore()
const { state } = storeToRefs(fileStore)
const fileInput = ref<HTMLInputElement | null>(null)
const createFolderDialog = ref<HTMLDialogElement | null>(null)
const newFolderName = ref('')
const confirmDialogRef = ref()
const showConfirmDialog = ref(false)
const currentNode = ref<TreeNode | null>(null)

// 判断是否是图片文件
const isImageFile = (node: FileNode) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
    return imageExtensions.some(ext => node.name.toLowerCase().endsWith(ext))
}

// 判断是否是文档文件
const isDocFile = (node: FileNode) => {
    const docExtensions = ['.doc', '.docx', '.pdf', '.txt', '.md', '.xlsx', '.xls', '.ppt', '.pptx']
    return docExtensions.some(ext => node.name.toLowerCase().endsWith(ext))
}

// 处理上传按钮点击
const handleUploadClick = () => {
    fileInput.value?.click()
}

// 处理文件上传
const handleFileChange = async (event: Event) => {
    const input = event.target as HTMLInputElement
    const files = input.files
    if (!files?.length) return

    try {
        const file = files[0]
        
        // 在当前路径下检查文件名是否重复
        if (fileStore.checkDuplicateFileName(file.name, state.value.currentPath)) {
            alert(`文件"${file.name}"已存在，请重命名后再上传`)
            if (input) input.value = ''
            return
        }

        // 上传到当前路径
        await fileStore.uploadFile(file, state.value.currentPath)
        // 上传成功后刷新文件列表
        await fileStore.getFileTree()
        // 刷新文件统计信息
        await fileStore.getFileStatistics()
        // 清空input，以便可以重复上传相同文件
        if (input) input.value = ''
    } catch (error) {
        console.error('文件上传失败:', error)
        alert('文件上传失败，请重试')
    }
}

// 处理文件下载
const handleDownload = async (path: string) => {
    await fileStore.downloadFile(path)
}

// 显示新建文件夹对话框
const showCreateFolderDialog = () => {
    createFolderDialog.value?.showModal()
}

// 关闭新建文件夹对话框
const closeCreateFolderDialog = () => {
    createFolderDialog.value?.close()
    newFolderName.value = ''
}

// 处理创建文件夹
const handleCreateFolder = async () => {
    const name = newFolderName.value.trim()
    if (!name) return

    try {
        // 在当前路径下创建文件夹
        await fileStore.createDirectory(name, state.value.currentPath)
        // 刷新文件列表
        await fileStore.getFileTree()
        // 关闭对话框并清空输入
        closeCreateFolderDialog()
    } catch (error) {
        console.error('创建文件夹失败:', error)
        alert('创建文件夹失败，请重试')
    }
}

// 处理文件/文件夹双击
const handleNodeDoubleClick = async (node: TreeNode) => {
    if (node.type === 'directory') {
        // 更新当前路径
        state.value.currentPath = state.value.currentPath === '/' 
            ? `/${node.name}` 
            : `${state.value.currentPath}/${node.name}`
    }
}

// 计算路径段
const pathSegments = computed(() => {
    return state.value.currentPath.split('/').filter(Boolean)
})

// 获取到指定索引的路径
const getPathUpToIndex = (index: number): string => {
    const segments = pathSegments.value.slice(0, index + 1)
    return '/' + segments.join('/')
}

// 处理路径点击
const handlePathClick = (path: string) => {
    state.value.currentPath = path
}

// 处理返回上一层
const handleBackClick = () => {
    const segments = state.value.currentPath.split('/').filter(Boolean)
    segments.pop() // 移除最后一段
    state.value.currentPath = segments.length ? `/${segments.join('/')}` : '/'
}

// 删除确认对话框的消息
const confirmMessage = computed(() => {
    if (!currentNode.value) return ''
    return `确定要删除${currentNode.value.type === 'directory' ? '文件夹' : '文件'} "${currentNode.value.name}" 吗？`
})

// 处理删除
const handleDelete = async (node: TreeNode) => {
    currentNode.value = node
    showConfirmDialog.value = true
}

// 确认删除
const handleConfirmDelete = async () => {
    if (!currentNode.value) return
    
    try {
        const path = state.value.currentPath === '/' 
            ? `/${currentNode.value.name}` 
            : `${state.value.currentPath}/${currentNode.value.name}`
        
        await fileStore.delete(path)
        // 刷新文件列表
        await fileStore.getFileTree()
        // 刷新文件统计信息
        await fileStore.getFileStatistics()
    } catch (error) {
        console.error('删除失败:', error)
        alert('删除失败，请重试')
    }
}
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