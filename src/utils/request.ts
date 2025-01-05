import axios from 'axios';
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';

const isRefreshing = ref(false);
const requests = ref<Function[]>([]);

const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000,
});

const handleRequest = (config: any) => {
  const userStore = useUserStore();
  if (userStore.token) {
    config.headers.Authorization = `Bearer ${userStore.token}`;
  }
  return config;
};

const handleResponse = async (error: any) => {
  const { config, response } = error;
  const userStore = useUserStore();

  if (response?.status === 403) {
    if (!isRefreshing.value) {
      isRefreshing.value = true;

      try {
        const { data } = await userStore.refreshTokenFn();
        userStore.setUser(data.data);

        requests.value.forEach((cb) => cb());
        requests.value = [];

        return request(config);
      } catch (err) {
        userStore.logout();
        window.location.href = '/auth/login';
        return Promise.reject(err);
      } finally {
        isRefreshing.value = false;
      }
    } else {
      return new Promise((resolve) => {
        requests.value.push(() => {
          resolve(request(config));
        });
      });
    }
  }
  return Promise.reject(error);
};

request.interceptors.request.use(handleRequest, (error) =>
  Promise.reject(error)
);
request.interceptors.response.use((response) => response, handleResponse);

export default request;
