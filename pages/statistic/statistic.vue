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
  optionBar.value = {
    categories: res.bar.times,
    yAxis: [
      {
        type: "value",
      },
    ],
    series: [
      {
        name: "营业额",
        type: "line",
        data: res.bar.values,
        color: "#fa2c19",
      },
    ],
  };
  totalMoney.value = res.bar.totalMoney;
  optionPie.value = {
    series: [
      {
        name: "销售数量",
        type: "pie",
        radius: ["40%", "90%"],
        top: "10%",
        avoidLabelOverlap: false,
        data: res.pie,
      },
    ],
  };
};
onShow(async () => {
  await getData();
});
watch(dateRange, () => {
  getData();
});
const optionBar = ref({});
const optionPie = ref({});
const chartDomBar = ref(null);
const chartDomPie = ref(null);
onMounted(() => {
  getData();
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
      <qiun-data-charts
        :opts="{
          dataLabel: false,
          extra: {
            line: {
              type: 'curve',
            },
          },
          legend: {
            show: false,
          },
        }"
        type="line"
        :chartData="optionBar"
        ref="chartDomBar"
        style="height: 42vh"
      ></qiun-data-charts
    ></view>
    <view class="mt-[18px]">
      <p class="text-center">销量情况</p>
      <qiun-data-charts
        style="height: 56vh"
        type="pie"
        :chartData="optionPie"
        ref="chartDomPie"
      ></qiun-data-charts>
    </view>
  </div>
</template>

<style lang="scss" scoped></style>
