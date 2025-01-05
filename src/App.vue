<template>
  <div class="min-h-screen bg-base-100">
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
// 初始化主题
const initTheme = () => {
  const savedTheme = localStorage.getItem('theme') || 'light'
  document.documentElement.setAttribute('data-theme', savedTheme)
}

initTheme()
</script>
