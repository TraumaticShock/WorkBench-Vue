<script setup lang="ts">
import { use } from 'echarts/core';
import { storeToRefs } from 'pinia';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart, PieChart, BarChart } from 'echarts/charts';
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent
} from 'echarts/components';
import VChart from 'vue-echarts';
import { useNoteStore } from '@/stores/note';
import { computed } from 'vue';

const noteStore = useNoteStore();
const { state: noteState } = storeToRefs(noteStore);

// 检查数据是否已加载
const hasData = computed(() => {
    return noteState.value.stats.categoryCount && Object.keys(noteState.value.stats.categoryCount).length > 0;
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

// 预定义的主题色数组
const themeColors = [
    '#36D399', // success
    '#3ABFF8', // info
    '#F87272', // error
    '#FBBD23', // warning
    '#6419E6', // primary
    '#1FB2A6', // accent
    '#D926A9', // secondary
];

// 生成HSL颜色的辅助函数
const generateColor = (index: number, total: number): string => {
    // 如果索引在预定义颜色范围内，使用预定义颜色
    if (index < themeColors.length) {
        return themeColors[index];
    }
    
    // 否则生成一个新的HSL颜色
    const hue = (index * (360 / total)) % 360;
    return `hsl(${hue}, 70%, 50%)`;
};

// 颜色映射缓存
const colorCache = new Map<string, string>();

// 动态颜色映射函数
const getColorByCategory = (category: string): string => {
    // 如果颜色已经被缓存，直接返回
    if (colorCache.has(category)) {
        return colorCache.get(category)!;
    }

    // 获取所有分类
    const categories = Object.keys(noteState.value.stats.categoryCount || {});
    const index = categories.indexOf(category);
    const color = generateColor(index, categories.length);
    
    // 缓存颜色
    colorCache.set(category, color);
    
    return color;
};

// 笔记分类统计配置
const notePieChartOption = computed(() => ({
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
            color: '#fff'
        },
        inactiveColor: 'rgba(255, 255, 255, 0.3)',
        itemGap: 12,
        selectedMode: true,
        select: {
            label: {
                color: '#fff'
            }
        }
    },
    series: hasData.value ? [
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
            data: Object.entries(noteState.value.stats.categoryCount).map(([name, count]) => ({
                value: count,
                name,
                itemStyle: { color: getColorByCategory(name) }
            }))
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
                    value: noteState.value.stats.count,
                    name: '总笔记',
                    itemStyle: {
                        color: 'rgba(54, 211, 153, 0.1)'
                    }
                }
            ]
        }
    ] : []
}));
</script>

<template>
    <div class="card bg-base-100 shadow-xl h-[300px] relative overflow-hidden">
        <div class="absolute top-0 left-0 right-0 h-12 bg-gradient-to-r from-neutral to-neutral/70">
            <div class="flex items-center justify-between h-full px-6">
                <h2 class="text-xl font-semibold text-white">笔记分类</h2>
            </div>
        </div>
        <div class="card-body h-full flex flex-col pt-16">
            <v-chart class="chart-container" :option="notePieChartOption" autoresize />
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