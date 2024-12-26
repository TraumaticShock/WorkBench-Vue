<template>
  <div class="flex">
    <LeftNavigation v-if="showNav" />
    <div class="flex-1 flex flex-col ml-24">
      <TopNavigation v-if="showNav" />
      <div class="flex-1 p-6 pt-16 pb-0">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const showNav = computed(() => !['Login', 'SignUp'].includes(route.name as string))
</script>

<style scoped></style>
