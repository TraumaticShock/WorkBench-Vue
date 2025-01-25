<template>
    <div class="card bg-base-100 h-full flex flex-col">
        <div class="card-body p-0 flex flex-col h-full">
            <!-- 顶部工具栏 -->
            <div class="px-6 pt-6 pb-4 border-b border-base-300">
                <div class="flex items-center justify-between">
                    <h2 class="card-title text-lg font-bold">{{ todo?.id ? '编辑待办' : '新建待办' }}</h2>
                    <div class="flex items-center gap-2">
                        <button class="btn btn-ghost btn-sm gap-2 hover:bg-error/20 hover:text-error"
                            @click="handleCancel">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            取消
                        </button>
                        <button class="btn btn-primary btn-sm gap-2" @click="handleSave" :disabled="!formValid">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M5 13l4 4L19 7" />
                            </svg>
                            保存
                        </button>
                    </div>
                </div>
            </div>

            <!-- 编辑区域 -->
            <div class="overflow-y-auto px-6 py-4 flex-1 min-h-0">
                <div class="flex flex-col gap-4 h-full">
                    <!-- 错误提示 -->
                    <div v-if="showError" class="alert alert-error shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>请填写所有必填项（带*号的字段）</span>
                    </div>

                    <!-- 标题输入 -->
                    <div class="form-control w-full flex-none">
                        <label class="label py-1">
                            <span class="label-text font-medium">标题<span class="text-error ml-1">*</span></span>
                        </label>
                        <input type="text" v-model="form.title" placeholder="请输入待办事项标题"
                            class="input input-bordered w-full h-10 min-h-[2.5rem] focus:input-primary transition-colors"
                            :class="{ 'input-error': showError && !form.title?.trim() }" />
                    </div>

                    <!-- 描述输入 -->
                    <div class="form-control w-full flex-1">
                        <label class="label py-1">
                            <span class="label-text font-medium">描述</span>
                        </label>
                        <textarea v-model="form.description" placeholder="请输入待办事项描述"
                            class="textarea textarea-bordered h-full resize-none focus:textarea-primary transition-colors"></textarea>
                    </div>

                    <!-- 状态和优先级选择 -->
                    <div class="grid grid-cols-2 gap-4 flex-none">
                        <!-- 状态选择 -->
                        <div class="form-control w-full">
                            <label class="label py-1">
                                <span class="label-text font-medium">状态<span class="text-error ml-1">*</span></span>
                            </label>
                            <div class="join w-full">
                                <button class="join-item btn btn-sm flex-1"
                                    :class="{ 'btn-primary': form.status === 'pending' }"
                                    @click="form.status = 'pending'">
                                    <span class="w-2 h-2 rounded-full bg-warning mr-2"></span>
                                    进行中
                                </button>
                                <button class="join-item btn btn-sm flex-1"
                                    :class="{ 'btn-primary': form.status === 'completed' }"
                                    @click="form.status = 'completed'">
                                    <span class="w-2 h-2 rounded-full bg-success mr-2"></span>
                                    已完成
                                </button>
                            </div>
                        </div>

                        <!-- 优先级选择 -->
                        <div class="form-control w-full">
                            <label class="label py-1">
                                <span class="label-text font-medium">优先级<span class="text-error ml-1">*</span></span>
                            </label>
                            <div class="join w-full">
                                <button class="join-item btn btn-sm flex-1"
                                    :class="{ 'btn-primary': form.priority === 'low' }" @click="form.priority = 'low'">
                                    <span class="w-2 h-2 rounded-full bg-success mr-2"></span>
                                    一般
                                </button>
                                <button class="join-item btn btn-sm flex-1"
                                    :class="{ 'btn-primary': form.priority === 'medium' }"
                                    @click="form.priority = 'medium'">
                                    <span class="w-2 h-2 rounded-full bg-warning mr-2"></span>
                                    重要
                                </button>
                                <button class="join-item btn btn-sm flex-1"
                                    :class="{ 'btn-primary': form.priority === 'high' }"
                                    @click="form.priority = 'high'">
                                    <span class="w-2 h-2 rounded-full bg-error mr-2"></span>
                                    紧急
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- 分类 -->
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text font-medium">分类<span class="text-error ml-1">*</span></span>
                        </label>
                        <CategoryTree v-model="form.category_id" class="max-h-[200px] overflow-y-auto" />
                    </div>

                    <!-- 截止日期 -->
                    <div class="form-control w-full">
                        <label class="label py-1">
                            <span class="label-text font-medium">截止日期</span>
                        </label>
                        <input type="datetime-local" v-model="form.dueDate"
                            class="input input-bordered w-full h-10 min-h-[2.5rem] focus:input-primary transition-colors" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { Todo } from '@/types/todo'

import CategoryTree from './TodoCategoryTree.vue'

interface Props {
    todo: Todo | Partial<Todo> | null
}

const props = defineProps<Props>()
const emit = defineEmits(['save', 'cancel'])

// 表单数据
const form = ref<Todo>({
    id: props.todo?.id,
    title: '',
    description: '',
    priority: 'low',
    status: 'pending',
    dueDate: '',
    category_id: '',
    createdAt: '',
    updatedAt: ''
})

// 表单验证
const formValid = computed(() => {
    return form.value.title?.trim() &&
        form.value.priority &&
        form.value.status &&
        form.value.category_id?.trim()
})

// 错误提示
const showError = ref(false)

// 监听 todo 变化，更新表单数据
watch(() => props.todo, (newTodo) => {
    if (newTodo?.id) {  // 编辑模式
        form.value.id = newTodo.id
        form.value.title = newTodo.title || ''
        form.value.description = newTodo.description || ''
        form.value.status = newTodo.status || 'pending'
        form.value.priority = newTodo.priority || 'low'
        form.value.dueDate = newTodo.dueDate || ''
        form.value.category_id = newTodo.category_id || ''
    } else {  // 新建模式
        form.value.title = ''
        form.value.description = ''
        form.value.status = 'pending'
        form.value.priority = 'low'
        form.value.dueDate = ''
        form.value.category_id = ''
    }
}, { immediate: true })

// 保存
const handleSave = () => {
    if (!formValid.value) {
        showError.value = true
        // 3秒后自动隐藏错误提示
        setTimeout(() => {
            showError.value = false
        }, 3000)
        return
    }
    emit('save', form.value as Todo)
}

// 取消
const handleCancel = () => {
    emit('cancel')
}
</script>

<style scoped>
/* 滚动条样式 */
.overflow-y-auto::-webkit-scrollbar {
    width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
    background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.3);
}

/* 输入框动画 */
.input,
.textarea {
    transition: all 0.3s ease;
}

/* 按钮动画 */
.btn {
    transition: all 0.3s ease;
}

/* 卡片阴影动画 */
.card {
    transition: all 0.3s ease;
}
</style>