import { defineStore } from 'pinia';
import { ref } from 'vue';
import { todoApi } from '@/api/todo';
import type { TodoCountStats, TodoStatisticsParams } from '@/types/todo';

export const useTodoStore = defineStore('todo', () => {
  const todayCount = ref<TodoCountStats | null>(null);
  const yesterdayCount = ref<TodoCountStats | null>(null);
  const completeCount = ref<TodoCountStats | null>(null);
  const weekCompleteCount = ref<TodoCountStats | null>(null);

  // 通用的获取统计数据方法
  async function getTodoStats(params: TodoStatisticsParams) {
    const { data } = await todoApi.getTodoStatistics(params);
    return data.data;
  }

  // 获取今日待办数量
  async function getTodayCount() {
    todayCount.value = await getTodoStats({
      timeUnit: 'day',
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    });
  }

  // 获取昨日待办数量
  async function getYesterdayCount() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    yesterdayCount.value = await getTodoStats({
      timeUnit: 'day',
      date: yesterday.toISOString().split('T')[0],
      status: 'pending'
    });
  }

  // 获取已完成待办数量
  async function getCompleteCount() {
    completeCount.value = await getTodoStats({
      timeUnit: 'day',
      date: new Date().toISOString().split('T')[0],
      status: 'completed'
    });
  }

  // 获取本周已完成代办数量
  async function getWeekCompleteCount() {
    weekCompleteCount.value = await getTodoStats({
      timeUnit: 'week',
      status: 'completed'
    });
  }

  return {
    weekCompleteCount,
    todayCount,
    yesterdayCount,
    completeCount,
    getTodayCount,
    getYesterdayCount,
    getCompleteCount,
    getWeekCompleteCount
  };
});
