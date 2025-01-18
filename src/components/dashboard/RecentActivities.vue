<template>
    <div class="card bg-base-100 shadow-xl h-[300px] relative overflow-hidden">
        <div class="absolute top-0 left-0 right-0 h-12 bg-gradient-to-r from-neutral to-neutral/70">
            <div class="flex items-center justify-between h-full px-6">
                <h2 class="text-xl font-semibold text-white">近期活动</h2>
            </div>
        </div>
        <div class="card-body h-full flex flex-col pt-16">
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

<style scoped>
.card {
    border-radius: 1rem;
}

/* 自定义滚动条样式 */
::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

::-webkit-scrollbar-track {
    background: transparent;
}

::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
    background: #ccc;
}
</style>

<script setup lang="ts">
</script>