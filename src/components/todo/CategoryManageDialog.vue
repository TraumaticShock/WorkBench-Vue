<template>
    <dialog :class="{ 'modal': true, 'modal-open': modelValue }" @click="handleBackdropClick">
        <div class="modal-box max-w-3xl p-0" @click.stop>
            <!-- 顶部装饰条 -->
            <div class="h-12 bg-gradient-to-r from-neutral to-neutral/70">
                <div class="flex items-center justify-between h-full px-6">
                    <h2 class="text-xl font-semibold text-white">分类管理</h2>
                    <button class="btn btn-sm btn-ghost text-white gap-2" @click="handleAdd()">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 4v16m8-8H4" />
                        </svg>
                        新建分类
                    </button>
                </div>
            </div>

            <div class="flex h-[500px]">
                <!-- 左侧分类树 -->
                <div class="w-1/2 border-r border-base-200 overflow-y-auto">
                    <div class="p-4">
                        <!-- 分类树 -->
                        <div v-for="category in categories" :key="category.id" class="category-tree">
                            <CategoryTreeItem
                                :category="category"
                                :selected-category="selectedCategory"
                                @select="selectCategory"
                                @toggle="toggleExpand"
                                @add="handleAdd"
                            />
                        </div>
                    </div>
                </div>

                <!-- 右侧编辑区域 -->
                <div class="w-1/2 overflow-y-auto">
                    <div v-if="selectedCategory" class="p-6">
                        <div class="space-y-6">
                            <!-- 标题 -->
                            <div class="flex items-center justify-between">
                                <h3 class="text-lg font-medium">
                                    {{ isCreating ? '新建分类' : '编辑分类' }}
                                </h3>
                            </div>

                            <!-- 基本信息 -->
                            <div class="form-control">
                                <label class="label">
                                    <span class="label-text font-medium">分类名称</span>
                                </label>
                                <input type="text" v-model="selectedCategory.name" placeholder="请输入分类名称"
                                    class="input input-bordered w-full focus:input-primary transition-colors" />
                            </div>

                            <!-- 父分类选择 -->
                            <div class="form-control">
                                <label class="label">
                                    <span class="label-text font-medium">父分类</span>
                                </label>
                                <select class="select select-bordered w-full focus:select-primary transition-colors"
                                    v-model="selectedCategory.parentId">
                                    <option value="">无</option>
                                    <option v-for="category in flatCategories" :key="category.id"
                                        :value="category.id"
                                        :disabled="category.id === selectedCategory.id">
                                        {{ category.name }}
                                    </option>
                                </select>
                            </div>

                            <!-- 操作按钮 -->
                            <div class="flex justify-between pt-4">
                                <button v-if="!isCreating"
                                    class="btn btn-error btn-sm gap-2" 
                                    @click="handleDelete(selectedCategory)">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    删除分类
                                </button>
                                <div class="flex gap-2" :class="{ 'ml-auto': isCreating }">
                                    <button class="btn btn-ghost btn-sm" @click="selectedCategory = null">取消</button>
                                    <button class="btn btn-primary btn-sm gap-2" @click="handleSave">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M5 13l4 4L19 7" />
                                        </svg>
                                        {{ isCreating ? '创建' : '保存' }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="h-full flex items-center justify-center text-base-content/50">
                        <div class="text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-4 opacity-20"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            <p>请选择一个分类进行编辑，或点击右上角新建分类</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button @click="$emit('update:modelValue', false)">关闭</button>
        </form>
    </dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import CategoryTreeItem from './CategoryTreeItem.vue'
import type { TodoCategory } from '@/types/todoCategory'
import { useTodoCategoryStore } from '@/stores/todoCategory'

const props = defineProps<{
    modelValue: boolean
}>()

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
}>()

const todoCategoryStore = useTodoCategoryStore()
const categories = computed(() => todoCategoryStore.categories)

// 选中的分类
const selectedCategory = ref<TodoCategory | null>(null)
// 是否为新建状态
const isCreating = ref(false)

// 将树形结构扁平化，用于父分类选择
const flatCategories = computed(() => {
    const result: TodoCategory[] = []
    const flatten = (items: TodoCategory[]) => {
        items.forEach(item => {
            result.push(item)
            if (item.children?.length) {
                flatten(item.children)
            }
        })
    }
    flatten(categories.value)
    return result
})

// 点击背景关闭对话框
const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
        emit('update:modelValue', false)
    }
}

// 选择分类
const selectCategory = (category: TodoCategory) => {
    selectedCategory.value = { ...category }
    isCreating.value = false
}

// 展开/折叠分类
const toggleExpand = (category: TodoCategory) => {
    category.expanded = !category.expanded
}

// 添加分类
const handleAdd = (parentId?: string) => {
    selectedCategory.value = {
        name: '新建分类',
        parentId
    }
    isCreating.value = true
}

// 保存更改
const handleSave = async () => {
    if (!selectedCategory.value) return

    try {
        if (isCreating.value) {
            // 新建分类
            await todoCategoryStore.createCategory(selectedCategory.value.name, selectedCategory.value.parentId);
        } else {
            // 更新分类
            await todoCategoryStore.updateCategory(selectedCategory.value.id, selectedCategory.value);
        }
        selectedCategory.value = null;
        isCreating.value = false;
        emit('update:modelValue', false)
    } catch (error) {
        console.error('保存分类失败:', error);
    }
}

// 删除分类
const handleDelete = (category: TodoCategory) => {
    todoCategoryStore.deleteCategory(category.id)
    selectedCategory.value = null
}
</script>

<style scoped>
.category-tree {
    @apply space-y-1;
}

.category-item > div.active {
    @apply bg-primary/10;
}

/* 添加过渡动画 */
.category-item {
    @apply transition-all duration-200;
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