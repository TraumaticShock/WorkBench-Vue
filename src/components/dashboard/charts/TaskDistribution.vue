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

use([
    CanvasRenderer,
    PieChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent
]);

// 任务分类统计配置
const taskPieChartOption = {
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
        data: ['前端开发', 'API对接', '需求分析', '代码审查', 'Bug修复', '文档编写'],
        axisLabel: {
            fontSize: 10
        }
    },
    series: [
        {
            name: '任务数量',
            type: 'bar',
            data: [15, 12, 8, 6, 10, 5],
            itemStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 1,
                    y2: 0,
                    colorStops: [{
                        offset: 0,
                        color: '#60a5fa' // 浅蓝色起始
                    }, {
                        offset: 1,
                        color: '#3b82f6' // 深蓝色结束
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
};
</script>

<template>
    <div class="card bg-base-200 shadow-xl min-h-[300px]">
        <div class="card-body">
            <h2 class="card-title">任务分类</h2>
            <v-chart class="chart-container" :option="taskPieChartOption" autoresize />
        </div>
    </div>
</template>

<style scoped></style>