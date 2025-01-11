import { defineStore } from 'pinia';
import { ref } from 'vue';
import { todoApi } from '@/api/todo';
import type { CreateTodoForm, TodoCountStats, TodoPageParams, TodoStatisticsParams } from '@/types/todo';

export const useTodoStore = defineStore('todo', () => {
  // 今日待办
  const todayCount = ref<TodoCountStats | null>(null);
  // 昨日待办
  const yesterdayCount = ref<TodoCountStats | null>(null);
  // 本周已完成待办
  const weekCompleteCount = ref<TodoCountStats | null>(null);
  // 全部待办
  const totalCount = ref<TodoCountStats | null>(null);
  // 未完成待办
  const uncompleteCount = ref<TodoCountStats | null>(null);
  // 已完成待办
  const completeCount = ref<TodoCountStats | null>(null);
  // 紧急待办
  const urgentCount = ref<TodoCountStats | null>(null);
  // 重要待办
  const importantCount = ref<TodoCountStats | null>(null);
  // 一般待办
  const normalCount = ref<TodoCountStats | null>(null);

  // 通用的获取统计数据方法
  async function getTodoStats(params: TodoStatisticsParams) {
    const { data } = await todoApi.getTodoStatistics(params);
    return data.data;
  }

  // 分页获取待办列表
  async function getTodoPage(params: TodoPageParams) {
    try {
        const { data } = await todoApi.getTodoPage(params);
        return data.data;  // 确保返回正确的数据结构
    } catch (error) {
        console.error('获取待办列表失败:', error);
        return { records: [] };  // 返回空数组作为默认值
    }
  }

  // 获取今日待办数量
  async function getTodayCount() {
    todayCount.value = await getTodoStats({
      unit: 'day',
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
    });
  }

  // 获取昨日待办数量
  async function getYesterdayCount() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    yesterdayCount.value = await getTodoStats({
      unit: 'day',
      date: yesterday.toISOString().split('T')[0],
      status: 'pending',
    });
  }

  // 获取全部的待办数量
  async function getTotalCount() {
    totalCount.value = await getTodoStats({
      unit: 'day',
      date: new Date().toISOString().split('T')[0],
    });
  }

  // 获取已完成待办数量
  async function getCompleteCount() {
    completeCount.value = await getTodoStats({
      unit: 'day',
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
    });
  }

  // 获取未完成待办数量
  async function getUncompleteCount() {
    uncompleteCount.value = await getTodoStats({
      unit: 'day',
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
    });
  }

  // 获取紧急待办数量
  async function getUrgentCount() {
    urgentCount.value = await getTodoStats({
      unit: 'day',
      date: new Date().toISOString().split('T')[0],
      priority: 'high',
    });
  }

  // 获取重要待办数量
  async function getImportantCount() {
    importantCount.value = await getTodoStats({
      unit: 'day',
      date: new Date().toISOString().split('T')[0],
      priority: 'medium',
    });
  }

  // 获取一般待办数量
  async function getNormalCount() {
    normalCount.value = await getTodoStats({
      unit: 'day',
      date: new Date().toISOString().split('T')[0],
      priority: 'low',
    });
  }

  // 获取本周已完成代办数量
  async function getWeekCompleteCount() {
    weekCompleteCount.value = await getTodoStats({
      unit: 'week',
      status: 'completed',
    });
  }

  // 获取待办分类统计
  async function getTodoCategoryStats() {
    const { data } = await todoApi.getTodoStatistics({
      unit: 'category',
      status: 'pending',
    });
    return data.data;
  }

  // 创建待办
  async function createTodo(todoData: CreateTodoForm) {
    const { data } = await todoApi.createTodo(todoData);
    return data.data;
  }

  // 更新待办
  async function updateTodo(id: string, todoData: CreateTodoForm) {
    const { data } = await todoApi.updateTodo(id, todoData);
    return data.data;
  }

  // 删除待办
  async function deleteTodo(id: string) {
    const { data } = await todoApi.deleteTodo(id);
    return data.data;
  }

  return {
    weekCompleteCount,
    todayCount,
    yesterdayCount,
    completeCount,
    totalCount,
    uncompleteCount,
    urgentCount,
    importantCount,
    normalCount,
    getTodayCount,
    getTodoPage,
    getYesterdayCount,
    getCompleteCount,
    getWeekCompleteCount,
    getTotalCount,
    getUrgentCount,
    getImportantCount,
    getNormalCount,
    getUncompleteCount,
    getTodoCategoryStats,
    createTodo,
    updateTodo,
    deleteTodo,
  };
});
