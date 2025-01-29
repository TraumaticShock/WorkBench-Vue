import { defineStore } from 'pinia';
import { ref } from 'vue';
import { noteApi } from '@/api/note';
import { NotePageParams, NoteState, NoteStatisticsParams, Note } from '@/types/note';

export const useNoteStore = defineStore('note', () => {
  const state = ref<NoteState>({
    stats: {
      count: 0,
      monthCount: 0,
      categoryCount: {},
    },
    notePage: {
      records: [],
      total: 0,
      size: 0,
      current: 1,
      pages: 0,
    },
  });

  const actions = {
    // 获取笔记日度统计数据
    async getNoteDayStatistics(params: NoteStatisticsParams) {
      const { data } = await noteApi.getNoteStatistics(params);
      state.value.stats.count = data.data.count;
    },

    // 获取笔记本月度统计数据
    async getNoteMonthStatistics(params: NoteStatisticsParams) {
      const { data } = await noteApi.getNoteStatistics(params);
      state.value.stats.monthCount = data.data.count;
    },

    // 获取笔记分类统计数据
    async getNoteCategoryStatistics(params: NoteStatisticsParams) {
      const { data } = await noteApi.getNoteStatistics(params);
      state.value.stats.categoryCount = data.data.categoryCount;
    },

    // 获取笔记列表
    async getNotePage(params: NotePageParams) {
      const { data } = await noteApi.getNotePage(params);
      state.value.notePage = data.data;
    },

    // 删除笔记
    async deleteNote(id: string) {
      const { data } = await noteApi.deleteNote(id);
      state.value.notePage.records = state.value.notePage.records.filter(note => note.id !== id);
    },

    // 创建笔记
    async createNote(data: Partial<Note>) {
      const res = await noteApi.createNote(data as Note);
      state.value.notePage.records.push(res.data.data);
      return res;
    },

    // 更新笔记
    async updateNote(id: string, data: Partial<Note>) {
      const res = await noteApi.updateNote(id, data);
      const index = state.value.notePage.records.findIndex(note => note.id === id);
      if (index !== -1) {
        state.value.notePage.records[index] = res.data.data;
      }
      return res;
    },
  };

  return {
    state,
    actions,
  };
});
