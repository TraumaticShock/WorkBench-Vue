<script setup>
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart } from 'echarts/charts';
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent
} from 'echarts/components';
import VChart from 'vue-echarts';
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useTodoStore } from '@/stores/todo';

const todoStore = useTodoStore();
const { state } = storeToRefs(todoStore);

// 使用 computed 处理图表配置
const taskPieChartOption = computed(() => ({
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    grid: {
        left: '3%',
        right: '10%',
        bottom: '3%',
        top: '6%',
        containLabel: true
    },
    xAxis: {
        type: 'value',
        axisLabel: {
            fontSize: 10
        }
    },
    yAxis: {
        type: 'category',
        data: state.value.stats.categoryCount.categories || [],
        axisLabel: {
            fontSize: 10
        }
    },
    series: [
        {
            name: '待办数量',
            type: 'bar',
            data: state.value.stats.categoryCount.counts || [],
            itemStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 1,
                    y2: 0,
                    colorStops: [{
                        offset: 0,
                        color: '#60a5fa'
                    }, {
                        offset: 1,
                        color: '#3b82f6'
                    }]
                },
                borderRadius: [0, 4, 4, 0]
            },
            label: {
                show: true,
                position: 'right',
                fontSize: 10
            }
        }
    ]
}));

use([
    CanvasRenderer,
    BarChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent
]);
</script>

<template>
    <div class="card bg-base-100 shadow-xl h-[300px] relative overflow-hidden">
        <div class="absolute top-0 left-0 right-0 h-12 bg-gradient-to-r from-neutral to-neutral/70">
            <div class="flex items-center justify-between h-full px-6">
                <h2 class="text-xl font-semibold text-white">待办分类</h2>
            </div>
        </div>
        <div class="card-body h-full flex flex-col pt-16">
            <v-chart class="chart-container flex-1" :option="taskPieChartOption" autoresize />
        </div>
    </div>
</template>

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