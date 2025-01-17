<template>
    <div class="min-h-screen flex">
        <LeftNavigation />
        <div class="flex-1 flex flex-col">
            <TopNavigation />
            <main class="flex-1 p-6 mt-16 ml-24">
                <router-view></router-view>
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import LeftNavigation from '@/components/layout/LeftNavigation.vue'
</script>