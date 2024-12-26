import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/views/dashboard/index.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/auth/Login.vue'),
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: () => import('@/views/auth/SignUp.vue'),
    },
  ],
});

// router.beforeEach((to, from, next) => {
//   const isAuthenticated = localStorage.getItem('token');
//   if (to.meta.requiresAuth && !isAuthenticated) {
//     next('/login');
//   } else {
//     next();
//   }
// });

export default router;
