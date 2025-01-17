<template>
    <div class="card bg-base-200 shadow-xl h-full flex flex-col">
        <div class="card-body p-0 flex flex-col h-full">
            <!-- 顶部工具栏 -->
            <div class="px-6 pt-6 pb-4 border-b border-base-300">
                <div class="flex flex-col gap-4">
                    <!-- 标题和上传按钮 -->
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <h2 class="card-title">我的文件</h2>
                            <div class="breadcrumbs text-sm">
                                <ul>
                                    <li><a @click="navigateTo('/')">根目录</a></li>
                                    <li v-for="(path, index) in currentPath" :key="index">
                                        <a @click="navigateTo(path.path)">{{ path.name }}</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <button class="btn btn-primary gap-2" @click="handleUpload">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                上传文件
                            </button>
                            <button class="btn btn-ghost gap-2" @click="handleCreateFolder">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                </svg>
                                新建文件夹
                            </button>
                        </div>
                    </div>

                    <!-- 搜索和视图切换 -->
                    <div class="flex items-center gap-4">
                        <div class="flex-1 relative">
                            <input type="text" placeholder="搜索文件..." v-model="searchQuery"
                                class="input input-bordered w-full pl-10" @input="handleSearch" />
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 opacity-50"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <div class="join">
                            <button class="join-item btn" :class="{'btn-active': viewMode === 'grid'}"
                                @click="viewMode = 'grid'">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            </button>
                            <button class="join-item btn" :class="{'btn-active': viewMode === 'list'}"
                                @click="viewMode = 'list'">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 文件列表区域 -->
            <div class="overflow-y-auto px-6 py-4 flex-1 min-h-0" ref="scrollContainer">
                <!-- 加载状态 -->
                <div v-if="loading" class="flex items-center justify-center py-12">
                    <div class="loading loading-dots loading-lg"></div>
                </div>

                <!-- 空状态 -->
                <div v-else-if="!fileStore.state.files.length" class="flex flex-col items-center justify-center py-12 gap-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 opacity-20" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                    </svg>
                    <p class="text-base-content/50">当前文件夹为空</p>
                    <div class="flex gap-2">
                        <button class="btn btn-primary btn-sm gap-2" @click="handleUpload">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            上传文件
                        </button>
                        <button class="btn btn-ghost btn-sm gap-2" @click="handleCreateFolder">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                            </svg>
                            新建文件夹
                        </button>
                    </div>
                </div>

                <!-- 网格视图 -->
                <div v-else-if="viewMode === 'grid'" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    <div v-for="file in fileStore.state.files" :key="file.id"
                        class="card bg-base-100 hover:shadow-lg transition-all duration-300 group cursor-pointer"
                        @click="handleFileClick(file)">
                        <div class="card-body p-4">
                            <!-- 文件图标 -->
                            <div class="flex justify-center mb-3">
                                <div v-if="file.type === 'folder'" class="w-16 h-16 flex items-center justify-center text-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                    </svg>
                                </div>
                                <div v-else class="w-16 h-16 flex items-center justify-center text-secondary">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>

                            <!-- 文件信息 -->
                            <div class="text-center">
                                <h3 class="font-medium truncate group-hover:text-primary transition-colors">
                                    {{ file.name }}
                                </h3>
                                <p class="text-xs opacity-50 mt-1">{{ formatFileSize(file.size) }}</p>
                            </div>

                            <!-- 操作按钮 -->
                            <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div class="dropdown dropdown-end">
                                    <label tabindex="0" class="btn btn-ghost btn-xs btn-square">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                        </svg>
                                    </label>
                                    <ul tabindex="0"
                                        class="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-40">
                                        <li><a @click.stop="handleDownload(file)">下载</a></li>
                                        <li><a @click.stop="handleRename(file)">重命名</a></li>
                                        <li><a @click.stop="handleMove(file)">移动到</a></li>
                                        <li><a @click.stop="handleDelete(file)" class="text-error">删除</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 列表视图 -->
                <div v-else class="overflow-x-auto">
                    <table class="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>名称</th>
                                <th>大小</th>
                                <th>修改时间</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="file in fileStore.state.files" :key="file.id"
                                class="hover cursor-pointer" @click="handleFileClick(file)">
                                <td class="flex items-center gap-3">
                                    <div v-if="file.type === 'folder'" class="text-primary">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                        </svg>
                                    </div>
                                    <div v-else class="text-secondary">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    {{ file.name }}
                                </td>
                                <td>{{ formatFileSize(file.size) }}</td>
                                <td>{{ formatDate(file.updatedAt) }}</td>
                                <td class="w-40">
                                    <div class="flex items-center gap-1">
                                        <button class="btn btn-ghost btn-xs btn-square" @click.stop="handleDownload(file)">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                        </button>
                                        <button class="btn btn-ghost btn-xs btn-square" @click.stop="handleRename(file)">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </button>
                                        <button class="btn btn-ghost btn-xs btn-square" @click.stop="handleMove(file)">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                                            </svg>
                                        </button>
                                        <button class="btn btn-ghost btn-xs btn-square text-error"
                                            @click.stop="handleDelete(file)">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- 新建文件夹对话框 -->
    <dialog id="create_folder_modal" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
            <h3 class="font-bold text-lg">新建文件夹</h3>
            <div class="py-4">
                <input type="text" placeholder="请输入文件夹名称" v-model="newFolderName"
                    class="input input-bordered w-full" />
            </div>
            <div class="modal-action">
                <button class="btn btn-ghost" @click="handleModal('create_folder_modal', 'close')">取消</button>
                <button class="btn btn-primary" @click="confirmCreateFolder"
                    :disabled="!newFolderName.trim()">创建</button>
            </div>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button>关闭</button>
        </form>
    </dialog>

    <!-- 重命名对话框 -->
    <dialog id="rename_modal" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
            <h3 class="font-bold text-lg">重命名</h3>
            <div class="py-4">
                <input type="text" placeholder="请输入新名称" v-model="newFileName"
                    class="input input-bordered w-full" />
            </div>
            <div class="modal-action">
                <button class="btn btn-ghost" @click="handleModal('rename_modal', 'close')">取消</button>
                <button class="btn btn-primary" @click="confirmRename"
                    :disabled="!newFileName.trim()">确定</button>
            </div>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button>关闭</button>
        </form>
    </dialog>

    <!-- 移动文件对话框 -->
    <dialog id="move_modal" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
            <h3 class="font-bold text-lg">移动到</h3>
            <div class="py-4">
                <ul class="menu bg-base-200 w-full rounded-box">
                    <li v-for="folder in fileStore.state.folders" :key="folder.id">
                        <a @click="selectMoveTarget(folder)"
                            :class="{'active': selectedMoveTarget?.id === folder.id}">
                            {{ folder.name }}
                        </a>
                    </li>
                </ul>
            </div>
            <div class="modal-action">
                <button class="btn btn-ghost" @click="handleModal('move_modal', 'close')">取消</button>
                <button class="btn btn-primary" @click="confirmMove"
                    :disabled="!selectedMoveTarget">确定</button>
            </div>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button>关闭</button>
        </form>
    </dialog>

    <!-- 删除确认对话框 -->
    <dialog id="delete_confirm_modal" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
            <h3 class="font-bold text-lg">删除文件</h3>
            <p class="py-4">确定要删除这个文件吗？此操作不可撤销。</p>
            <div class="modal-action">
                <button class="btn btn-ghost" @click="handleModal('delete_confirm_modal', 'close')">取消</button>
                <button class="btn btn-error" @click="confirmDelete">删除</button>
            </div>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button>关闭</button>
        </form>
    </dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useFileStore } from '@/stores/file'

