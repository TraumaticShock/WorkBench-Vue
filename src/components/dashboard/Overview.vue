<script setup lang="ts">
import { ref, onMounted } from 'vue'

const workingHours = ref(6.5)
const workingTarget = ref(10) // 每日目标工作时长
const progress = ref(Math.round((workingHours.value / workingTarget.value) * 100))

// 这里可以添加获取工作时长的逻辑
// 例如从后端 API 获取或本地存储中读取
</script>

<template>
    <div class="stats shadow w-full bg-base-200 mb-6">
        <div class="stat">
            <div class="stat-title">今日待办</div>
            <div class="stat-value">12</div>
            <div class="stat-desc">↗︎ 2 个比昨天</div>
        </div>
        <div class="stat">
            <div class="stat-title">工作时长</div>
            <div class="stat-value text-primary">6.5h</div>
            <div class="stat-desc flex items-center gap-1">
                <div class="radial-progress text-xs" style="--value:65; --size:1.5rem;">65%</div>
                <span>日目标</span>
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