import { ref } from 'vue'
import { defineStore } from 'pinia'

interface Note {
  id: string
  title: string
  content: string
  category?: string
  wordCount?: number
  createdAt: string
  updatedAt: string
}

interface NotePage {
  records: Note[]
  total: number
  size: number
  current: number
  pages: number
}

interface NoteState {
  notePage: NotePage
}

export const useNoteStore = defineStore('note', () => {
  const state = ref<NoteState>({
    notePage: {
      records: [],
      total: 0,
      size: 12,
      current: 1,
      pages: 1
    }
  })

  // 获取笔记列表
  const getNotePage = async (params: {
    page: number
    size: number
    category?: string
  }) => {
    // TODO: 实现与后端 API 的集成
    // 目前返回模拟数据
    const mockNotes: Note[] = Array(params.size).fill(null).map((_, index) => ({
      id: `note-${index + 1}`,
      title: `测试笔记 ${index + 1}`,
      content: '这是一段测试内容，用于展示笔记列表的布局和样式。这是一段测试内容，用于展示笔记列表的布局和样式。',
      category: ['工作笔记', '学习笔记', '生活随笔'][Math.floor(Math.random() * 3)],
      wordCount: Math.floor(Math.random() * 1000) + 100,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }))

    state.value.notePage = {
      records: mockNotes,
      total: 100,
      size: params.size,
      current: params.page,
      pages: Math.ceil(100 / params.size)
    }

    return state.value.notePage
  }

  // 删除笔记
  const deleteNote = async (id: string) => {
    // TODO: 实现与后端 API 的集成
    state.value.notePage.records = state.value.notePage.records.filter(note => note.id !== id)
    return true
  }

  return {
    state,
    getNotePage,
    deleteNote
  }
}) 