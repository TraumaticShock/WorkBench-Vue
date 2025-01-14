import { defineStore } from 'pinia';
import { ref } from 'vue';
import { todoApi } from '@/api/todo';
import { getTodayString } from '@/utils';
import type {
  CreateTodoForm,
  TodoCountStats,
  TodoPageParams,
  TodoStatisticsParams,
  TodoPage,
  Todo,
} from '@/types/todo';

export const useTodoStore = defineStore('todo', () => {
  // 统一管理所有计数状态
  const stats = ref({
    today: null as TodoCountStats | null,
    yesterday: null as TodoCountStats | null,
    weekComplete: null as TodoCountStats | null,
    total: null as TodoCountStats | null,
    uncomplete: null as TodoCountStats | null,
    complete: null as TodoCountStats | null,
    urgent: null as TodoCountStats | null,
    important: null as TodoCountStats | null,
    normal: null as TodoCountStats | null,
    category: null as TodoCountStats | null,
    records: [] as Todo[],
  });

  // 待办列表状态
  const todoPage = ref<TodoPage>({
    records: [],
    total: 0,
    size: 10,
    current: 1,
    pages: 0,
  });

  // 分类统计状态
  const todoCategoryStats = ref({
    categories: [] as string[],
    counts: [] as number[],
  });

  // 获取统计数据的通用方法
  const fetchStats = async (params: TodoStatisticsParams) => {
    const { data } = await todoApi.getTodoStatistics(params);
    return data.data;
  };

  // 统一的统计数据获取方法
  const statsActions = {
    today: () =>
      fetchStats({ unit: 'day', date: getTodayString(), status: 'pending' }),
    yesterday: () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return fetchStats({
        unit: 'day',
        date: yesterday.toISOString().split('T')[0],
        status: 'pending',
      });
    },
    total: () => fetchStats({ unit: 'day', date: getTodayString() }),
    complete: () =>
      fetchStats({ unit: 'day', date: getTodayString(), status: 'completed' }),
    uncomplete: () =>
      fetchStats({ unit: 'day', date: getTodayString(), status: 'pending' }),
    urgent: () =>
      fetchStats({ unit: 'day', date: getTodayString(), priority: 'high' }),
    important: () =>
      fetchStats({ unit: 'day', date: getTodayString(), priority: 'medium' }),
    normal: () =>
      fetchStats({ unit: 'day', date: getTodayString(), priority: 'low' }),
    weekComplete: () => fetchStats({ unit: 'week', status: 'completed' }),
    category: async () => {
      try {
        const { data } = await todoApi.getTodoStatistics({
          unit: 'category',
          status: 'pending',
        });

        if (!data.data.categoryCount) return null;

        // 转换为数组并排序
        const sortedEntries = Object.entries(data.data.categoryCount)
          .sort(([, a], [, b]) => b - a) // 按数量降序排序
          .slice(0, 5); // 只取前5个

        // 更新分类统计状态
        todoCategoryStats.value = {
          categories: sortedEntries.map(([category]) => category),
          counts: sortedEntries.map(([, count]) => count),
        };

        return data.data;
      } catch (error) {
        console.error('获取分类统计失败:', error);
        return null;
      }
    },
  };

  // 更新本地待办状态
  const updateLocalTodo = (id: string, todoData?: Partial<CreateTodoForm>) => {
    const index = todoPage.value.records.findIndex(
      (todo) => todo.id.toString() === id
    );
    if (index === -1) return;

    if (todoData) {
      todoPage.value.records[index] = {
        ...todoPage.value.records[index],
        ...todoData,
      };
    } else {
      todoPage.value.records.splice(index, 1);
    }
  };

  // CRUD 操作
  const actions = {
    // 获取待办列表
    async getTodoPage(params: TodoPageParams) {
      try {
        const { data } = await todoApi.getTodoPage(params);
        todoPage.value = data.data;
        return data.data;
      } catch (error) {
        console.error('获取待办列表失败:', error);
        return { records: [] };
      }
    },

    // 创建待办
    async createTodo(todoData: CreateTodoForm) {
      const { data } = await todoApi.createTodo(todoData);
      await refreshAllTodoData();
      return data.data;
    },

    // 更新待办
    async updateTodo(id: string, todoData: CreateTodoForm) {
      const { data } = await todoApi.updateTodo(id, todoData);
      updateLocalTodo(id, todoData);
      await refreshAllTodoData();
      return data.data;
    },

    // 删除待办
    async deleteTodo(id: string) {
      const { data } = await todoApi.deleteTodo(id);
      updateLocalTodo(id);
      await refreshAllTodoData();
      return data.data;
    },
  };

  // 刷新所有数据
  const refreshAllTodoData = async () => {
    const promises = Object.entries(statsActions).map(async ([key, fetch]) => {
      stats.value[key] = await fetch();
    });
    await Promise.all([
      ...promises,
      actions.getTodoPage({ page: 1, size: 10 }),
    ]);
  };

  return {
    stats,
    todoPage,
    todoCategoryStats,
    ...actions,
    refreshAllTodoData,
  };
});
