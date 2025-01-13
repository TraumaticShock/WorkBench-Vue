import { defineStore } from 'pinia';
import { ref } from 'vue';
import { workDurationApi } from '@/api/workDuration';
import type { WorkDuration } from '@/types/workDuration';

export const useWorkDurationStore = defineStore('workDuration', () => {
  const workDuration = ref<WorkDuration | null>(null);
  const timer = ref<number | null>(null);
  const workDurationWeek = ref<WorkDuration[]>([]);

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
        duration: response.data.data[0].duration,
      };

      // 如果没有结束时间，自动开始计时
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
    const today = new Date();
    const currentDay = today.getDay();

    // 创建一个映射对象来存储每个日期对应的索引
    const dateIndexMap = new Map();

    // 修改计算逻辑，确保周一是每周的第一天
    const monday = new Date(today);
    monday.setDate(today.getDate() - currentDay + (currentDay === 0 ? -6 : 1));

    // 创建一个包含本周所有日期的数组，并建立日期到索引的映射
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      dateIndexMap.set(dateStr, i); // 存储日期和索引的对应关系
      return dateStr;
    });

    try {
      const response = await workDurationApi.getWorkDurationByDateRange(
        weekDays[0],
        weekDays[6]
      );

      // 初始化 workDurationWeek 为默认值数组
      workDurationWeek.value = weekDays.map((date) => ({
        id: '',
        userId: '',
        date,
        startTime: null,
        endTime: null,
        duration: 0,
        createdAt: '',
        updatedAt: '',
      }));

      // 如果有返回数据，则更新对应日期的数据
      if (response.data.data) {
        response.data.data.forEach((item) => {
          const formattedDate = item.date;

          // 使用 dateIndexMap 获取正确的索引
          const index = dateIndexMap.get(formattedDate);

          if (index !== undefined) {
            workDurationWeek.value[index] = {
              ...item,
              date: formattedDate,
              duration: Number((item.duration / 3600).toFixed(2)),
            };
          }
        });
      }
    } catch (error) {
      console.error('获取工作时长失败:', error);
      workDurationWeek.value = weekDays.map((date) => ({
        id: '',
        userId: '',
        date,
        startTime: null,
        endTime: null,
        duration: 0,
        createdAt: '',
        updatedAt: '',
      }));
    }
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
