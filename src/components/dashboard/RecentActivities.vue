<template>
    <div class="card bg-base-200 shadow-xl h-[300px]">
        <div class="card-body">
            <h2 class="card-title text-sm">近期活动</h2>
            <div class="space-y-2">
                <div class="flex items-center gap-2">
                    <div class="badge badge-primary badge-sm">待办</div>
                    <span class="text-sm flex-1">完成了 "项目规划" 任务</span>
                    <span class="text-xs opacity-50">2小时前</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="badge badge-secondary badge-sm">笔记</div>
                    <span class="text-sm flex-1">更新了 "Vue3 学习笔记"</span>
                    <span class="text-xs opacity-50">4小时前</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="badge badge-accent badge-sm">日程</div>
                    <span class="text-sm flex-1">添加了 "团队周会" 日程</span>
                    <span class="text-xs opacity-50">昨天</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
</script>