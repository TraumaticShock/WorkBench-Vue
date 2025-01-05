<template>
    <dialog :class="{ 'modal modal-open': modelValue }" class="modal">
        <div class="modal-box max-w-3xl">
            <h3 class="font-bold text-lg">{{ isEdit ? '编辑笔记' : '新建笔记' }}</h3>
            <div class="py-4 space-y-4">
                <div class="form-control w-full">
                    <label class="label">
                        <span class="label-text">标题</span>
                    </label>
                    <input type="text" v-model="form.title" placeholder="输入笔记标题" class="input input-bordered w-full" />
                </div>
                <div class="form-control w-full">
                    <label class="label">
                        <span class="label-text">内容</span>
                    </label>
                    <textarea v-model="form.content" class="textarea textarea-bordered h-32"
                        placeholder="输入笔记内容"></textarea>
                </div>
                <div class="grid grid-cols-2 gap-4">
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
                    <div class="form-control w-full">
                        <label class="label">
                            <span class="label-text">标签</span>
                        </label>
                        <input type="text" v-model="tagInput" @keydown.enter="addTag" placeholder="输入标签后按回车"
                            class="input input-bordered w-full" />
                        <div class="flex flex-wrap gap-2 mt-2">
                            <div v-for="tag in form.tags" :key="tag"
                                class="badge badge-outline gap-2 cursor-pointer hover:bg-base-300"
                                @click="removeTag(tag)">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    class="inline-block w-4 h-4 stroke-current">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                {{ tag }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-action">
                <button class="btn" @click="close">取消</button>
                <button class="btn btn-primary" @click="submit">确定</button>
            </div>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button @click="close">关闭</button>
        </form>
    </dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Category {
    id: string
    name: string
    icon: string
    count: number
}

interface Props {
    modelValue: boolean
    categories: Category[]
    editData?: {
        id?: number
        title: string
        content: string
        category: string
        tags: string[]
    }
}

const props = defineProps<Props>()
const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'submit', data: any): void
}>()

const isEdit = computed(() => !!props.editData?.id)
const tagInput = ref('')

const form = ref({
    title: '',
    content: '',
    category: '技术笔记',
    tags: [] as string[]
})

watch(() => props.editData, (newVal) => {
    if (newVal) {
        form.value = { ...newVal }
    }
}, { immediate: true })

const addTag = (e: Event) => {
    e.preventDefault()
    if (tagInput.value.trim()) {
        form.value.tags.push(tagInput.value.trim())
        tagInput.value = ''
    }
}

const removeTag = (tag: string) => {
    form.value.tags = form.value.tags.filter(t => t !== tag)
}

const close = () => {
    emit('update:modelValue', false)
}

const submit = () => {
    emit('submit', {
        ...form.value,
        id: props.editData?.id
    })
    close()
}
</script>