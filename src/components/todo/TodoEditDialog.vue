<template>
    <dialog :class="{ 'modal': true, 'modal-open': modelValue }" @click="handleBackdropClick">
        <div class="modal-box" @click.stop>
            <h3 class="font-bold text-lg">{{ isEdit ? '编辑待办' : '新建待办' }}</h3>
            <form @submit.prevent="handleSubmit" class="py-4 flex flex-col gap-4">
                <div class="form-control w-full">
                    <label class="label">
                        <span class="label-text">标题</span>
                    </label>
                    <input type="text" v-model="form.title" placeholder="请输入待办标题" class="input input-bordered w-full"
                        required />
                </div>

                <div class="form-control w-full">
                    <label class="label">
                        <span class="label-text">分类</span>
                    </label>
                    <select class="select select-bordered" v-model="form.category" required>
                        <option value="">请选择分类</option>
                        <option v-for="category in categories" :key="category.id" :value="category.name">
                            {{ category.name }}
                        </option>
                    </select>
                </div>

                <div class="form-control w-full">
                    <label class="label">
                        <span class="label-text">优先级</span>
                    </label>
                    <select class="select select-bordered" v-model="form.priority" required>
                        <option value="">请选择优先级</option>
                        <option value="high">紧急</option>
                        <option value="medium">重要</option>
                        <option value="low">一般</option>
                    </select>
                </div>

                <div class="form-control w-full">
                    <label class="label">
                        <span class="label-text">截止日期</span>
                    </label>
                    <input type="date" v-model="form.dueDate" class="input input-bordered" />
                </div>

                <div class="form-control w-full">
                    <label class="label">
                        <span class="label-text">备注</span>
                    </label>
                    <textarea v-model="form.description" class="textarea textarea-bordered"
                        placeholder="请输入备注信息"></textarea>
                </div>

                <div class="modal-action">
                    <button type="button" class="btn" @click="$emit('update:modelValue', false)">取消</button>
                    <button type="submit" class="btn btn-primary">保存</button>
                </div>
            </form>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button @click="$emit('update:modelValue', false)">关闭</button>
        </form>
    </dialog>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue';
import type { CreateTodoFormParams } from '@/types/todo';

const props = defineProps<{
    modelValue: boolean;
    isEdit?: boolean;
    initialData?: Partial<CreateTodoFormParams>;
}>();

const emit = defineEmits<{
    'update:modelValue': [value: boolean];
    'submit': [data: CreateTodoFormParams];
}>();

const form = ref<CreateTodoFormParams>({
    title: '',
    category: '',
    priority: 'medium',
    dueDate: '',
    description: ''
});

// 监听初始数据变化
watch(() => props.initialData, (newVal) => {
    if (newVal) {
        form.value = { ...form.value, ...newVal };
    }
}, { immediate: true });

const handleSubmit = () => {
    emit('submit', { ...form.value });
    // 初始化表单内容
    form.value = {
        title: '',
        category: '',
        priority: 'medium',
        dueDate: new Date().toISOString().split('T')[0],
        description: ''
    };
};

// 点击背景关闭对话框
const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
        emit('update:modelValue', false);
    }
};

// 分类数据（实际应该从 store 或 API 获取）
const categories = ref([
    { id: '1', name: '工作' },
    { id: '2', name: '生活' },
    { id: '3', name: '学习' }
]);
</script>