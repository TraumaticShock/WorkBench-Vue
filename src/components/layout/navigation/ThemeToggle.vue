<template>
    <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
        </div>
        <ul tabindex="0" class="dropdown-content bg-base-300 rounded-box z-[1] w-20 p-2 shadow-2xl mt-4">
            <li v-for="theme in themes" :key="theme.value">
                <button class="btn btn-sm btn-block btn-ghost justify-start" @click="changeTheme(theme.value)">
                    {{ theme.label }}
                </button>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
const themes = [
    { label: '明亮', value: 'light' },
    { label: '黑暗', value: 'dark' },
    { label: '灰色', value: 'cupcake' },
    { label: '复古', value: 'retro' },
    { label: '海蓝', value: 'aqua' }
];

const changeTheme = (theme: string) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
};
</script>