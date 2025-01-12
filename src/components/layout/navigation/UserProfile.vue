<template>
    <div class="flex items-center gap-2">
        <div class="dropdown dropdown-end">
            <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
                <!-- <div class="w-10 rounded-full">
                    <img alt="User avatar" :src="userStore.userInfo?.avatar" />
                </div> -->
                <div class="w-10 rounded-full">
                    <img alt="User avatar"
                        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                </div>
            </div>
            <ul tabindex="0" class="menu menu-sm dropdown-content bg-base-200 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                <li>
                    <a class="justify-between">
                        <span>个人中心</span>
                    </a>
                </li>
                <li><a>设置</a></li>
                <li><a @click="logout">退出登录</a></li>
            </ul>
        </div>
        <span class="text-base-content">{{ userStore.userInfo?.username }}</span>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

const logout = () => {
    userStore.logout();
    router.push('/auth/login');
};
</script>
