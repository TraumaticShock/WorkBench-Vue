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
      setUser(response.data.data);
      return response.data;
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
        setUser(response.data.data);
        return response;
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
