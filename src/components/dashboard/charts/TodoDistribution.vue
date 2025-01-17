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
    <div class="card bg-base-200 shadow-xl h-[300px]">
        <div class="card-body h-full flex flex-col">
            <h2 class="card-title">待办分类</h2>
            <v-chart class="chart-container flex-1" :option="taskPieChartOption" autoresize />
        </div>
    </div>
</template>

<style scoped></style>