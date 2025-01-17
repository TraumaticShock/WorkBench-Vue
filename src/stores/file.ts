import { ref } from 'vue'
import { defineStore } from 'pinia'

interface File {
  id: string
  name: string
  type: 'file' | 'folder'
  size?: number
  path: string
  createdAt: string
  updatedAt: string
}

interface FileState {
  files: File[]
  folders: File[]
}

export const useFileStore = defineStore('file', () => {
  const state = ref<FileState>({
    files: [],
    folders: []
  })

  // 获取文件列表
  const getFiles = async (path: string) => {
    // TODO: 实现与后端 API 的集成
    // 目前返回模拟数据
    const mockFiles: File[] = [
      {
        id: 'folder-1',
        name: '文档',
        type: 'folder',
        path: '/文档',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'folder-2',
        name: '图片',
        type: 'folder',
        path: '/图片',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'file-1',
        name: '项目说明.md',
        type: 'file',
        size: 1024,
        path: '/项目说明.md',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'file-2',
        name: '设计稿.fig',
        type: 'file',
        size: 2048576,
        path: '/设计稿.fig',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]

    state.value.files = mockFiles
    state.value.folders = mockFiles.filter(file => file.type === 'folder')

    return state.value.files
  }

  // 创建文件夹
  const createFolder = async (name: string) => {
    // TODO: 实现与后端 API 的集成
    const newFolder: File = {
      id: `folder-${Date.now()}`,
      name,
      type: 'folder',
      path: `/${name}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    state.value.files.push(newFolder)
    state.value.folders.push(newFolder)
    return newFolder
  }

  // 重命名文件
  const renameFile = async (id: string, newName: string) => {
    // TODO: 实现与后端 API 的集成
    const file = state.value.files.find(f => f.id === id)
    if (file) {
      file.name = newName
      file.path = file.path.replace(/[^/]+$/, newName)
      file.updatedAt = new Date().toISOString()
    }
    return file
  }

  // 移动文件
  const moveFile = async (fileId: string, targetFolderId: string) => {
    // TODO: 实现与后端 API 的集成
    const file = state.value.files.find(f => f.id === fileId)
    const targetFolder = state.value.files.find(f => f.id === targetFolderId)
    if (file && targetFolder && targetFolder.type === 'folder') {
      file.path = `${targetFolder.path}/${file.name}`
      file.updatedAt = new Date().toISOString()
    }
    return file
  }

  // 删除文件
  const deleteFile = async (id: string) => {
    // TODO: 实现与后端 API 的集成
    state.value.files = state.value.files.filter(f => f.id !== id)
    state.value.folders = state.value.folders.filter(f => f.id !== id)
    return true
  }

  return {
    state,
    getFiles,
    createFolder,
    renameFile,
    moveFile,
    deleteFile
  }
}) 