const fileStore = useFileStore()
const loading = ref(false)
const viewMode = ref<'grid' | 'list'>('grid')
const searchQuery = ref('')
const newFolderName = ref('')
const newFileName = ref('')
const selectedFile = ref<any>(null)
const selectedMoveTarget = ref<any>(null)
const currentPath = ref<Array<{ name: string; path: string }>>([])

// 统一的 Modal 处理方法
const handleModal = (modalId: string, action: 'show' | 'close') => {
    const modal = document.getElementById(modalId) as HTMLDialogElement
    if (action === 'show') {
        modal?.showModal()
    } else {
        modal?.close()
    }
}

// 处理文件点击
const handleFileClick = (file: any) => {
    if (file.type === 'folder') {
        currentPath.value.push({
            name: file.name,
            path: file.path
        })
        fetchFileList(file.path)
    } else {
        // 处理文件预览或下载
        handleDownload(file)
    }
}

// 导航到指定路径
const navigateTo = (path: string) => {
    const index = currentPath.value.findIndex(item => item.path === path)
    if (index === -1) {
        currentPath.value = []
    } else {
        currentPath.value = currentPath.value.slice(0, index + 1)
    }
    fetchFileList(path)
}

// 获取文件列表
const fetchFileList = async (path = '/') => {
    if (loading.value) return

    try {
        loading.value = true
        await fileStore.getFiles(path)
    } catch (error) {
        console.error('获取文件列表失败:', error)
    } finally {
        loading.value = false
    }
}

