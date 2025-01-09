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
    LineChart,
    PieChart,
    BarChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent
]);

// 笔记分类统计配置
const notePieChartOption = {
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
        orient: 'horizontal',
        bottom: '0%',
        itemWidth: 15,
        itemHeight: 15,
        textStyle: {
            fontSize: 12,
            padding: [0, 4],
            color: '#fff'  // 默认颜色为白色
        },
        inactiveColor: 'rgba(255, 255, 255, 0.3)',  // 未选中时的颜色
        itemGap: 12,
        selectedMode: true,  // 启用选择模式
        select: {
            label: {
                color: '#fff'  // 选中时的文字颜色
            }
        }
    },
    series: [
        {
            name: '笔记分类',
            type: 'pie',
            radius: ['45%', '75%'],
            center: ['50%', '40%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderColor: '#fff',
                borderWidth: 0,
                borderRadius: 4
            },
            label: {
                show: true,
                position: 'inside',
                formatter: '{d}%',
                fontSize: 10,
                color: '#fff'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 12,
                    fontWeight: 'bold'
                },
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
            data: [
                {
                    value: 15,
                    name: '技术笔记',
                    itemStyle: { color: '#36D399' }  // success color
                },
                {
                    value: 8,
                    name: '工作总结',
                    itemStyle: { color: '#3ABFF8' }  // info color
                },
                {
                    value: 5,
                    name: '学习计划',
                    itemStyle: { color: '#F87272' }  // error color
                },
                {
                    value: 3,
                    name: '会议记录',
                    itemStyle: { color: '#FBBD23' }  // warning color
                }
            ]
        },
        {
            name: '笔记分类',
            type: 'pie',
            radius: ['0%', '30%'],
            center: ['50%', '40%'],
            label: {
                show: true,
                position: 'center',
                formatter: '{total|{c}}\n{name|总笔记}',
                rich: {
                    total: {
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: '#36D399'
                    },
                    name: {
                        fontSize: 12,
                        color: '#666'
                    }
                }
            },
            data: [
                {
                    value: 31,
                    name: '总笔记',
                    itemStyle: {
                        color: 'rgba(54, 211, 153, 0.1)'
                    }
                }
            ]
        }
    ]
};
</script>

<template>
    <div class="card bg-base-200 shadow-xl h-[300px]">
        <div class="card-body">
            <h2 class="card-title">笔记分类</h2>
            <v-chart class="chart-container" :option="notePieChartOption" autoresize />
        </div>
    </div>
</template>

<style scoped></style>