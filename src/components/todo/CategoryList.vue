<template>
    <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
            <h2 class="card-title text-sm mb-4">任务分类</h2>
            <ul class="menu bg-base-200 rounded-box gap-2">
                <li v-for="category in categories" :key="category.id"
                    :class="{ 'bordered': modelValue === category.id }">
                    <a @click="$emit('update:modelValue', category.id)" class="flex justify-between hover:bg-base-300">
                        <span class="flex items-center gap-2">
                            <span :class="category.icon" class="w-4 h-4"></span>
                            {{ category.name }}
                        </span>
                        <span class="badge badge-sm">{{ category.count }}</span>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Category {
    id: string
    name: string
    icon: string
    count: number
}

defineProps<{
    categories: Category[]
    modelValue: string
}>()

defineEmits<{
    (e: 'update:modelValue', value: string): void
}>()
</script>