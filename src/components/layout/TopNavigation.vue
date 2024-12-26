<template>
    <div class="navbar bg-base-100 fixed top-0 right-0 z-30 shadow-sm w-[calc(100%-6rem)]">
        <div class="flex-1 ml-4">
            <SearchBar />
            <div class="divider divider-horizontal"></div>
            <Breadcrumb />
        </div>
        <div class="flex-none gap-4 mr-4 flex items-center">
            <Weather />
            <ThemeToggle />
            <UserProfile />
        </div>
    </div>
</template>

<script setup lang="ts">
import SearchBar from './navigation/SearchBar.vue'
import ThemeToggle from './navigation/ThemeToggle.vue'
import UserProfile from './navigation/UserProfile.vue'
import Breadcrumb from './navigation/Breadcrumb.vue'
import Weather from './navigation/Weather.vue'

// 初始化主题
const initTheme = () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
};

initTheme();
</script>