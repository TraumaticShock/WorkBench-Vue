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
      ...response.data.data[0],
      duration: Number(response.data.data[0].duration) || 0,
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
    timer.value = window.setInterval(() => {
      if (workDuration.value && !workDuration.value.endTime) {
        // 直接增加秒数，不需要转换为小时
        workDuration.value.duration = Number(workDuration.value.duration) + 1;
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
    // 输入的 duration 现在是秒数
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.floor(duration % 60);
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
