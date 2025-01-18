<template>
    <div class="card bg-base-100 shadow-xl h-[300px] relative overflow-hidden">
        <div class="absolute top-0 left-0 right-0 h-12 bg-gradient-to-r from-neutral to-neutral/70">
            <div class="flex items-center justify-between h-full px-6">
                <h2 class="text-xl font-semibold text-white">工作时长趋势</h2>
            </div>
        </div>
        <div class="card-body h-full flex flex-col pt-16">
            <v-chart class="chart-container" :option="chartOption" autoresize />
        </div>
    </div>
</template>

<script setup lang="ts">
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart, BarChart } from 'echarts/charts';
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent
} from 'echarts/components';
import VChart from 'vue-echarts';
import { useWorkDurationStore } from '@/stores/workDuration';
import { ref, onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia';

// 初始化 store
const workDurationStore = useWorkDurationStore();
// 使用 storeToRefs 来保持响应性
const { workDurationWeek } = storeToRefs(workDurationStore);

onMounted(async () => {
    await workDurationStore.getWorkDurationWeek();
});

use([
    CanvasRenderer,
    LineChart,
    BarChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent
]);

// 使用 computed 来动态更新图表数据
const chartOption = computed(() => ({
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    legend: {
        data: ['工作时长', '目标时长'],
        textStyle: {
            fontSize: 12
        }
    },
    grid: {
        top: '15%',
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        axisLabel: {
            fontSize: 10
        }
    },
    yAxis: {
        type: 'value',
        name: '小时',
        nameTextStyle: {
            fontSize: 10
        },
        axisLabel: {
            fontSize: 10
        }
    },
    series: [
        {
            name: '工作时长',
            type: 'bar',
            data: workDurationWeek.value.map((item: any) => item.duration) || [],  // 使用 store 中的数据
            itemStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                        { offset: 0, color: '#36d399' },
                        { offset: 1, color: '#36d399aa' }
                    ]
                },
                borderRadius: [4, 4, 0, 0]
            }
        },
        {
            name: '目标时长',
            type: 'line',
            data: [8, 8, 8, 8, 8, 8, 8],
            lineStyle: {
                color: '#f87272',
                type: 'dashed',
                width: 2
            }
        }
    ]
}));
</script>

<style scoped>
.card {
    border-radius: 1rem;
}

:deep(.echarts) {
    border-radius: 0.5rem;
}

/* 自定义滚动条样式 */
::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

::-webkit-scrollbar-track {
    background: transparent;
}

::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
    background: #ccc;
}
</style>