// 处理搜索
const handleSearch = () => {
    // TODO: 实现搜索功能
    console.log('搜索:', searchQuery.value)
}

// 处理上传
const handleUpload = () => {
    // TODO: 实现文件上传
    console.log('上传文件')
}

// 处理新建文件夹
const handleCreateFolder = () => {
    newFolderName.value = ''
    handleModal('create_folder_modal', 'show')
}

// 确认新建文件夹
const confirmCreateFolder = async () => {
    try {
        await fileStore.createFolder(newFolderName.value)
        handleModal('create_folder_modal', 'close')
        fetchFileList()
    } catch (error) {
        console.error('新建文件夹失败:', error)
    }
}

// 处理下载
const handleDownload = (file: any) => {
    // TODO: 实现文件下载
    console.log('下载文件:', file)
}

// 处理重命名
const handleRename = (file: any) => {
    selectedFile.value = file
    newFileName.value = file.name
    handleModal('rename_modal', 'show')
}

// 确认重命名
const confirmRename = async () => {
    try {
        await fileStore.renameFile(selectedFile.value.id, newFileName.value)
        handleModal('rename_modal', 'close')
        fetchFileList()
    } catch (error) {
        console.error('重命名失败:', error)
    }
}

// 处理移动
const handleMove = (file: any) => {
    selectedFile.value = file
    selectedMoveTarget.value = null
    handleModal('move_modal', 'show')
}

// 选择移动目标
const selectMoveTarget = (folder: any) => {
    selectedMoveTarget.value = folder
}

// 确认移动
const confirmMove = async () => {
    try {
        await fileStore.moveFile(selectedFile.value.id, selectedMoveTarget.value.id)
        handleModal('move_modal', 'close')
        fetchFileList()
    } catch (error) {
        console.error('移动文件失败:', error)
    }
}

// 处理删除
const handleDelete = (file: any) => {
    selectedFile.value = file
    handleModal('delete_confirm_modal', 'show')
}

// 确认删除
const confirmDelete = async () => {
    try {
        await fileStore.deleteFile(selectedFile.value.id)
        handleModal('delete_confirm_modal', 'close')
        fetchFileList()
    } catch (error) {
        console.error('删除文件失败:', error)
    }
}

// 格式化文件大小
const formatFileSize = (size: number) => {
    if (!size) return '-'
    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    let index = 0
    while (size >= 1024 && index < units.length - 1) {
        size /= 1024
        index++
    }
    return `${size.toFixed(2)} ${units[index]}`
}

// 格式化日期
const formatDate = (date: string) => {
    return new Date(date).toLocaleString()
}

// 初始化
onMounted(() => {
    fetchFileList()
})
</script>

<style scoped>
/* 滚动条样式 */
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

/* 文件名截断 */
.truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style> 