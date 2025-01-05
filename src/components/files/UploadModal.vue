<template>
    <dialog :class="{ 'modal modal-open': modelValue }" class="modal">
        <div class="modal-box">
            <h3 class="font-bold text-lg">上传文件</h3>
            <div class="py-4 space-y-4">
                <div class="form-control w-full">
                    <label class="label">
                        <span class="label-text">选择文件</span>
                    </label>
                    <input type="file" class="file-input file-input-bordered w-full" @change="handleFileChange" />
                </div>
                <div class="form-control w-full">
                    <label class="label">
                        <span class="label-text">分类</span>
                    </label>
                    <select v-model="form.category" class="select select-bordered w-full">
                        <option v-for="category in categories" :key="category.id" :value="category.name">
                            {{ category.name }}
                        </option>
                    </select>
                </div>
            </div>
            <div class="modal-action">
                <button class="btn" @click="close">取消</button>
                <button class="btn btn-primary" @click="submit">上传</button>
            </div>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button @click="close">关闭</button>
        </form>
    </dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Category {
    id: string
    name: string
    icon: string
    count: number
}

const props = defineProps<{
    modelValue: boolean
    categories: Category[]
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'submit', data: any): void
}>()

const form = ref({
    file: null as File | null,
    category: '文档'
})

const handleFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    if (target.files) {
        form.value.file = target.files[0]
    }
}

const close = () => {
    emit('update:modelValue', false)
}

const submit = () => {
    if (form.value.file) {
        emit('submit', {
            name: form.value.file.name,
            type: getFileType(form.value.file.name),
            size: formatFileSize(form.value.file.size),
            category: form.value.category
        })
        form.value.file = null
    }
}

const getFileType = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase()
    if (['doc', 'docx', 'pdf', 'txt'].includes(ext || '')) return 'doc'
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) return 'image'
    if (['mp4', 'avi', 'mov'].includes(ext || '')) return 'video'
    return 'other'
}

const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>