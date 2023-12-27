<script setup>
import { ref } from "vue";
import { userInfoApi } from "@/utils/api";
import { onPullDownRefresh, onLoad } from "@dcloudio/uni-app";
import AbButton from "../components/abButton.vue";
const infoData = ref({});
onLoad(async () => {
  let res = await userInfoApi();
  infoData.value = res;
});
onPullDownRefresh(async () => {
  let res = await userInfoApi();
  infoData.value = res;
  uni.stopPullDownRefresh();
});
const logout = () => {
  uni.removeStorageSync("token");
  uni.reLaunch({ url: "/pages/login/login" });
};
</script>

<template>
  <view class="p-[16px]">
    <div class="flex items-center shadow-md p-[6px] bg-bg1 rounded-md">
      <img src="@/static/user.png" class="w-[50px] h-[50px]" />
      <view class="ml-[12px]">
        <p>
          账号：<span class="text-text3">{{ infoData.userName }}</span>
        </p>
        <p>
          真实姓名：<span class="text-text3">{{ infoData.realName }}</span>
        </p>
      </view>
    </div>
    <!-- <ul class="mt-[12px]">
      <li class="flex items-center shadow-md p-[12px] bg-bg1 rounded-md">
        <image src="@/static/transaction-order.svg" class="w-[20px] h-[20px]" />
        <span class="ml-[2px]"> 平台总订单数量 </span>
        <span class="ml-auto text-text3 text-16 font-bold">
          {{ infoData.orderCount }}
        </span>
      </li>
      <li
        class="flex items-center shadow-md p-[12px] bg-bg1 rounded-md mt-[12px]"
      >
        <image src="@/static/money-alt.svg" class="w-[20px] h-[20px]" />
        <span class="ml-[2px]"> 平台订单总金额 </span>
        <span class="ml-auto text-text3 text-16 font-bold">
          {{ infoData.totalMoney }}
        </span>
      </li>
      <li
        class="flex items-center shadow-md p-[12px] bg-bg1 rounded-md mt-[12px]"
      >
        <image src="@/static/money-stack.svg" class="w-[20px] h-[20px]" />
        <span class="ml-[2px]"> 平台订单总优惠 </span>
        <span class="ml-auto text-text3 text-16 font-bold">
          {{ infoData.discountedMoney }}
        </span>
      </li>
    </ul> -->
    <ul class="mt-[12px]">
      <li class="flex items-center shadow-md p-[12px] bg-bg1 rounded-md">
        <image src="@/static/order-light.svg" class="w-[20px] h-[20px]" />
        <span class="ml-[2px]"> 我添加的订单数量 </span>
        <span class="ml-auto text-text3 text-16 font-bold">
          {{ infoData.orderCount }}
        </span>
      </li>
      <li
        class="flex items-center shadow-md p-[12px] bg-bg1 rounded-md mt-[12px]"
      >
        <image src="@/static/money-bag-outline.svg" class="w-[20px] h-[20px]" />
        <span class="ml-[2px]"> 我的订单总金额 </span>
        <span class="ml-auto text-text3 text-16 font-bold">
          {{ infoData.totalMoney }}
        </span>
      </li>
      <li
        class="flex items-center shadow-md p-[12px] bg-bg1 rounded-md mt-[12px]"
      >
        <image
          src="@/static/hand-money-outline.svg"
          class="w-[20px] h-[20px]"
        />
        <span class="ml-[2px]"> 我的订单总优惠 </span>
        <span class="ml-auto text-text3 text-16 font-bold">
          {{ infoData.discountedMoney }}
        </span>
      </li>
    </ul>
    <div class="mt-[60px]">
      <AbButton type="default" icon="undo" iconColor="#000" @click="logout"
        >退出登录</AbButton
      >
    </div>
  </view>
</template>

<style lang="scss" scoped></style>
