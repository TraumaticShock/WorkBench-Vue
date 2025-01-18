<template>
  <div class="min-h-screen bg-base-100">
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useWorkDurationStore } from '@/stores/workDuration';
import { useTodoStore } from '@/stores/todo';

const workDurationStore = useWorkDurationStore();
const todoStore = useTodoStore();

onMounted(async () => {
  // 初始化获取今天的工作时长
  await workDurationStore.getWorkDurationToday();
  await todoStore.refreshStats();
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
