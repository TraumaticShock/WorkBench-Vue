<script setup>
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import {
    TitleComponent,
    TooltipComponent,
    GridComponent
} from 'echarts/components';
import VChart from 'vue-echarts';
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useTodoStore } from '@/stores/todo'

use([
    CanvasRenderer,
    LineChart,
    TitleComponent,
    TooltipComponent,
    GridComponent
]);

const todoStore = useTodoStore();
const { stats } = storeToRefs(todoStore);
const isLoading = ref(true);

const lineChartOption = computed(() => ({
    tooltip: {
        trigger: 'axis'
    },
    grid: {
        top: '10%',
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
        axisLabel: {
            fontSize: 10
        }
    },
    series: [
        {
            name: '已完成',
            type: 'line',
            smooth: true,
            data: stats.weekComplete?.count || [],
            itemStyle: {
                color: '#36d399'
            },
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0,
                        color: 'rgba(54, 211, 153, 0.2)'
                    }, {
                        offset: 1,
                        color: 'rgba(54, 211, 153, 0)'
                    }]
                }
            }
        }
    ]
}));
</script>

<template>
    <div class="card bg-base-200 shadow-xl h-[300px]">
        <div class="card-body h-full flex flex-col">
            <h2 class="card-title">待办完成趋势</h2>
            <div v-if="isLoading" class="flex items-center justify-center">
                <span class="loading loading-spinner loading-lg"></span>
            </div>
            <v-chart v-else class="chart-container" :option="lineChartOption" autoresize />
        </div>
    </div>
</template>

<style scoped>
.chart-container {
    height: 250px;
}
</style>