<template>
  <div class="min-h-screen bg-base-100">
    <router-view></router-view>

    <!-- 全局确认对话框 -->
    <ConfirmDialog
        v-model="dialogStore.showConfirm"
        v-bind="dialogStore.confirmOptions"
        @confirm="dialogStore.confirmOptions.onConfirm?.()"
        @cancel="dialogStore.confirmOptions.onCancel?.()"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useWorkDurationStore } from '@/stores/workDuration';
import { useTodoStore } from '@/stores/todo';
import { useTodoCategoryStore } from '@/stores/todoCategory';
import { useNoteStore } from '@/stores/note';
import { useDialogStore } from '@/stores/dialog'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

const workDurationStore = useWorkDurationStore();
const todoStore = useTodoStore();
const todoCategoryStore = useTodoCategoryStore();
const noteStore = useNoteStore();
const dialogStore = useDialogStore()

onMounted(async () => {
  // 初始化获取今天的工作时长
  await workDurationStore.getWorkDurationToday();
  // 初始化获取待办事项统计数据
  await todoStore.refreshStats();
  // 初始化获取待办事项分类数据
  await todoCategoryStore.getCategories();
  // 初始化获取笔记统计数据
  await noteStore.actions.getNoteDayStatistics({ unit: 'day', date: new Date().toISOString() });
  await noteStore.actions.getNoteMonthStatistics({ unit: 'month' });
  await noteStore.actions.getNoteCategoryStatistics({ unit: 'category' });
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
