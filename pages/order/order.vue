<script setup>
import dayjs from "dayjs";
import { ref, watchEffect, computed } from "vue";
import { orderApi, orderUpdateApi, orderDeleteApi } from "@/utils/api";
import { onPullDownRefresh } from "@dcloudio/uni-app";
import abMiniButton from "../components/abMiniButton.vue";
import AbEmpty from "../components/abEmpty.vue";
import adBell from "../components/adBell.vue";
const dateRange = ref([
  dayjs().subtract(1, "day").format("YYYY-MM-DD"),
  dayjs().format("YYYY-MM-DD"),
]);
const startDate = ref(dayjs().subtract(12, "month").format("YYYY-MM-DD"));
const endDate = ref(dayjs().format("YYYY-MM-DD"));
const searchValue = ref("");
const searchMoney = ref("");
const orderList = ref([]);
const search = async () => {
  await getList({
    orderName: searchValue.value,
    searchMoney: searchMoney.value,
  });
};
const queryTime = computed(() => {
  return {
    startTime: dayjs(dateRange.value[0])
      .startOf("day")
      .format("YYYY-MM-DD HH:mm:ss"),
    endTime: dayjs(dateRange.value[1])
      .endOf("day")
      .format("YYYY-MM-DD HH:mm:ss"),
  };
});
const getList = async (form) => {
  let res = await orderApi(form);
  orderList.value = res;
};
//获取选择日期订单
watchEffect(async () => {
  if (dateRange.value[0] && dateRange.value[1]) {
    getList(queryTime.value);
  }
});
//计算总金额
const totalMoney = computed(() =>
  orderList.value.reduce((a, b) => a + Number(b.totalMoney), 0).toFixed(2)
);
//处理下拉
onPullDownRefresh(async () => {
  dateRange.value = [
    dayjs().subtract(1, "day").format("YYYY-MM-DD"),
    dayjs().format("YYYY-MM-DD"),
  ];
  try {
    await getList(queryTime.value);
    uni.stopPullDownRefresh();
  } catch (error) {
    uni.stopPullDownRefresh();
  }
});
//设置完成
const setFinish = async (item) => {
  uni.showModal({
    title: "实收金额",
    content: item.totalMoney,
    editable: true,
    placeholderText: "请输入实收金额",
    showCancel: true,
    success: ({ confirm, cancel, content }) => {
      if (confirm) {
        orderUpdateApi({
          id: item.id,
          actualMoney: content || 0,
          isFinish: true,
        })
          .then(() => {
            item.isFinish = true;
            item.actualMoney = content || 0;
            uni.showToast({
              title: "成功",
              icon: "success",
              mask: true,
            });
          })
          .catch(() => {
            uni.showToast({
              title: "失败",
            });
          });
      }
    },
  });
};
//删除
const toDelete = async (item) => {
  uni.showModal({
    title: "提示",
    content: "是否删除",
    success: ({ confirm, cancel }) => {
      if (confirm) {
        orderDeleteApi({ id: item.id }).then((res) => {
          uni.showToast({
            title: "删除成功",
          });
          orderList.value = orderList.value.filter((i) => i.id != item.id);
        });
      }
    },
  });
};
const toDetail = (item) => {
  uni.setStorageSync("orderId", item.id);
  uni.navigateTo({ url: "/pages/orderDetail/orderInfo" });
};
const toEdit = (item) => {
  uni.navigateTo({
    url: "/pages/orderDetail/index?id=" + item.id + "&name=" + item.orderName,
  });
};
</script>

<template>
  <view>
    <div class="p-[20rpx]">
      <view class="example-body">
        <uni-datetime-picker
          v-model="dateRange"
          type="daterange"
          :start="startDate"
          :end="endDate"
          rangeSeparator="至"
        />
      </view>
      <view class="mt-[10px] grid grid-flow-col gap-6">
        <uni-easyinput
          type="number"
          prefixIcon="search"
          v-model="searchMoney"
          placeholder="请输入不低于的金额"
          @blur="search"
        >
        </uni-easyinput>
        <uni-easyinput
          type="text"
          prefixIcon="search"
          v-model="searchValue"
          confirmType="search"
          placeholder="请输入订单关键字"
          @blur="search"
        >
        </uni-easyinput>
      </view>
    </div>
    <view class="grid grid-cols-3 text-14 text-center">
      <span
        >总单数:<span class="text-text3">{{ orderList.length }}</span></span
      >
      <span class=""
        >总金额:<span class="text-text3">{{ totalMoney }}</span></span
      >
      <span class=""
        >未完成订单:<span class="text-text3">{{
          orderList.filter((i) => !i.isFinish).length
        }}</span></span
      >
    </view>
    <view class="grid grid-cols-2 text-14 text-center">
      <span class=""
        >已结算金额:<span class="text-text3">{{
          orderList
            .filter((i) => i.isFinish)
            .reduce((a, b) => a + Number(b.totalMoney), 0)
            .toFixed(2)
        }}</span></span
      >
      <span class=""
        >未结算金额:<span class="text-text3">{{
          orderList
            .filter((i) => !i.isFinish)
            .reduce((a, b) => a + Number(b.totalMoney), 0)
            .toFixed(2)
        }}</span></span
      >
    </view>
    <view>
      <uni-card
        v-for="item in orderList"
        :title="item.orderName"
        :sub-title="item.showTime"
        :extra="`金额：${item.totalMoney}`"
        :key="item.id"
      >
        <adBell v-if="!item.isRead && !item.isFinish"></adBell>
        <uni-tag
          :text="item.isFinish ? '已完成' : '未完成'"
          size="normal"
          :type="item.isFinish ? 'success' : 'error'"
        />
        <uni-tag
          style="margin-left: 4px"
          v-if="item.isPack"
          text="打包"
          size="normal"
          type="primary"
        />
        <uni-tag
          style="margin-left: 4px"
          v-if="item.desk"
          :text="item.desk + '号桌'"
          size="normal"
        />
        <uni-tag
          style="margin-left: 4px"
          v-if="item.userOperation"
          type="primary"
          text="自助下单"
        />
        <uni-tag
          v-if="item.actualMoney && item.isFinish"
          style="margin-left: 4px"
          type="primary"
          :text="'实收:' + item.actualMoney"
        />
        <template v-slot:actions>
          <view
            class="card-actions flex py-[6px] justify-around"
            style="border-top: 1px solid var(--border_c)"
          >
            <abMiniButton plain @click="toDetail(item)">详情</abMiniButton>
            <abMiniButton plain v-if="!item.isFinish" @click="toEdit(item)"
              >修改</abMiniButton
            >
            <abMiniButton
              plain
              type="warn"
              icon="trash"
              iconColor="#fa2c19"
              @click="toDelete(item)"
              >删除</abMiniButton
            >
            <abMiniButton plain v-if="!item.isFinish" @click="setFinish(item)"
              >设为已完成</abMiniButton
            >
          </view>
        </template>
      </uni-card>
      <AbEmpty v-if="orderList.length === 0" text="暂无数据"></AbEmpty>
    </view>
  </view>
</template>

<style lang="scss" scoped></style>
