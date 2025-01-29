<template>
    <div class="card bg-base-100 shadow-xl h-full relative overflow-hidden">
        <!-- 顶部装饰条 -->
        <div class="absolute top-0 left-0 right-0 h-12 bg-gradient-to-r from-neutral to-neutral/70">
            <div class="flex items-center h-full px-6">
                <h2 class="text-xl font-semibold text-white">{{ note?.title || '笔记详情' }}</h2>
                <div class="flex items-center gap-2 ml-auto">
                    <button class="btn btn-sm btn-ghost text-white hover:text-white gap-2" @click="handleEdit">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        编辑
                    </button>
                    <button class="btn btn-sm btn-ghost text-white hover:text-white gap-2" @click="router.back()">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        返回
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

            <!-- 右侧内容区域 -->
            <div class="flex-1 flex flex-col">
                <!-- 笔记信息 -->
                <div class="border-b border-base-200 p-6">
                    <div class="flex items-center gap-4 text-sm opacity-70">
                        <div class="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            <span>{{ noteCategoryStore.getCategoryName(note?.category_id || '') }}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{{ formatDate(note?.createTime) }}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <span>{{ note?.content?.length || 0 }} 字</span>
                        </div>
                        <div class="flex flex-wrap gap-2">
                            <div v-for="tag in note?.tags" :key="tag" class="badge badge-ghost badge-sm">
                                {{ tag }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Markdown 内容 -->
                <div class="flex-1 overflow-y-auto p-6">
                    <div class="prose prose-base max-w-none dark:prose-invert [&_pre]:bg-base-200 [&_pre]:p-4 [&_pre]:rounded-lg [&_code]:bg-base-200 [&_code]:px-1 [&_code]:rounded [&_img]:rounded-lg [&_a]:text-primary [&_a]:hover:text-primary/80 [&_blockquote]:border-l-4 [&_blockquote]:border-primary/50" v-html="htmlContent"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNoteStore } from '@/stores/note'
import { useNoteCategoryStore } from '@/stores/noteCategory'
import type { Note } from '@/types/note'
import MarkdownIt from 'markdown-it'
import anchor from 'markdown-it-anchor'
import tocPlugin from 'markdown-it-toc-done-right'

const route = useRoute()
const router = useRouter()
const noteStore = useNoteStore()
const noteCategoryStore = useNoteCategoryStore()

const note = ref<Note | null>(null)
const htmlContent = ref('')
const toc = ref('')

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

// 格式化日期
const formatDate = (date: string | undefined) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

// 渲染 Markdown
const renderMarkdown = () => {
    if (!note.value?.content) return

    // 先渲染内容，以确保生成锚点
    htmlContent.value = contentMd.render(note.value.content)
    
    // 生成目录（确保在内容之前插入 [[toc]] 标记）
    const contentWithToc = '[[toc]]\n' + note.value.content
    const fullRender = tocMd.render(contentWithToc)
    const tocMatch = fullRender.match(/<nav class="table-of-contents">([\s\S]*?)<\/nav>/)
    toc.value = tocMatch ? tocMatch[0] : ''
}

// 编辑笔记
const handleEdit = () => {
    if (note.value?.id) {
        router.push({ name: 'noteEdit', params: { id: note.value.id } })
    }
}

onMounted(async () => {
    const noteId = route.params.id as string
    if (noteId) {
        // 从 store 中获取笔记数据
        note.value = noteStore.state.notePage.records.find((n: Note) => n.id === noteId) || null
        if (note.value) {
            renderMarkdown()
        }
    }
})
</script>

<style scoped>
.card {
    border-radius: 1rem;
}

/* 只保留基本的滚动条样式 */
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