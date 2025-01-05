import { defineStore } from 'pinia';
import type { LoginForm, SignUpForm, UserState, User } from '@/types/user';
import { userApi } from '@/api/user';

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    currentUser: null,
    isAuthenticated: false,
  }),

  getters: {
    token: (state) => state.currentUser?.token,
    refreshToken: (state) => state.currentUser?.refreshToken,
    userInfo: (state) => state.currentUser,
  },

  actions: {
    async login(loginForm: LoginForm) {
      const response = await userApi.login(loginForm);
      this.setUser(response.data.data);
      return response.data;
    },

    setUser(user: User) {
      this.currentUser = user;
      this.isAuthenticated = true;
    },

    logout() {
      this.currentUser = null;
      this.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('refreshToken');
    },

    updateUserInfo(userInfo: Partial<User>) {
      if (this.currentUser) {
        this.currentUser = {
          ...this.currentUser,
          ...userInfo,
        };
      }
    },

    async signup(form: SignUpForm) {
      try {
        const { data } = await userApi.register(form);
        return data;
      } catch (error) {
        throw error;
      }
    },
  },

  persist: {
    storage: localStorage,
  },
});
