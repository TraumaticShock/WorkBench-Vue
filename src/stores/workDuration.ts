import { defineStore } from 'pinia';
import { ref } from 'vue';
import { workDurationApi } from '@/api/workDuration';
import type { WorkDuration } from '@/types/workDuration';

export const useWorkDurationStore = defineStore('workDuration', () => {
  const workDuration = ref<WorkDuration | null>(null);
  const workDurationList = ref<WorkDuration[]>([]);
  const isLoading = ref(false);
  const timer = ref<number | null>(null);

  // 获取今天的工作时长
  const getWorkDurationToday = async () => {
    const response = await workDurationApi.getWorkDurationToday();
    // 确保 duration 是数字类型
    workDuration.value = {
      ...response.data.data,
      duration: Number(response.data.data.duration) || 0,
    };
    if (workDuration.value && !workDuration.value.endTime) {
      startTimer();
    }
  };

  // 开始计时器
  const startTimer = () => {
    if (timer.value) return;
    timer.value = window.setInterval(() => {
      if (workDuration.value && !workDuration.value.endTime) {
        workDuration.value.duration =
          Number(workDuration.value.duration) + 1 / 3600;
      }
    }, 1000);
  };

  // 停止计时器
  const stopTimer = () => {
    if (timer.value) {
      clearInterval(timer.value);
      timer.value = null;
    }
  };

  // 获取指定日期范围的工作时长
  const getWorkDurationByDateRange = async (
    startDate: string,
    endDate: string
  ) => {
    try {
      isLoading.value = true;
      const response = await workDurationApi.getWorkDurationByDateRange(
        startDate,
        endDate
      );
      workDurationList.value = response.data.data;
    } catch (error) {
      console.error('获取工作时长记录失败:', error);
    } finally {
      isLoading.value = false;
    }
  };

  // 格式化时间为时分秒
  const formatDuration = (duration: number) => {
    const hours = Math.floor(duration);
    const minutes = Math.floor((duration - hours) * 60);
    const seconds = Math.floor(((duration - hours) * 60 - minutes) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    workDuration,
    workDurationList,
    isLoading,
    getWorkDurationToday,
    getWorkDurationByDateRange,
    startTimer,
    stopTimer,
    formatDuration,
  };
});
