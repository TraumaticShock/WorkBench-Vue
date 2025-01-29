<template>
    <!-- 添加 ConfirmDialog 组件 -->
    <ConfirmDialog
        v-model="showConfirmDialog"
        title="确认取消"
        message="确定要放弃编辑吗？"
        confirm-text="确定"
        cancel-text="取消"
        confirm-button-class="btn-error"
        @confirm="confirmCancel"
    />

    <div class="card bg-base-100 shadow-xl h-full relative overflow-hidden">
        <!-- 顶部装饰条 -->
        <div class="absolute top-0 left-0 right-0 h-12 bg-gradient-to-r from-neutral to-neutral/70">
            <div class="flex items-center h-full px-6">
                <h2 class="text-xl font-semibold text-white">编辑笔记</h2>
                <div class="flex items-center gap-2 ml-auto">
                    <button class="btn btn-sm btn-ghost text-white hover:text-white gap-2" @click="handleSave">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        保存
                    </button>
                    <button class="btn btn-sm btn-ghost text-white hover:text-white gap-2" @click="handleCancel">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        取消
                    </button>
                </div>
            </div>
        </div>

        <!-- 主要内容区域 -->
        <div class="pt-16 h-full flex">
            <!-- 左侧目录 -->
            <div class="w-[20%] border-r border-base-200 p-4 overflow-y-auto">
                <div class="text-sm [&_.table-of-contents]:text-sm [&_.table-of-contents_ul]:list-none [&_.table-of-contents_ul]:pl-4 [&_.table-of-contents_ul]:space-y-1 [&_.table-of-contents_li]:my-1 [&_.table-of-contents_a]:block [&_.table-of-contents_a]:py-1 [&_.table-of-contents_a:hover]:text-primary [&_.table-of-contents_a]:transition-colors [&_.table-of-contents>ul]:pl-0 [&_.table-of-contents_ul_ul]:mt-1 [&_.table-of-contents_ul_ul_li]:opacity-80" v-html="toc"></div>
            </div>

            <!-- 中间编辑区域 -->
            <div class="w-[50%] border-r border-base-200 p-6 flex flex-col gap-6">
                <!-- 标题输入 -->
                <div class="form-control w-full">
                    <input type="text" placeholder="请输入标题..." v-model="note.title"
                        class="input input-lg input-ghost w-full text-xl font-medium px-0 focus:outline-none" />
                </div>

                <!-- Markdown编辑区域 -->
                <div class="flex-1 relative">
                    <textarea class="textarea textarea-ghost w-full h-full resize-none focus:outline-none font-mono"
                        placeholder="开始写作..." v-model="note.content" @input="updatePreview"></textarea>
                </div>
            </div>

            <!-- 右侧预览和设置面板 -->
            <div class="w-[30%] flex flex-col">


                <!-- 设置面板 -->
                <div class="p-6 space-y-6">
                    <!-- 分类选择 -->
                    <div class="form-control w-full">
                        <label class="label">
                            <span class="label-text font-medium">分类</span>
                        </label>
                        <!-- <select class="select select-bordered w-full" v-model="note.category_id">
                            <option disabled value="">选择分类</option>
                            <option v-for="category in noteCategoryStore.categories" :key="category.id"
                                :value="category.id">
                                {{ category.name }}
                            </option>
                        </select> -->
                        <NoteCategoryTreeEdit v-model="note.category_id" class="max-h-[200px] overflow-y-auto" />
                    </div>

                    <!-- 标签输入 -->
                    <div class="form-control w-full">
                        <label class="label">
                            <span class="label-text font-medium">标签</span>
                        </label>
                        <input 
                            type="text" 
                            placeholder="输入标签，按回车添加" 
                            class="input input-bordered w-full" 
                            v-model="tagInput"
                            @keyup.enter="addTag"
                        />
                        <div class="flex flex-wrap gap-2 mt-2">
                            <div v-for="tag in note.tags" :key="tag" class="badge badge-neutral gap-1">
                                {{ tag }}
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    class="h-4 w-4 cursor-pointer" 
                                    fill="none"
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                    @click="removeTag(tag)"
                                >
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <!-- 笔记信息 -->
                    <div class="space-y-2 text-sm opacity-50">
                        <div>创建时间：{{ note.createTime || '暂无' }}</div>
                        <div>更新时间：{{ note.updateTime || '暂无' }}</div>
                        <div>字数统计：{{ note.content?.length || 0 }} 字</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useNoteStore } from '@/stores/note'
import { useNoteCategoryStore } from '@/stores/noteCategory'
import { Note } from '@/types/note'
import MarkdownIt from 'markdown-it/dist/markdown-it.js'
import anchor from 'markdown-it-anchor'
import tocPlugin from 'markdown-it-toc-done-right'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

