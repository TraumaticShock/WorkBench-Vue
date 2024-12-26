<template>
    <div class="card bg-base-200 shadow-xl h-[300px]">
        <div class="card-body">
            <h2 class="card-title text-sm">工作时长趋势</h2>
            <v-chart class="chart-container" :option="chartOption" autoresize />
        </div>
    </div>
</template>

<script setup>
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

use([
    CanvasRenderer,
    LineChart,
    BarChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent
]);

const mockData = {
    dates: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    hours: [6.5, 7.2, 8.1, 6.8, 7.5, 4.2, 3.5],
    target: [8, 8, 8, 8, 8, 8, 8]
}

const chartOption = {
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
        data: mockData.dates,
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
            data: mockData.hours,
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
            data: mockData.target,
            lineStyle: {
                color: '#f87272',
                type: 'dashed',
                width: 2
            }
        }
    ]
};
</script>

<style scoped></style>