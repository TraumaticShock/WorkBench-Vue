import { defineStore } from 'pinia';
import { ref } from 'vue';
import { workDurationApi } from '@/api/workDuration';
import type { WorkDuration } from '@/types/workDuration';

export const useWorkDurationStore = defineStore('workDuration', () => {
  const workDuration = ref<WorkDuration | null>(null);
  const timer = ref<number | null>(null);
  const workDurationWeek = ref<WorkDuration[] | null>(null);

  // 开始计时器
  const startTimer = () => {
    if (timer.value) return;

    timer.value = window.setInterval(() => {
      if (workDuration.value && !workDuration.value.endTime) {
        workDuration.value.duration += 1;
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
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.floor(duration % 60);

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // 获取今天的工作时长
  const getWorkDurationToday = async () => {
    const response = await workDurationApi.getWorkDurationToday();

    if (response.data.data) {
      workDuration.value = {
        ...response.data.data,
        duration: response.data.data[0].duration, // 直接使用后端返回的时长
      };

      if (!workDuration.value.endTime) {
        startTimer();
      }
    }
  };

  // 更新工作时长
  const updateWorkDuration = async () => {
    if (!workDuration.value) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      await workDurationApi.updateWorkDuration(
        today,
        workDuration.value.duration
      );
    } catch (error) {
      console.error('更新工作时长失败:', error);
    }
  };

  // 获取本周的工作时长
  const getWorkDurationWeek = async () => {
    // 获取当前日期
    const today = new Date();

    // 计算本周的起始日期
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1)); // 周一
    const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 7)); // 周日

    // 格式化日期为 'YYYY-MM-DD'
    const startDate = startOfWeek.toISOString().split('T')[0];
    const endDate = endOfWeek.toISOString().split('T')[0];

    // 请求本周工作时长
    const response = await workDurationApi.getWorkDurationByDateRange(startDate, endDate);

    // 取出结果的每一个对象中的duration 并转换为小时为单位 保留2位小数
    const durations = response.data.data.map((item: { duration: any; }) => (item.duration / 3600).toFixed(2));
    workDurationWeek.value = durations;
  };

  return {
    workDuration,
    workDurationWeek,
    getWorkDurationToday,
    startTimer,
    stopTimer,
    formatDuration,
    getWorkDurationWeek,
    updateWorkDuration,
  };
});
