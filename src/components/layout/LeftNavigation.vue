<template>
    <div class="bg-base-200 fixed left-0 top-0 h-screen w-24 p-2 z-40">
        <!-- Logo 部分 -->
        <div class="mb-4 mt-2">
            <Logo />
        </div>

        <!-- 导航菜单 -->
        <ul class="menu bg-base-200 w-20 rounded-box gap-2">
            <li v-for="item in menuItems" :key="item.path">
                <router-link :to="item.path"
                    class="hover:bg-neutral-content active:bg-neutral-content p-3 flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <!-- 首页图标 -->
                        <path v-if="item.icon === 'home'" stroke-linecap="round" stroke-linejoin="round"
                            stroke-width="2"
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />

                        <!-- 待办事项图标 -->
                        <path v-else-if="item.icon === 'todo'" stroke-linecap="round" stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />

                        <!-- 笔记图标 -->
                        <path v-else-if="item.icon === 'note'" stroke-linecap="round" stroke-linejoin="round"
                            stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />

                        <!-- 关于图标 -->
                        <path v-else-if="item.icon === 'info'" stroke-linecap="round" stroke-linejoin="round"
                            stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />

                        <!-- 统计图标 -->
                        <path v-else-if="item.icon === 'stats'" stroke-linecap="round" stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />

                        <!-- 文件图标 -->
                        <path v-else-if="item.icon === 'file'" stroke-linecap="round" stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span class="text-xs mt-1">{{ item.name }}</span>
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import Logo from '@/components/common/Logo.vue'

const menuItems = [
    { name: '首页', path: '/', icon: 'home' },
    { name: '待办', path: '/todo', icon: 'todo' },
    { name: '笔记', path: '/notes', icon: 'note' },
    { name: '文件', path: '/files', icon: 'file' },
    { name: '关于', path: '/', icon: 'info' }
]
</script>

<style></style>