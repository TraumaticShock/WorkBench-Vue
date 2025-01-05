import { defineStore } from 'pinia';
import { todoApi } from '@/api/todo';
import type { TodayTodoStats } from '@/types/todo';

export const useTodoStore = defineStore('todo', {
  state: () => ({
    todayStats: null as TodayTodoStats | null,
  }),

  actions: {
    // 获取今日待办事项
    async getTodayTodo() {
      const { data } = await todoApi.getTodayTodo(
        new Date().toISOString().split('T')[0]
      );
      this.todayStats = data.data;
    },
  },
});
