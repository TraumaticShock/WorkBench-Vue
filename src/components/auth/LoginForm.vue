<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import type { LoginForm } from '@/types/user'
import { el } from 'element-plus/es/locale'

const router = useRouter()
const userStore = useUserStore()

const form = ref<LoginForm>(
    {
        username: '',
        password: '',
        rememberMe: false
    }
)

const handleSubmit = async () => {
    try {
        await userStore.login(form.value)
        router.push('/')
    } catch (error: any) {
        console.error('登录失败:', error.message)
        ElMessage.error(error.message)
    }
}
</script>

<template>
    <div class="card bg-base-200 text-neutral-content w-96 shadow-xl">
        <div class="card-body items-center text-center">
            <h2 class="card-title text-2xl font-bold mb-6">登录</h2>
            <form @submit.prevent="handleSubmit">
                <label class="input input-bordered flex items-center gap-2 w-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                        class="h-5 w-5 opacity-70">
                        <path
                            d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                        <path
                            d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                    </svg>
                    <input type="text" v-model="form.username" class="grow" placeholder="请输入用户名" />
                </label>
                <label class="input input-bordered flex items-center gap-2 w-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                        class="h-4 w-4 opacity-70">
                        <path fill-rule="evenodd"
                            d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                            clip-rule="evenodd" />
                    </svg>
                    <input type="password" v-model="form.password" class="grow" placeholder="请输入密码" />
                </label>
                <div class="flex justify-between w-full mb-6">
                    <label class="cursor-pointer flex items-center gap-2">
                        <input type="checkbox" v-model="form.rememberMe" class="checkbox checkbox-sm" />
                        <span class="text-sm">记住我</span>
                    </label>
                    <a href="#" class="text-sm hover:underline">忘记密码？</a>
                </div>
                <button type="submit" class="btn btn-primary w-full">登录</button>
            </form>
            <div class="mt-4 text-sm">
                还没有账号？ <router-link to="/auth/signup" class="text-primary hover:underline">立即注册</router-link>
            </div>
        </div>
    </div>
</template>

<style scoped></style>