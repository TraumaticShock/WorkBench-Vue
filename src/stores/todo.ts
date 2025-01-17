import { defineStore } from 'pinia';
import { ref } from 'vue';
import { todoApi } from '@/api/todo';
import { getTodayString } from '@/utils';
import type {
  CreateTodoFormParams,
  TodoPageParams,
  TodoStatisticsParams,
  TodoPage,
} from '@/types/todo';

export const useTodoStore = defineStore('todo', () => {
  // 统一状态管理
  const state = ref({
    // 待办列表
    todoPage: {
      records: [],
      total: 0,
      size: 10,
      current: 1,
      pages: 0,
    } as TodoPage,
    
    // 统计数据
    stats: {
      todayCount: 0,
      yesterdayCount: 0,
      weekCompleteCount: [],
      totalCount: 0,
      uncompleteCount: 0,
      completeCount: 0,
      urgentCount: 0,
      importantCount: 0,
      normalCount: 0,
      categoryCount: {
        categories: [],
        counts: []
      }
    },

    // 加载状态
    loading: false,
    // 是否有更多数据
    hasMore: true,
  });

  // 获取统计数据的通用方法
  const fetchStats = async (params: TodoStatisticsParams) => {
    const { data } = await todoApi.getTodoStatistics(params);
    return data.data;
  };

  // CRUD 操作
  const actions = {
    // 获取待办列表
    async getTodoPage(params: TodoPageParams & { append?: boolean }) {
      try {
        const { data } = await todoApi.getTodoPage(params)
        
        // 根据 append 参数决定是追加还是替换数据
        state.value.todoPage = {
          ...data.data,
          records: params.append 
            ? [...state.value.todoPage.records, ...data.data.records]
            : data.data.records
        }
        
        // 更新加载状态
        state.value.loading = false
        // 更新是否有更多数据
        state.value.hasMore = data.data.records.length === params.size
        
        return data.data
      } catch (error) {
        console.error('获取待办列表失败:', error)
        state.value.loading = false
        return { records: [] }
      }
    },

    // 创建待办
    async createTodo(todoData: CreateTodoFormParams) {
      const { data } = await todoApi.createTodo(todoData);
      await refreshAllTodoData();
      return data.data;
    },

    // 更新待办
    async updateTodo(id: string, todoData: CreateTodoFormParams) {
      const { data } = await todoApi.updateTodo(id, todoData);
      await refreshAllTodoData();
      return data.data;
    },

    // 删除待办
    async deleteTodo(id: string) {
      const { data } = await todoApi.deleteTodo(id);
      await refreshAllTodoData();
      return data.data;
    },

    // 刷新所有统计数据
    async refreshStats() {
      const [
        today,
        yesterday,
        total,
        complete,
        uncomplete,
        urgent,
        important,
        normal,
        weekComplete,
        category
      ] = await Promise.all([
        fetchStats({ unit: 'day', date: getTodayString(), status: 'pending' }),
        fetchStats({ unit: 'day', date: new Date(Date.now() - 86400000).toISOString().split('T')[0], status: 'pending' }),
        fetchStats({ unit: 'day', date: getTodayString() }),
        fetchStats({ unit: 'day', date: getTodayString(), status: 'completed' }),
        fetchStats({ unit: 'day', date: getTodayString(), status: 'pending' }),
        fetchStats({ unit: 'day', date: getTodayString(), priority: 'high' }),
        fetchStats({ unit: 'day', date: getTodayString(), priority: 'medium' }),
        fetchStats({ unit: 'day', date: getTodayString(), priority: 'low' }),
        fetchStats({ unit: 'week', status: 'completed' }),
        fetchStats({ unit: 'category', status: 'pending' })
      ]);

      // 更新统计数据
      state.value.stats = {
        todayCount: today?.count || 0,
        yesterdayCount: yesterday?.count || 0,
        weekCompleteCount: weekComplete?.count || [],
        totalCount: total?.count || 0,
        uncompleteCount: uncomplete?.count || 0,
        completeCount: complete?.count || 0,
        urgentCount: urgent?.count || 0,
        importantCount: important?.count || 0,
        normalCount: normal?.count || 0,
        categoryCount: processCategoryData(category?.categoryCount || {})
      };
    }
  };

  // 处理分类数据
  const processCategoryData = (categoryData: Record<string, number>) => {
    const sortedEntries = Object.entries(categoryData)
      .sort(([, a], [, b]) => Number(b) - Number(a))
      .slice(0, 5);

    return {
      categories: sortedEntries.map(([category]) => category),
      counts: sortedEntries.map(([, count]) => count)
    };
  };

  // 刷新所有数据
  const refreshAllTodoData = async () => {
    await Promise.all([
      actions.getTodoPage({ page: 1, size: 10 }),
      actions.refreshStats()
    ]);
  };

  return {
    state,
    ...actions,
    refreshAllTodoData
  };
});
