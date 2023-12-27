<script setup>
import { ref, reactive, watch, onMounted } from "vue";
import { chartBarApi } from "@/utils/api";
import * as echarts from "echarts/core";
import { onPullDownRefresh, onShow } from "@dcloudio/uni-app";
import { LineChart, BarChart, PieChart } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import dayjs from "dayjs";
import {
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from "echarts/components";
echarts.use([
  GridComponent,
  LineChart,
  PieChart,
  BarChart,
  CanvasRenderer,
  UniversalTransition,
  TooltipComponent,
  LegendComponent,
]);
const dateRange = ref([
  dayjs().subtract(2, "day").format("YYYY-MM-DD"),
  dayjs().format("YYYY-MM-DD"),
]);
const startDate = ref(dayjs().subtract(12, "month").format("YYYY-MM-DD"));
const endDate = ref(dayjs().format("YYYY-MM-DD"));
const totalMoney = ref(0);
const getData = async () => {
  let res = await chartBarApi({
    startTime: dayjs(dateRange.value[0])
      .startOf("day")
      .format("YYYY-MM-DD HH:mm:ss"),
    endTime: dayjs(dateRange.value[1])
      .endOf("day")
      .format("YYYY-MM-DD HH:mm:ss"),
  });
  console.log(res);
  optionBar.series[0].data = res.bar.values;
  optionBar.xAxis[0].data = res.bar.times;
  totalMoney.value = res.bar.totalMoney;
  optionPie.series[0].data = res.pie;
  optionPie.series[0].top = res.pie.length * 1.8 + "%";
};
onShow(async () => {
  await getData();
});
watch(dateRange, () => {
  getData();
});
const optionBar = reactive({
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    top: "3%",
    containLabel: true,
  },
  xAxis: [
    {
      type: "category",
      data: ["10-01", "10-02", "10-03"],
      axisTick: {
        alignWithLabel: true,
      },
    },
  ],
  yAxis: [
    {
      type: "value",
    },
  ],
  series: [
    {
      name: "营业额",
      type: "line",
      barWidth: "60%",
      data: [0, 1, 2],
      showBackground: true,
      smooth: true,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "#fa2c19" },
          { offset: 0.5, color: "#fa2c19" },
          { offset: 1, color: "#fa6419" },
        ]),
      },
    },
  ],
});
const optionPie = reactive({
  tooltip: {
    trigger: "item",
  },
  legend: {
    top: "2%",
    left: "center",
  },
  series: [
    {
      name: "销售数量",
      type: "pie",
      radius: ["40%", "90%"],
      top: "10%",
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: "#fff",
        borderWidth: 2,
      },
      label: {
        show: false,
        position: "center",
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 20,
          fontWeight: "bold",
        },
      },
      labelLine: {
        show: false,
      },
      data: [
        { value: 1048, name: "Search Engine" },
        { value: 735, name: "Direct" },
        { value: 580, name: "Email" },
        { value: 484, name: "Union Ads" },
        { value: 300, name: "Video Ads" },
      ],
    },
  ],
});
const chartDomBar = ref(null);
const chartDomPie = ref(null);
onMounted(() => {
  chartDomBar.value.init(echarts, (chart) => {
    chart.setOption(optionBar);
  });
  chartDomPie.value.init(echarts, (chart) => {
    chart.setOption(optionPie);
  });
});
watch(optionBar, () => {
  chartDomBar.value.setOption(optionBar);
});
watch(optionPie, () => {
  chartDomPie.value.setOption(optionPie);
});
</script>

<template>
  <div>
    <div class="p-[12px]">
      <uni-datetime-picker
        v-model="dateRange"
        type="daterange"
        :start="startDate"
        :end="endDate"
        rangeSeparator="至"
      />
    </div>
    <view>
      <p class="text-center">
        营业额总计:
        <span class="text-text3 text-16">{{ totalMoney }}</span>
      </p>
      <l-echart
        ref="chartDomBar"
        style="height: 42vh"
        @finished="init"
      ></l-echart
    ></view>
    <view class="mt-[18px]">
      <p class="text-center">销量情况</p>
      <l-echart style="height: 56vh" ref="chartDomPie"></l-echart>
    </view>
  </div>
</template>

<style lang="scss" scoped></style>
