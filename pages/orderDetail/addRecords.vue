<script setup>
const props = defineProps(["recordsList", "showBtn"]);
import { getToken } from "@/utils/auth";
import abMiniButton from "../components/abMiniButton.vue";
import { updateRecordsApi } from "@/utils/api";
import dayjs from "dayjs";
const itemToatl = (item) => {
  return item.reduce((pre, cur) => {
    return pre + cur.count * cur.price;
  }, 0);
};
const updateRecords = async (item) => {
  await updateRecordsApi({ id: item.id, isFinish: true });
  item.isFinish = true;
  uni.showToast({
    icon: "success",
    mask: true,
  });
};
</script>

<template>
  <div>
    <p class="text-16 text-center my-[10px]">加菜记录</p>
    <div
      v-for="(item, index) in recordsList"
      :key="index"
      class="text-center text-14 px-[8px] border mb-[10px]"
    >
      <p v-if="index == 0">
        初始订单 :
        <span class="text-text3">{{ itemToatl(item.items).toFixed(2) }}</span>
      </p>
      <p v-else class="flex justify-around items-center py-[4px]">
        <span class="text-14"
          >状态：<span :class="item.isFinish ? 'text-text5' : 'text-text3'">{{
            item.isFinish ? "已上菜" : "准备中"
          }}</span></span
        >
        <span
          >第{{ index }}次加菜 :<span class="text-text3">
            {{ itemToatl(item.items).toFixed(2) }}</span
          >
        </span>
        <span>
          <abMiniButton
            v-if="!item.isFinish && getToken()"
            @click="updateRecords(item)"
            >设置已上菜</abMiniButton
          >
        </span>
      </p>
      <div class="mb-[6px] text-[12px] text-gray-500">
        <span
          >下单时间 :
          <span>{{
            dayjs(item.createTime).format("YYYY-MM-DD HH:mm:ss")
          }}</span></span
        >
        <!-- <span>完成时间 : {{ item.createTime }}</span> -->
      </div>
      <ul>
        <li class="flex text-center text-[12px]">
          <span class="flex-1">菜名</span>
          <span class="flex-1">单价</span>
          <span class="flex-[0.5]"></span>
          <span class="flex-1"> 数量</span>
          <span class="flex-[0.5]"></span>
          <span class="flex-1"> 小记 </span>
        </li>
        <li
          v-for="rItem in item.items"
          :key="rItem.type"
          class="flex text-center text-[12px]"
        >
          <span class="flex-1">{{ rItem.name }}</span>
          <span class="flex-1">{{ rItem.price }}</span>
          <span class="flex-[0.5]">*</span>
          <span class="flex-1">{{ rItem.count }}</span>
          <span class="flex-[0.5]">=</span>
          <span class="flex-1 text-text3"
            >{{ (rItem.price * rItem.count).toFixed(2) }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
