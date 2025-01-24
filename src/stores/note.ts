import { defineStore } from 'pinia';
import { ref } from 'vue';
import { noteApi } from '@/api/note';
import { NotePageParams, NoteStatisticsParams } from '@/types/note';

export const useNoteStore = defineStore('note', () => {
    const state = ref({
        stats: {
            count: 0,
            monthCount: 0,
            categoryCount: {
            },
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
    };

    return {
        state,
        actions,
    };
});

