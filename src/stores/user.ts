import { defineStore } from 'pinia';
import type { LoginForm, User } from '@/types/user';
import { userApi } from '@/api/user';
import { ref, computed } from 'vue';

export const useUserStore = defineStore(
  'user',
  () => {
    const currentUser = ref<User | null>(null);
    const isAuthenticated = ref(false);

    const token = computed(() => currentUser.value?.token);
    const refreshToken = computed(() => currentUser.value?.refreshToken);
    const userInfo = computed(() => currentUser.value);

    async function login(loginForm: LoginForm) {
      const response = await userApi.login(loginForm);
      if (response.data.code === 200) {
        setUser(response.data.data);
        return response.data;
      } else {
        throw new Error(response.data.message);
      }
    }

    function setUser(user: User) {
      currentUser.value = user;
      isAuthenticated.value = true;
    }

    function logout() {
      currentUser.value = null;
      isAuthenticated.value = false;
    }

    async function refreshTokenFn() {
      try {
        const response = await userApi.refreshToken(refreshToken.value || '');
        if (response.data.code === 200) {
          setUser(response.data.data);
          return response;
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        logout();
        throw error;
      }
    }

    return {
      currentUser,
      isAuthenticated,
      token,
      refreshToken,
      userInfo,
      login,
      setUser,
      logout,
      refreshTokenFn,
    };
  },
  {
    persist: true,
  }
);
