import { defineStore } from 'pinia';
import type { LoginFormParams, SignUpFormParams, User } from '@/types/user';
import { userApi } from '@/api/user';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  // 只保留一个状态对象
  const state = ref<{
    currentUser: User | null;
    isAuthenticated: boolean;
  }>({
    currentUser: null,
    isAuthenticated: false
  });

  const actions = {
    setUser(userData: User) {
      state.value.currentUser = userData;
      state.value.isAuthenticated = true;
    },

    logout() {
      state.value.currentUser = null;
      state.value.isAuthenticated = false;
    },

    async login(loginForm: LoginFormParams) {
      const response = await userApi.login(loginForm);
      if (response.data.code === 200) {
        actions.setUser(response.data.data);
        return response.data.data;
      }
      throw new Error(response.data.message);
    },

    async signup(signupForm: SignUpFormParams) {
      const response = await userApi.signup(signupForm);
      if (response.data.code === 200) {
        return response.data;
      }
      throw new Error(response.data.message);
    },

    async refreshTokenFn() {
      try {
        const response = await userApi.refreshToken(state.value.currentUser?.refreshToken || '');
        if (response.data.code === 200) {
          actions.setUser(response.data.data);
          return response;
        }
        throw new Error(response.data.message);
      } catch (error) {
        actions.logout();
        throw error;
      }
    }
  };

  return {
    state,
    ...actions
  };
}, {
  persist: {
    key: 'user-storage',
    storage: localStorage,
  }
});
