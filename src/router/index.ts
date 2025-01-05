import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/user';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/default.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: () => import('@/views/dashboard/index.vue'),
        },
      ],
    },
    {
      path: '/auth',
      component: () => import('@/layouts/auth.vue'),
      meta: { guest: true },
      children: [
        {
          path: 'login',
          name: 'Login',
          component: () => import('@/views/auth/Login.vue'),
        },
        {
          path: 'signup',
          name: 'SignUp',
          component: () => import('@/views/auth/SignUp.vue'),
        },
      ],
    },
  ],
});

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !userStore.isAuthenticated
  ) {
    next('/auth/login');
  } else if (
    to.matched.some((record) => record.meta.guest) &&
    userStore.isAuthenticated
  ) {
    next('/');
  } else {
    next();
  }
});

export default router;
