import { defineStore } from 'pinia';
import { ref } from 'vue';
import { todoApi } from '@/api/todo';
import type {
    CreateTodoFormParams,
    TodoPageParams,
    TodoStatisticsParams,
    TodoPage,
} from '@/types/todo';
import { getTodayString } from '@/utils';

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
        loading: false
    });

    const actions = {
        // 获取待办列表
        async getTodoPage(params: TodoPageParams) {
            state.value.loading = true;
            try {
                const { data } = await todoApi.getTodoPage(params);
                if (params.append) {
                    // 追加模式
                    state.value.todoPage.records = [...state.value.todoPage.records, ...data.data.records];
                    state.value.todoPage.current = data.data.current;
                    state.value.todoPage.pages = data.data.pages;
                    state.value.todoPage.total = data.data.total;
                } else {
                    // 替换模式
                    state.value.todoPage = data.data;
                }
                return data.data;
            } catch (error) {
                console.error('获取待办列表失败:', error);
                throw error;
            } finally {
                state.value.loading = false;
            }
        },

        // 初始化待办列表
        async initTodoPage() {
            state.value.todoPage = {
                records: [],
                total: 0,
                size: 10,
                current: 1,
                pages: 0,
            } as TodoPage;
        },

        // 创建待办
        async createTodo(todoData: CreateTodoFormParams) {
            const { data } = await todoApi.createTodo(todoData);
            await this.refreshStats();
            return data.data;
        },

        // 更新待办状态
        async toggleTodoStatus(id: string, currentStatus: 'completed' | 'pending') {
            try {
                const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
                const { data } = await todoApi.updateTodo(id, { status: newStatus } as any);
                
                // 更新本地状态
                const index = state.value.todoPage.records.findIndex(todo => todo.id.toString() === id);
                if (index !== -1) {
                    state.value.todoPage.records[index].status = newStatus;
                }
                
                // 更新统计数据
                await this.refreshStats();
                return data.data;
            } catch (error) {
                console.error('更新待办状态失败:', error);
                throw error;
            }
        },

        // 更新待办
        async updateTodo(id: string, todoData: CreateTodoFormParams) {
            try {
                const { data } = await todoApi.updateTodo(id, todoData);
                
                // 更新本地状态
                const index = state.value.todoPage.records.findIndex(todo => todo.id.toString() === id);
                if (index !== -1) {
                    state.value.todoPage.records[index] = { ...state.value.todoPage.records[index], ...todoData };
                }
                
                // 更新统计数据
                await this.refreshStats();
                return data.data;
            } catch (error) {
                console.error('更新待办失败:', error);
                throw error;
            }
        },

        // 删除待办
        async deleteTodo(id: string) {
            try {
                const { data } = await todoApi.deleteTodo(id);
                
                // 更新本地状态
                state.value.todoPage.records = state.value.todoPage.records.filter(todo => todo.id.toString() !== id);
                state.value.todoPage.total--;
                
                // 更新统计数据
                await this.refreshStats();
                return data.data;
            } catch (error) {
                console.error('删除待办失败:', error);
                throw error;
            }
        },

        // 刷新统计数据
        async refreshStats() {
            try {
                // 获取总数统计
                const { data: totalData } = await todoApi.getTodoStatistics({ unit: 'day', date: getTodayString() });
                // 获取未完成统计
                const { data: uncompleteData } = await todoApi.getTodoStatistics({ unit: 'day', status: 'pending', date: getTodayString() });
                // 获取已完成统计
                const { data: completeData } = await todoApi.getTodoStatistics({ unit: 'day', status: 'completed', date: getTodayString() });
                // 获取优先级统计
                const { data: highData } = await todoApi.getTodoStatistics({ unit: 'day', date: getTodayString(), priority: 'high' });
                const { data: mediumData } = await todoApi.getTodoStatistics({ unit: 'day', date: getTodayString(), priority: 'medium' });
                const { data: lowData } = await todoApi.getTodoStatistics({ unit: 'day', date: getTodayString(), priority: 'low' });
                // 获取本周已完成统计
                const { data: weekCompleteData } = await todoApi.getTodoStatistics({ unit: 'week', status: 'completed'});
                // 获取分类统计
                const { data: categoryData } = await todoApi.getTodoStatistics({ unit: 'category', status: 'pending' });

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

                state.value.stats = {
                    todayCount: uncompleteData.data?.count || 0,
                    yesterdayCount: 0,
                    weekCompleteCount: weekCompleteData.data?.count || 0,
                    totalCount: totalData.data?.count || 0,
                    uncompleteCount: uncompleteData.data?.count || 0,
                    completeCount: completeData.data?.count || 0,
                    urgentCount: highData.data?.count || 0,
                    importantCount: mediumData.data?.count || 0,
                    normalCount: lowData.data?.count || 0,
                    categoryCount: processCategoryData(categoryData.data?.categoryCount || {})
                };
            } catch (error) {
                console.error('获取统计数据失败:', error);
            }
        }
    };

    return {
        state,
        ...actions
    };
});
