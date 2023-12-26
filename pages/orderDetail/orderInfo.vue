<script setup>
import { orderApi, addRecordsApi } from "@/utils/api";
import { ref } from "vue";
import addRecords from "./addRecords.vue";
const orderId = uni.getStorageSync("orderId");
import { onShow } from "@dcloudio/uni-app";
const orderData = ref({});
const tasteTypes = ["正常辣", "微辣", "特辣"];
onShow(async () => {
  let res = await orderApi({ id: orderId });
  orderData.value = res[0];
  let res2 = await addRecordsApi({
    orderId: orderId || "234wert",
  });
  addData.value = res2;
});
const addData = ref([]);
</script>

<template>
  <view>
    <div
      class="px-[12px] pt-[12px] text-center"
      v-if="!orderData.isFinish && orderData.takeMeal"
    >
      <p>
        订单正在准备中，您的取餐号是:<span
          class="text-text3 text-16 font-bold"
          >{{ orderData.takeMeal }}</span
        >
      </p>
    </div>
    <uni-card>
      <div class="text-12">
        <div class="grid grid-cols-2">
          <span>订单名：{{ orderData.orderName }}</span>
          <span
            >订单状态：<span
              :class="orderData.isFinish ? 'text-text5' : 'text-text3'"
              >{{ orderData.isFinish ? "已完成" : "未完成" }}</span
            ></span
          >
          <span>口味：{{ tasteTypes[orderData.taste - 1] }}</span>
          <span v-if="orderData.desk">桌位：{{ orderData.desk }}</span>
          <span>是否打包：{{ orderData.isPack ? "打包" : "未打包" }}</span>
          <span>是否有加菜：{{ orderData.isAddMenu ? "有" : "无" }}</span>
          <span
            >下单方式：{{
              orderData.userOperation ? "客户自助" : "管理员"
            }}</span
          >
          <span
            >订单金额：<span class="text-text3 text-14">{{
              orderData.totalMoney?.toFixed(2)
            }}</span></span
          >
          <span v-if="orderData.isFinish"
            >实收金额：<span class="text-text3 text-14">{{
              (orderData.actualMoney || orderData.totalMoney).toFixed(2)
            }}</span></span
          >
          <span>商品总数：{{ orderData.totalCount }}</span>
        </div>
        <p>订单ID：{{ orderData.id }}</p>
        <p>创建时间：{{ orderData.showTime }}</p>
        <p class="text-16 text-center my-[12px]">商品明细清单</p>
        <div v-if="orderData.orderDetail?.length">
          <ul>
            <li class="grid grid-cols-4 text-center py-[4px] font-bold">
              <span>名称</span><span>单价</span><span>数量</span
              ><span>小记</span>
            </li>
            <li
              v-for="item in orderData.orderDetail"
              :key="item.id"
              class="grid grid-cols-4 text-center py-[4px]"
              style="border-bottom: 1px solid var(--border_c)"
            >
              <span>{{ item.name }}</span>
              <span>{{ item.price.toFixed(2) }}</span>
              <span>{{ item.count }}</span>
              <span class="text-text3">{{
                (item.price * item.count).toFixed(2)
              }}</span>
            </li>
          </ul>
        </div>
        <abEmpty v-else text="暂无数据" />
        <addRecords
          :recordsList="addData"
          v-if="addData.length > 1"
        ></addRecords>
      </div>
    </uni-card>
  </view>
</template>

<style lang="scss" scoped></style>
