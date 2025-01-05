<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useTodoStore } from '@/stores/todo'
import { storeToRefs } from 'pinia'
import { useWorkDurationStore } from '@/stores/workDuration'

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