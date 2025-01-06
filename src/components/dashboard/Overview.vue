<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useTodoStore } from '@/stores/todo'
import { storeToRefs } from 'pinia'
import { useWorkDurationStore } from '@/stores/workDuration'
import { workDurationApi } from '@/api/workDuration'

const todoStore = useTodoStore();
const workDurationStore = useWorkDurationStore();

const { todayStats } = storeToRefs(todoStore);
const { workDuration } = storeToRefs(workDurationStore);


onMounted(async () => {
    await todoStore.getTodayTodo();
    await workDurationStore.getWorkDurationToday();
});

onUnmounted(() => {
    workDurationStore.stopTimer();
});

// 监听页面关闭或者刷新
window.addEventListener('beforeunload', async (event) => {
    await workDurationStore.updateWorkDuration(); // 在页面刷新或关闭前发送请求
    // 浏览器会默认弹出提示框，告诉用户是否离开页面，可以在这里自定义提示信息
    const message = '你有未保存的数据，确定要离开吗？';
    event.returnValue = message; // 现代浏览器会显示自定义提示信息
    return message; // 兼容旧版本浏览器
});
</script>

<template>
    <div class="stats shadow w-full bg-base-200 mb-6">
        <div class="stat">
            <div class="stat-title">今日待办</div>
            <div class="stat-value">{{ todayStats?.todayCount || 0 }}</div>
            <div class="stat-desc">
                {{ todayStats?.todayCount - todayStats?.yesterdayCount > 0 ? '↗︎' : '↘︎' }}
                {{ Math.abs(todayStats?.todayCount - todayStats?.yesterdayCount || 0) }} 个比昨天
            </div>
        </div>
        <div class="stat">
            <div class="stat-title">工作时长</div>
            <div class="stat-value text-primary flex items-center gap-2">
                {{ workDurationStore.formatDuration(workDuration?.duration || 0) }}
            </div>
        </div>
        <div class="stat">
            <div class="stat-title">已完成</div>
            <div class="stat-value text-success">85%</div>
        </div>
        <div class="stat">
            <div class="stat-title">笔记总数</div>
            <div class="stat-value">23</div>
            <div class="stat-desc">本月新增 5 篇</div>
        </div>
    </div>
</template>

<style scoped></style>