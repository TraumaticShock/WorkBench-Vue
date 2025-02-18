<template>
    <div class="flex items-center gap-2">
        <div class="divider divider-horizontal"></div>
        <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 stroke-current" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span class="ml-1">{{ currentDate }}</span>
        </div>
        <div class="divider divider-horizontal"></div>
        <div class="flex items-center">
            <template v-if="weather">
                <svg v-if="isSunny" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 stroke-current" fill="none"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <svg v-else-if="isCloudy" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 stroke-current" fill="none"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
                <svg v-else-if="isRainy" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 stroke-current" fill="none"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M20 16.2A4.5 4.5 0 0017.5 8h-1.8A7 7 0 104 14.9V17a3 3 0 106 0v-1m6 1a3 3 0 106 0v-1" />
                </svg>
                <svg v-else-if="isSnowy" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 stroke-current" fill="none"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 3v18m4-13l-4-4-4 4m8 14l-4-4-4 4m12-7H2m17-4l-5 4 5 4M5 10l5 4-5 4" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 stroke-current" fill="none"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
            </template>
            <span v-if="weather" class="ml-1">{{ weather.text }}</span>
            <span v-else class="ml-1 loading loading-spinner loading-xs"></span>
        </div>
        <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 stroke-current" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span v-if="weather" class="ml-1">{{ weather.temp }}°C</span>
            <span v-else class="ml-1 loading loading-spinner loading-xs"></span>
        </div>
        <div class="divider divider-horizontal"></div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { getLocation } from '@/utils/location'

const currentDate = ref(new Date().toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric',
    weekday: 'long'
}))

interface WeatherResponse {
    status: string;
    info: string;
    infocode: string;
    count: string;
    lives: Array<{
        province: string;
        city: string;
        adcode: string;
        weather: string;
        temperature: string;
        winddirection: string;
        windpower: string;
        humidity: string;
        reporttime: string;
    }>;
}

interface WeatherInfo {
    text: string;
    temp: number;
}

const weather = ref<WeatherInfo | null>(null)

// 获取天气信息
const getWeather = async (adcode: string) => {
    try {
        const response = await axios.get<WeatherResponse>('https://restapi.amap.com/v3/weather/weatherInfo', {
            params: {
                key: 'ef26c023c447aa07786bf9f32db40fd5',
                city: adcode,
                extensions: 'base'
            }
        });
        if (response.data.status === '1' && response.data.lives?.length > 0) {
            const live = response.data.lives[0];
            weather.value = {
                text: live.weather,
                temp: parseInt(live.temperature)
            };
        } else {
            console.error('获取天气信息失败:', response.data.info);
            throw new Error(`获取天气信息失败: ${response.data.info}`);
        }
    } catch (error) {
        console.error('获取天气信息失败:', error);
        weather.value = {
            text: '获取失败',
            temp: 0
        };
    }
};

// 修改初始化函数
const initWeather = async () => {
    try {
        const location = await getLocation();
        // 使用城市编码获取天气
        await getWeather(location.adcode);
    } catch (error) {
        console.error('获取位置或天气信息失败:', error);
        weather.value = {
            text: '获取失败',
            temp: 0
        };
    }
};

onMounted(() => {
    initWeather();
});

// 添加天气状态判断
const isSunny = computed(() => {
    const text = weather.value?.text;
    return text?.includes('晴') || text?.includes('日');
});

const isCloudy = computed(() => {
    const text = weather.value?.text;
    return text?.includes('云') || text?.includes('阴');
});

const isRainy = computed(() => {
    const text = weather.value?.text;
    return text?.includes('雨') || text?.includes('阵雨') || text?.includes('雷');
});

const isSnowy = computed(() => {
    const text = weather.value?.text;
    return text?.includes('雪') || text?.includes('霜');
});
</script>