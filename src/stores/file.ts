import { defineStore } from 'pinia'
import { fileApi } from '@/api/file'
import type { FileState, FileStatisticsResponse, FileTreeResponse, FileUploadResponse, TreeNode } from '@/types/file'
import { ref } from 'vue'
import { link } from 'fs'

export const useFileStore = defineStore('file', () => {
  const state = ref<FileState>({
    uploadProgress: 0,
    fileTree: [],
    currentPath: '/',
    fileStatistics: null
  })

  const actions = {
    async uploadFile(file: File, path: string = '/'): Promise<FileUploadResponse> {
      try {
        state.value.uploadProgress = 0
        const formData = new FormData()
        formData.append('file', file)
        formData.append('directory', path)
        const { data: { data } } = await fileApi.upload(file, path)
        state.value.uploadProgress = 100
        return data
      } catch (error) {
        state.value.uploadProgress = 0
        throw error
      }
    },

    async getFileTree(): Promise<FileTreeResponse> {
      const { data: { data } } = await fileApi.getFileTree()
      state.value.fileTree = data.children
      return data
    },

    // 获取当前目录的内容
    getCurrentDirContent() {
      let currentDir = state.value.fileTree;
      
      // 如果是根目录，直接返回
      if (state.value.currentPath === '/') {
        return currentDir;
      }
      
      // 按路径逐级查找
      const paths = state.value.currentPath.split('/').filter(Boolean);
      for (const path of paths) {
        const dir = currentDir.find(node => 
          node.type === 'directory' && node.name === path
        );
        if (!dir || dir.type !== 'directory') return [];
        currentDir = dir.children;
      }
      
      return currentDir;
    },

    // 创建文件夹
    async createDirectory(name: string, path?: string): Promise<string> {
      const { data: { data } } = await fileApi.createDirectory(name, path)
      return data
    },

    // 删除文件或目录
    async delete(path: string): Promise<void> {
      const { data: { data } } = await fileApi.delete(path)
      return data
    },

    // 获取文件统计信息
    async getFileStatistics(): Promise<FileStatisticsResponse> {
      const { data: { data } } = await fileApi.getFileStatistics()
      state.value.fileStatistics = data
      return data
    },

    // 下载文件
    async downloadFile(path: string): Promise<void> {
      const response = await fileApi.download(path)
      const blob = new Blob([response.data])
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', path.split('/').pop() || 'download')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    },

    //检查当前目录是否有重复文件名
    checkDuplicateFileName(fileName: string, currentPath?: string): boolean {
      // 获取当前目录的文件列表
      let currentDir = state.value.fileTree;
      
      // 如果指定了路径,则找到对应的目录
      if (currentPath) {
        const paths = currentPath.split('/').filter(Boolean);
        for (const path of paths) {
          const dir = currentDir.find(node => 
            node.type === 'directory' && node.name === path
          );
          if (!dir || dir.type !== 'directory') return false;
          currentDir = dir.children;
        }
      }

      // 检查当前目录下是否存在同名文件
      return currentDir.some(node => node.name === fileName);
    }

  }

  return {
    state,
    ...actions
  }
})
