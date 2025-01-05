<template>
    <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
            <h2 class="card-title text-sm mb-4">文件分类</h2>
            <ul class="menu bg-base-200 rounded-box gap-2">
                <li v-for="category in categories" :key="category.id"
                    :class="{ 'bordered': modelValue === category.id }">
                    <a @click="$emit('update:modelValue', category.id)" class="flex justify-between hover:bg-base-300">
                        <span class="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path v-if="category.icon === 'folder'" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                <path v-else-if="category.icon === 'document'" stroke-linecap="round"
                                    stroke-linejoin="round" stroke-width="2"
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                <path v-else-if="category.icon === 'image'" stroke-linecap="round"
                                    stroke-linejoin="round" stroke-width="2"
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                <path v-else-if="category.icon === 'video'" stroke-linecap="round"
                                    stroke-linejoin="round" stroke-width="2"
                                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
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