<template>
    <div class="p-4">
        <Overview />
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <TrendChart />
            <TaskDistribution />
            <NoteDistribution />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <WorkingHoursChart />
            <QuickAdd />
            <RecentActivities />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <FileManager />
            <TodoList />
        </div>
        <Footer />
    </div>
</template>

<script setup lang="ts">
import Overview from '@/components/dashboard/Overview.vue'
import TrendChart from '@/components/dashboard/charts/TrendChart.vue'
import TaskDistribution from '@/components/dashboard/charts/TaskDistribution.vue'
import NoteDistribution from '@/components/dashboard/charts/NoteDistribution.vue'
import WorkingHoursChart from '@/components/dashboard/charts/WorkingHoursChart.vue'
import QuickAdd from '@/components/dashboard/QuickAdd.vue'
import RecentActivities from '@/components/dashboard/RecentActivities.vue'
import FileManager from '@/components/dashboard/FileManager.vue'
import TodoList from '@/components/dashboard/TodoList.vue'
import Footer from '@/components/layout/Footer.vue'
</script>