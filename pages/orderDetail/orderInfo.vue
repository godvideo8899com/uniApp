<script setup>
import { orderApi, addRecordsApi, qrCodeApi } from "@/utils/api";
import { getToken } from "@/utils/auth";
import { ref, onMounted } from "vue";
import addRecords from "./addRecords.vue";
let orderId = uni.getStorageSync("orderId");
import { onLoad } from "@dcloudio/uni-app";
import abButton from "../components/abButton.vue";
const orderData = ref({});
const tasteTypes = ["正常辣", "微辣", "特辣"];
onLoad(async (options) => {
  if (options.id) {
    orderId = options.id;
  }
  let res = await orderApi({ id: orderId });
  orderData.value = res[0];
  let res2 = await addRecordsApi({
    orderId: orderId || "dfs2345",
  });
  addData.value = res2;
});
const codeUrl = ref("");
const addData = ref([]);
onMounted(() => {
  if (!getToken()) {
    try {
      document.getElementsByClassName("uni-page-head-btn")[0].style.display =
        "none";
    } catch (error) {}
  }
});
const generateQRCode = (text) => {
  const typeNumber = 0; // 自动检测最佳版本
  const errorCorrectionLevel = "L"; // 容错级别：L、M、Q、H
  const qr = QRCode(typeNumber, errorCorrectionLevel);
  qr.addData(text);
  qr.make();

  // 将二维码转为 Data URL
  const qrDataUrl = qr.createDataURL(10, 0);
  return qrDataUrl;
};
const popup2 = ref(null);
const createCode = async () => {
  if (codeUrl.value) {
    return popup2.value.open();
  }
  let res = await qrCodeApi({ orderId: orderId });
  console.log(res);
  codeUrl.value = res;
  popup2.value.open();
};
const downloadImage = () => {
  console.log(codeUrl.value);
  uni.saveImageToPhotosAlbum({
    filePath: codeUrl.value,
    success: (result) => {
      uni.showToast({
        title: "保存成功",
        icon: "success",
        mask: true,
      });
      popup2.value.close();
    },
    fail: (error) => {
      console.log(error);
      uni.showModal({
        title: "失败",
        content: error.errMsg,
        showCancel: true,
        success: ({ confirm, cancel }) => {},
      });
      popup2.value.close();
    },
  });
};
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
    <div class="p-[12px] px-[16px]" v-if="getToken()">
      <abButton icon="link" @click="createCode"
        >为此订单生成网址二维码</abButton
      >
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
    <uni-popup ref="popup2" type="dialog">
      <uni-popup-dialog
        title="订单二维码"
        confirmText="保存二维码"
        :duration="2000"
        :before-close="true"
        @close="popup2.close()"
        @confirm="downloadImage"
      >
        <div class="flex justify-center w-full">
          <image :src="codeUrl" class="w-full" />
        </div>
      </uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<style lang="scss" scoped></style>