const route = useRoute()
const router = useRouter()
const noteStore = useNoteStore()
const noteCategoryStore = useNoteCategoryStore()
const noteId = route.params.id as string || ''

// 创建用于内容的 markdown-it 实例
const contentMd = new MarkdownIt({
    html: true,
    breaks: true,
    linkify: true
})
.use(anchor, {
    permalink: anchor.permalink.headerLink()
})

// 创建用于目录的 markdown-it 实例
const tocMd = new MarkdownIt()
.use(anchor)
.use(tocPlugin, {
    level: [1, 2, 3, 4, 5],
    listType: 'ul',
    containerClass: 'table-of-contents',
    listClass: 'toc-list',
    itemClass: 'toc-item',
    linkClass: 'toc-link',
    format: (heading: string) => heading // 保持标题原样
})

const htmlContent = ref('')
const toc = ref('')

// 创建响应式变量存储笔记数据
const note = ref<Note>({
    id: '',
    title: '',
    content: '',
    category_id: '',
    categoryName: '',
    createTime: '',
    updateTime: '',
    tags: []
})

// 添加标签输入的响应式变量
const tagInput = ref('')

// 添加标签处理函数
const addTag = () => {
    const tag = tagInput.value.trim()
    if (!note.value.tags) {
        note.value.tags = []
    }
    if (tag && !note.value.tags.includes(tag)) {
        note.value.tags.push(tag)
    }
    tagInput.value = ''
}

// 删除标签处理函数
const removeTag = (tagToRemove: string) => {
    note.value.tags = note.value.tags.filter(tag => tag !== tagToRemove)
}

// 添加确认对话框的状态
const showConfirmDialog = ref(false)

// 更新预览和目录
const updatePreview = () => {
    // 先渲染内容，以确保生成锚点
    htmlContent.value = contentMd.render(note.value.content)
    
    // 生成目录（确保在内容之前插入 [[toc]] 标记）
    const contentWithToc = '[[toc]]\n' + note.value.content
    const fullRender = tocMd.render(contentWithToc)
    const tocMatch = fullRender.match(/<nav class="table-of-contents">([\s\S]*?)<\/nav>/)
    toc.value = tocMatch ? tocMatch[0] : ''
}

// 修改取消按钮的点击处理函数
const handleCancel = () => {
    if (note.value.content || note.value.title) {
        showConfirmDialog.value = true
    } else {
        router.back()
    }
}

// 添加确认取消的处理函数
const confirmCancel = () => {
    router.back()
}

// 添加保存处理函数
const handleSave = async () => {
    try {
        const saveData = {
            title: note.value.title,
            content: note.value.content,
            category_id: note.value.category_id,
            tags: note.value.tags
        }

        if (noteId) {
            // 更新笔记
            await noteStore.actions.updateNote(noteId, saveData)
            // 保存成功后刷新笔记列表
            await noteStore.actions.getNotePage({ page: 1, size: 9 })
        } else {
            // 创建笔记
            await noteStore.actions.createNote(saveData)
            // 保存成功后刷新笔记列表
            await noteStore.actions.getNotePage({ page: 1, size: 9 })
        }
        // 保存成功后返回笔记列表页
        router.back()
    } catch (error) {
        console.error('保存笔记失败:', error)
    }
}

// 修改 onMounted
onMounted(() => {
    if (noteId) {
        // 编辑模式：获取笔记数据
        const noteData = noteStore.state.notePage.records.find((n: Note) => n.id === noteId)
        console.log(noteData)
        if (noteData) {
            note.value = {
                ...noteData,
                tags: noteData.tags || []  // 确保 tags 存在
            }
            updatePreview()
        }
    } else {
        // 新建模式：初始化空笔记
        note.value = {
            id: '',
            title: '',
            content: '',
            category_id: '',
            categoryName: '',
            createTime: '',
            updateTime: '',
            tags: []  // 确保初始化为空数组
        }
    }
})
</script>

<style scoped>
.card {
    border-radius: 1rem;
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

/* 添加目录样式 */
.table-of-contents {
    @apply text-sm;
}

.table-of-contents ul {
    @apply list-none pl-4;
}

.table-of-contents li {
    @apply my-1;
}

.table-of-contents a {
    @apply hover:text-primary transition-colors;
}

/* Markdown 预览样式 */
.prose pre {
    @apply bg-base-200 p-4 rounded-lg;
}

.prose code {
    @apply bg-base-200 px-1 rounded;
}

.prose img {
    @apply rounded-lg;
}
</style>