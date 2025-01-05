import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { todoApi } from '@/api/todo';
import type { TodayTodoStats } from '@/types/todo';

export const useTodoStore = defineStore('todo', () => {
  const todayStats = ref<TodayTodoStats | null>(null);

  // 获取今日待办事项
  async function getTodayTodo() {
    const { data } = await todoApi.getTodayTodo(
      new Date().toISOString().split('T')[0]
    );
    todayStats.value = data.data;
  }

  return {
    todayStats,
    getTodayTodo,
  };
});
