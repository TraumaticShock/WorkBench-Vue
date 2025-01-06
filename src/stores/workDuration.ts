import { defineStore } from 'pinia';
import { ref } from 'vue';
import { workDurationApi } from '@/api/workDuration';
import type { WorkDuration } from '@/types/workDuration';

export const useWorkDurationStore = defineStore('workDuration', () => {
  const workDuration = ref<WorkDuration | null>(null);
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

  // 更新工作时长
  const updateWorkDuration = async () => {
    if (!workDuration.value) return;

    try {
      // 获取今天的日期并格式化为 yyyy-MM-dd
      const today = new Date().toISOString().split('T')[0];

      await workDurationApi.updateWorkDuration(
        today, // 使用今天的日期
        workDuration.value.duration
      );
    } catch (error) {
      console.error('更新工作时长失败:', error);
    }
  };

  // 开始计时器
  const startTimer = () => {
    if (timer.value) return;
    // window.setInterval() 是一个 JavaScript 方法，用于在指定的时间间隔内重复执行一个指定的函数或代码片段。
    timer.value = window.setInterval(() => {
      // 如果 workDuration 存在且 endTime 为空，则将 duration 增加 1/3600 小时 = 1秒
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
    getWorkDurationToday,
    startTimer,
    stopTimer,
    formatDuration,
    updateWorkDuration,
  };
});
