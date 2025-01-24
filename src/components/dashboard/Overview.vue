<script setup lang="ts">
import { useTodoStore } from '@/stores/todo'
import { storeToRefs } from 'pinia'
import { useWorkDurationStore } from '@/stores/workDuration'
import { useTodoCategoryStore } from '@/stores/todoCategory'
import { useNoteStore } from '@/stores/note';

const todoStore = useTodoStore();
const noteStore = useNoteStore();
const workDurationStore = useWorkDurationStore();   
const todoCategoryStore = useTodoCategoryStore();

const { state: todoState } = storeToRefs(todoStore);
const { state: noteState } = storeToRefs(noteStore);
const { workDuration } = storeToRefs(workDurationStore);
const { categories } = storeToRefs(todoCategoryStore);

</script>

<template>
    <div class="card bg-base-100 shadow-xl relative overflow-hidden h-[200px]">
        <div class="absolute top-0 left-0 right-0 h-12 bg-gradient-to-r from-neutral to-neutral/70">
            <div class="flex items-center justify-between h-full px-6">
                <h2 class="text-xl font-semibold text-white">数据概览</h2>
            </div>
        </div>
        <div class="card-body pt-16">
            <div class="grid grid-cols-4 gap-4">
                <div class="stat bg-base-200/50 rounded-xl">
                    <div class="stat-title">今日待办</div>
                    <div class="stat-value">{{ todoState.stats.todayCount }}</div>
                </div>
                <div class="stat bg-base-200/50 rounded-xl">
                    <div class="stat-title">已完成</div>
                    <div class="stat-value text-success">{{ todoState.stats.completeCount }}</div>
                </div>
                <div class="stat bg-base-200/50 rounded-xl">
                    <div class="stat-title">笔记总数</div>
                    <div class="stat-value">{{ noteState.stats.count }}</div>
                    <div class="stat-desc">本月新增 {{ noteState.stats.monthCount }} 篇</div>
                </div>
                <div class="stat bg-base-200/50 rounded-xl">
                    <div class="stat-title">工作时长</div>
                    <div class="stat-value text-primary flex items-center gap-2">
                        {{ workDurationStore.formatDuration(workDuration?.duration || 0) }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card {
    border-radius: 1rem;
}

.stat {
    padding: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
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