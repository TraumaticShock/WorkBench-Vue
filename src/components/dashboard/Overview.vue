<script setup lang="ts">
import { onMounted } from 'vue'
import { useTodoStore } from '@/stores/todo'
import { storeToRefs } from 'pinia'
import { useWorkDurationStore } from '@/stores/workDuration'

const todoStore = useTodoStore();
const workDurationStore = useWorkDurationStore();

const { stats } = storeToRefs(todoStore);
const { workDuration } = storeToRefs(workDurationStore);

</script>

<template>
    <div class="stats shadow w-full bg-base-200 mb-6">
        <div class="stat">
            <div class="stat-title">今日待办</div>
            <div class="stat-value">{{ stats.today?.count || 0 }}</div>
            <div class="stat-desc">
                {{ stats.today?.count - stats.yesterday?.count > 0 ? '↗︎' : '↘︎' }}
                {{ Math.abs(stats.today?.count - stats.yesterday?.count || 0) }} 个比昨天
            </div>
        </div>
        <div class="stat">
            <div class="stat-title">已完成</div>
            <div class="stat-value text-success">{{ stats.complete?.count || 0 }}</div>
        </div>
        <div class="stat">
            <div class="stat-title">笔记总数</div>
            <div class="stat-value">23</div>
            <div class="stat-desc">本月新增 5 篇</div>
        </div>
        <div class="stat">
            <div class="stat-title">工作时长</div>
            <div class="stat-value text-primary flex items-center gap-2">
                {{ workDurationStore.formatDuration(workDuration?.duration || 0) }}
            </div>
        </div>
    </div>
</template>

<style scoped></style>