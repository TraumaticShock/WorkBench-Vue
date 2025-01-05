<template>
    <div class="stats shadow w-full bg-base-200 mb-6">
        <div class="stat">
            <div class="stat-title">总任务</div>
            <div class="stat-value">{{ total }}</div>
            <div class="stat-desc">较上周 ↗︎ 12%</div>
        </div>
        <div class="stat">
            <div class="stat-title">待处理</div>
            <div class="stat-value text-warning">{{ pending }}</div>
            <div class="stat-desc">较上周 ↘︎ 5%</div>
        </div>
        <div class="stat">
            <div class="stat-title">已完成</div>
            <div class="stat-value text-success">{{ completed }}</div>
            <div class="stat-desc">较上周 ↗︎ 23%</div>
        </div>
        <div class="stat">
            <div class="stat-title">完成率</div>
            <div class="stat-value text-info">{{ completionRate }}%</div>
            <div class="stat-desc">较上周 ↗︎ 8%</div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    total: number
    pending: number
    completed: number
    completionRate: number
}>()
</script>