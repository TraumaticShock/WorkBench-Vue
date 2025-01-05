<template>
    <div class="stats shadow w-full bg-base-200 mb-6">
        <div class="stat">
            <div class="stat-title">总笔记</div>
            <div class="stat-value">{{ total }}</div>
            <div class="stat-desc">本月新增 5 篇</div>
        </div>
        <div class="stat">
            <div class="stat-title">技术笔记</div>
            <div class="stat-value text-primary">{{ categories['技术笔记'] || 0 }}</div>
            <div class="stat-desc">占比 {{ Math.round((categories['技术笔记'] || 0) / total * 100) }}%</div>
        </div>
        <div class="stat">
            <div class="stat-title">工作总结</div>
            <div class="stat-value text-secondary">{{ categories['工作总结'] || 0 }}</div>
            <div class="stat-desc">占比 {{ Math.round((categories['工作总结'] || 0) / total * 100) }}%</div>
        </div>
        <div class="stat">
            <div class="stat-title">学习计划</div>
            <div class="stat-value text-accent">{{ categories['学习计划'] || 0 }}</div>
            <div class="stat-desc">占比 {{ Math.round((categories['学习计划'] || 0) / total * 100) }}%</div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    total: number
    categories: Record<string, number>
}>()
</script>