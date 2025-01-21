<template>
  <div class="min-h-screen bg-base-100">
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useWorkDurationStore } from '@/stores/workDuration';
import { useTodoStore } from '@/stores/todo';
import { useTodoCategoryStore } from '@/stores/todoCategory';

const workDurationStore = useWorkDurationStore();
const todoStore = useTodoStore();
const todoCategoryStore = useTodoCategoryStore();

onMounted(async () => {
  // 初始化获取今天的工作时长
  await workDurationStore.getWorkDurationToday();
  await todoStore.refreshStats();
  await todoCategoryStore.getCategories();
});

// 监听页面关闭或者刷新
window.addEventListener('beforeunload', async (event) => {
  // 在页面刷新或关闭前发送请求
  await workDurationStore.updateWorkDuration();
  event.preventDefault();
  event.returnValue = '';
});

// 定期保存工作时长（比如每5分钟）
const saveInterval = setInterval(() => {
  workDurationStore.updateWorkDuration();
}, 5 * 60 * 1000);

onUnmounted(() => {
  clearInterval(saveInterval);
});
</script>
