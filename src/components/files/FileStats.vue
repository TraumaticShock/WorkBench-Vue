<template>
    <div class="stats shadow w-full bg-base-200 mb-6">
        <div class="stat">
            <div class="stat-title">总文件</div>
            <div class="stat-value">{{ stats.total }}</div>
            <div class="stat-desc">本月新增 12 个</div>
        </div>
        <div class="stat">
            <div class="stat-title">文档</div>
            <div class="stat-value text-primary">{{ stats.doc }}</div>
            <div class="stat-desc">占比 {{ Math.round((stats.doc / stats.total) * 100) }}%</div>
        </div>
        <div class="stat">
            <div class="stat-title">图片</div>
            <div class="stat-value text-secondary">{{ stats.image }}</div>
            <div class="stat-desc">占比 {{ Math.round((stats.image / stats.total) * 100) }}%</div>
        </div>
        <div class="stat">
            <div class="stat-title">视频</div>
            <div class="stat-value text-accent">{{ stats.video }}</div>
            <div class="stat-desc">占比 {{ Math.round((stats.video / stats.total) * 100) }}%</div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface FileStats {
    total: number
    doc: number
    image: number
    video: number
    other: number
}

defineProps<{
    stats: FileStats
}>()
</script>