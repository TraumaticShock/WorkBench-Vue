<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import type { SignUpForm } from '@/types/user'
import { useSignUpValidation } from '@/composables/useSignUpValidation'

const router = useRouter()
const userStore = useUserStore()
const { validationStatus, validateUsername, validatePassword, validateConfirmPassword, validateEmail } = useSignUpValidation()

const form = ref<SignUpForm>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
})

const handleSubmit = async () => {
    try {
        if (!validationStatus.password.isValid || !validationStatus.confirmPassword.isValid) {
            return
        }
        await userStore.signup(form.value)
        router.push('/login')
    } catch (error: any) {
        console.error('注册失败:', error.message)
    }
}
</script>

<template>
    <div class="card bg-base-200 text-neutral-content w-96 shadow-xl">
        <div class="card-body items-center text-center">
            <h2 class="card-title text-2xl font-bold mb-6">注册账号</h2>
            <form @submit.prevent="handleSubmit">
                <div class="relative">
                    <label class="input input-bordered flex items-center gap-2 w-full mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                            class="h-5 w-5 opacity-70">
                            <path
                                d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                        </svg>
                        <input type="text" v-model="form.username" @blur="validateUsername(form.username)" class="grow"
                            placeholder="请输入用户名" />
                        <!-- 状态图标 -->
                        <div v-if="form.username" class="flex items-center">
                            <!-- 检查中 -->
                            <span v-if="validationStatus.username.checking"
                                class="loading loading-spinner loading-sm"></span>
                            <!-- 检查成功 -->
                            <svg v-else-if="validationStatus.username.isValid" xmlns="http://www.w3.org/2000/svg"
                                class="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M5 13l4 4L19 7" />
                            </svg>
                            <!-- 检查失败 -->
                            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-error" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    </label>
                    <!-- 用户名提示信息 -->
                    <div v-if="validationStatus.username.message && !validationStatus.username.isValid"
                        class="text-xs text-left ml-2 mb-4 text-error">
                        {{ validationStatus.username.message }}
                    </div>
                </div>
                <label class="input input-bordered flex items-center gap-2 w-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                        class="h-5 w-5 opacity-70">
                        <path
                            d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                        <path
                            d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                    </svg>
                    <input type="email" v-model="form.email" @blur="validateEmail(form.email)" class="grow"
                        placeholder="请输入邮箱" />
                    <!-- 状态图标 -->
                    <div v-if="form.email" class="flex items-center">
                        <span v-if="validationStatus.email.checking" class="loading loading-spinner loading-sm"></span>
                        <svg v-else-if="validationStatus.email.isValid" xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-error" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                </label>
                <!-- 邮箱提示信息 -->
                <div v-if="validationStatus.email.message && !validationStatus.email.isValid"
                    class="text-xs text-left ml-2 mb-4 text-error">
                    {{ validationStatus.email.message }}
                </div>
                <label class="input input-bordered flex items-center gap-2 w-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                        class="h-4 w-4 opacity-70">
                        <path fill-rule="evenodd"
                            d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                            clip-rule="evenodd" />
                    </svg>
                    <input type="password" v-model="form.password" @blur="validatePassword(form.password)" class="grow"
                        placeholder="请输入密码" />
                    <!-- 密码状态图标 -->
                    <div v-if="form.password" class="flex items-center">
                        <svg v-if="validationStatus.password.isValid" xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-error" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                </label>
                <!-- 密码提示信息 -->
                <div v-if="validationStatus.password.message" class="text-xs text-left ml-2 mb-4 text-error">
                    {{ validationStatus.password.message }}
                </div>

                <label class="input input-bordered flex items-center gap-2 w-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                        class="h-4 w-4 opacity-70">
                        <path fill-rule="evenodd"
                            d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                            clip-rule="evenodd" />
                    </svg>
                    <input type="password" v-model="form.confirmPassword"
                        @blur="validateConfirmPassword(form.password, form.confirmPassword)" class="grow"
                        placeholder="请确认密码" />
                    <!-- 确认密码状态图标 -->
                    <div v-if="form.confirmPassword" class="flex items-center">
                        <svg v-if="validationStatus.confirmPassword.isValid" xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-error" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                </label>
                <!-- 确认密码提示信息 -->
                <div v-if="validationStatus.confirmPassword.message" class="text-xs text-left ml-2 mb-4 text-error">
                    {{ validationStatus.confirmPassword.message }}
                </div>

                <button type="submit" class="btn btn-primary w-full">注册</button>
            </form>
            <div class="mt-4 text-sm">
                已有账号？ <router-link to="/login" class="text-primary hover:underline">立即登录</router-link>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
