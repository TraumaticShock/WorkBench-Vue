<template>
    <div class="card bg-base-100 shadow-xl h-full flex flex-col">
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
                        <button class="btn btn-primary btn-sm gap-2" @click="handleSave">
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
                    <!-- 标题输入 -->
                    <div class="form-control w-full flex-none">
                        <label class="label py-1">
                            <span class="label-text font-medium">标题</span>
                        </label>
                        <input type="text" v-model="form.title" placeholder="请输入待办事项标题"
                            class="input input-bordered w-full h-10 min-h-[2.5rem] focus:input-primary transition-colors" />
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
                                <span class="label-text font-medium">状态</span>
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
                                <span class="label-text font-medium">优先级</span>
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

                    <!-- 分类和截止日期 -->
                    <div class="grid grid-cols-2 gap-4">
                        <!-- 分类选择 -->
                        <div class="form-control w-full">
                            <label class="label py-1">
                                <span class="label-text font-medium">分类</span>
                            </label>
                            <div class="join w-full">
                                <button v-for="category in availableCategories" :key="category"
                                    class="join-item btn btn-sm flex-1"
                                    :class="{ 'btn-primary': form.category === category }"
                                    @click="form.category = category">
                                    {{ category }}
                                </button>
                            </div>
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
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { Todo } from '@/types/todo'

interface Props {
    todo: Todo | Partial<Todo> | null
}

const props = defineProps<Props>()
const emit = defineEmits(['save', 'cancel'])

// 表单数据
const form = reactive({
    title: '',
    description: '',
    status: 'pending',
    priority: 'low',
    dueDate: '',
    category: '工作'
})

// 可选分类
const availableCategories = ref(['工作', '学习', '生活'])

// 监听 todo 变化，更新表单数据
watch(() => props.todo, (newTodo) => {
    if (newTodo?.id) {  // 编辑模式
        form.title = newTodo.title || ''
        form.description = newTodo.description || ''
        form.status = newTodo.status || 'pending'
        form.priority = newTodo.priority || 'low'
        form.dueDate = newTodo.dueDate || ''
        form.category = newTodo.category || '工作'
    } else {  // 新建模式
        form.title = ''
        form.description = ''
        form.status = 'pending'
        form.priority = 'low'
        form.dueDate = ''
        form.category = '工作'
    }
}, { immediate: true })

// 保存
const handleSave = () => {
    emit('save', {
        ...form,
        id: props.todo?.id
    })
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