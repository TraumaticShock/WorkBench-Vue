<template>
    <div class="flex items-center justify-center gap-2">
        <button class="btn btn-xs btn-ghost" :disabled="current === 1" @click="handlePageChange(current - 1)">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
        </button>
        <span class="text-xs opacity-50">第 {{ current }} / {{ total }} 页</span>
        <button class="btn btn-xs btn-ghost" :disabled="current === total" @click="handlePageChange(current + 1)">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
        </button>
        <!-- 页面跳转 -->
        <div class="flex items-center gap-2 ml-4">
            <span class="text-xs opacity-50">跳转到</span>
            <input type="number" class="input input-xs input-bordered w-14" v-model="jumpPage"
                min="1" :max="total" @keyup.enter="handleJump">
            <button class="btn btn-xs btn-primary" @click="handleJump" :disabled="!isValidJumpPage">
                跳转
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
    current: number
    total: number
}

const props = defineProps<Props>()
const emit = defineEmits(['update:current'])

const jumpPage = ref(props.current)

// 判断跳转页码是否有效
const isValidJumpPage = computed(() => {
    const page = Number(jumpPage.value)
    return page >= 1 && page <= props.total
})

// 处理页面变化
const handlePageChange = (page: number) => {
    if (page >= 1 && page <= props.total) {
        emit('update:current', page)
        jumpPage.value = page
    }
}

// 处理跳转
const handleJump = () => {
    if (isValidJumpPage.value) {
        handlePageChange(Number(jumpPage.value))
    }
}
</script> 