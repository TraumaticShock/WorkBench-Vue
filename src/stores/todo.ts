import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { todoApi } from '@/api/todo';
import type { TodoCountStats } from '@/types/todo';

export const useTodoStore = defineStore('todo', () => {

  const todayCount = ref<TodoCountStats | null>(null);
  const yesterdayCount = ref<TodoCountStats | null>(null);
  const completeCount = ref<TodoCountStats | null>(null);

  // 获取今日待办数量
  async function getTodayCount() {
    const { data } = await todoApi.getTodoCount(
      new Date().toISOString().split('T')[0]
    );
    todayCount.value = data.data;
  }

  // 获取昨日待办数量
  async function getYesterdayCount() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const { data } = await todoApi.getTodoCount(
      yesterday.toISOString().split('T')[0]
    );
    yesterdayCount.value = data.data;
  }

  // 获取已完成待办数量
  async function getCompleteCount() {
    const { data } = await todoApi.getTodoCount(
      undefined,
      'completed'
    );
    completeCount.value = data.data;
  }

  return {
    todayCount,
    yesterdayCount,
    completeCount,
    getTodayCount,
    getYesterdayCount,
    getCompleteCount,
  };
});
