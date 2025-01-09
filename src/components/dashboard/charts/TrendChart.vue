<script setup>
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart, PieChart, BarChart } from 'echarts/charts';
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent
} from 'echarts/components';
import VChart from 'vue-echarts';
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useTodoStore } from '@/stores/todo'

const todoStore = useTodoStore();

const { weekCompleteCount } = storeToRefs(todoStore);

onMounted(async () => {
    await todoStore.getWeekCompleteCount();
});

use([
    CanvasRenderer,
    LineChart,
    PieChart,
    BarChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent
]);

// 任务完成趋势配置
const lineChartOption = {
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
            data: [5, 7, 4, 9, 6, 3, 8],
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
};
</script>

<template>
    <div class="card bg-base-200 shadow-xl min-h-[300px]">
        <div class="card-body">
            <h2 class="card-title">任务完成趋势</h2>
            <v-chart class="chart-container" :option="lineChartOption" autoresize />
        </div>
    </div>
</template>

<style scoped></style>