<template>
    <div>
        <div class="grid grid-cols-12 gap-6 mb-6">
            <div class="col-span-12 hover-card">
                <Overview />
            </div>
        </div>
        <div class="grid grid-cols-12 gap-6 mb-6">
            <div class="col-span-12 lg:col-span-4 hover-card">
                <TrendChart />
            </div>
            <div class="col-span-12 md:col-span-6 lg:col-span-4 hover-card">
                <TaskDistribution />
            </div>
            <div class="col-span-12 md:col-span-6 lg:col-span-4 hover-card">
                <NoteDistribution />
            </div>
        </div>
        <div class="grid grid-cols-12 gap-6 mb-6">
            <div class="col-span-12 md:col-span-6 lg:col-span-4 hover-card">
                <WorkingHoursChart />
            </div>
            <div class="col-span-12 md:col-span-6 lg:col-span-4 hover-card">
                <QuickAdd />
            </div>
            <div class="col-span-12 lg:col-span-4 hover-card">
                <RecentActivities />
            </div>
        </div>
        <div class="grid grid-cols-12 gap-6">
            <div class="col-span-12 md:col-span-6 lg:col-span-6 hover-card">
                <FileManager />
            </div>
            <div class="col-span-12 md:col-span-6 lg:col-span-6 hover-card">
                <TodoList />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Overview from '@/components/dashboard/Overview.vue'
import TrendChart from '@/components/dashboard/charts/TodoTrendChart.vue'
import TaskDistribution from '@/components/dashboard/charts/TodoDistribution.vue'
import NoteDistribution from '@/components/dashboard/charts/NoteDistribution.vue'
import WorkingHoursChart from '@/components/dashboard/charts/WorkingHoursChart.vue'
import QuickAdd from '@/components/dashboard/QuickAdd.vue'
import RecentActivities from '@/components/dashboard/RecentActivities.vue'
import FileManager from '@/components/dashboard/FileManager.vue'
import TodoList from '@/components/dashboard/TodoList.vue'
</script>

<style>
/* 添加背景动画 */
@keyframes gradient {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}

.bg-gradient-to-br {
    background-size: 200% 200%;
    animation: gradient 15s ease infinite;
}

/* 添加卡片悬浮效果 */
.hover-card {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 1rem;
}

.hover-card:hover {
    transform: translateY(-4px) scale(1.005);
    box-shadow: 0 12px 24px -1px rgba(0, 0, 0, 0.08),
        0 6px 12px -1px rgba(0, 0, 0, 0.05);
    border-radius: 1rem;
}

.hover-card:hover .card {
    border-color: rgba(var(--p), 0.3);
}

/* 网格背景 */
.bg-grid-slate-100 {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(51 65 85 / 0.04)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
}

.bg-grid-slate-700 {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(51 65 85 / 0.1)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
}
</style>