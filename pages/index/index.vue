<script setup>
import dayjs from "dayjs";
import { ref, reactive } from "vue";
import { onPullDownRefresh, onShow, onLoad } from "@dcloudio/uni-app";
import { useRequest } from "vue-hooks-plus";
import adBell from "../components/adBell.vue";
import {
  orderApi,
  orderUpdateApi,
  orderAddApi,
  setFinishApi,
  addQrCodeApi,
} from "@/utils/api";
import AbEmpty from "../components/abEmpty.vue";
import AbButton from "../components/abButton.vue";
import AbRadio from "../components/abRadio.vue";
import { getToken } from "@/utils/auth";
import { authTokenApi } from "@/utils/api";
let token = getToken();
uni.$on("setAdd", function (data) {
  let deskIndex = todayOrder.value.findIndex((item) => {
    return item.desk == data.desk;
  });
  todayOrder.value[deskIndex].undoneRecord = true;
});
onLoad(() => {
  if (!token) {
    uni.redirectTo({ url: "/pages/login/login" });
  } else {
    authTokenApi({ token: token })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        uni.redirectTo({ url: "/pages/login/login" });
      });
  }
});
const queryTime = reactive({
  startTime: "",
  endTime: "",
});
const formatDate = (date) => {
  const currentHours = dayjs().hour();
  if (currentHours < 12) {
    (queryTime.startTime = dayjs()
      .startOf("day")
      .subtract(12, "hour")
      .format("YYYY-MM-DD HH:mm:ss")),
      (queryTime.endTime = dayjs()
        .endOf("day")
        .subtract(12, "hour")
        .format("YYYY-MM-DD HH:mm:ss"));
  } else {
    (queryTime.startTime = dayjs()
      .startOf("day")
      .add(12, "hour")
      .format("YYYY-MM-DD HH:mm:ss")),
      (queryTime.endTime = dayjs()
        .endOf("day")
        .add(12, "hour")
        .format("YYYY-MM-DD HH:mm:ss"));
  }
};
formatDate();
const { data: todayOrder, run: orderListRun } = useRequest(orderApi, {
  defaultParams: [queryTime],
  refreshOnWindowFocus: true,
  cacheKey: "cacheKey-todayOrder",
});

onPullDownRefresh(async () => {
  formatDate();
  orderListRun(queryTime);
  searchValue.value = "";
  uni.stopPullDownRefresh();
});
const options = reactive([
  {
    text: "设置已完成",
    style: {
      backgroundColor: "#dd524d",
      fontSize: "14px",
    },
  },
]);
const formData = reactive({
  actualMoney: "",
  id: "",
  isFinish: true,
});
const tasteTypes = ["正常辣", "微辣", "特辣"];
const btnTypes = ["", "warning", "error"];
const popup1 = ref(null);
const itemClick = async (item) => {
  popup1.value.open();
  formData.id = item.id;
  formData.isFinish = true;
  formData.actualMoney = item.actualMoney;
};
const popupConfirm = async () => {
  await orderUpdateApi(formData);
  uni.showToast({
    title: "设置成功",
    icon: "success",
    mask: true,
  });
  orderListRun(queryTime);
  popup1.value.close();
};
const popup2 = ref(null);
const radioVal = ref("1");
const radioVal2 = ref("1");
const orderName = ref("");
const desk = ref("");
const nameInput = ref(null);
const addDialog = () => {
  popup2.value.open();
  let time = dayjs().format("HH:mm");
  orderName.value = time + "-" + (todayOrder.value.length + 1) + "号订单";
};
const popupConfirm2 = async () => {
  if (!orderName.value) {
    nameInput.value._Focus();
    return;
  }
  try {
    let res = await orderAddApi({
      orderName: orderName.value,
      isPack: radioVal.value == "2" ? true : false,
      taste: Number(radioVal2.value),
      isFinish: false,
      totalMoney: 0,
      actualMoney: 0,
      desk: Number(desk.value) || "",
    });
    popup2.value.close();
    if (res) {
      uni.showToast({
        title: "创建成功,请添加菜品",
        icon: "none",
        mask: true,
      });
      setTimeout(() => {
        uni.navigateTo({
          url: "/pages/orderDetail/index?id=" + res,
        });
      }, 1000);
    }
  } catch (error) {
    popup2.value.close();
  }
};
// onShow(async () => {
//   let res = await orderApi(queryTime);
//   todayOrder.value = res;
// });
const oName = (item) => {
  return item.orderName + (item.desk ? "-" + item.desk + "号桌" : "");
};
const toDetail = (item, name) => {
  uni.navigateTo({
    url: "/pages/orderDetail/index?id=" + item.id + "&name=" + name,
  });
};
const searchValue = ref("");
const search = async () => {
  if (!searchValue.value) {
    return;
  }
  orderListRun({ id: searchValue.value });
};
const setAllFinish = async () => {
  uni.showModal({
    title: "提示",
    content: "确定要设置所有订单已完成吗？",
    success: async ({ confirm, cancel }) => {
      if (confirm) {
        await setFinishApi();
        uni.showToast({
          title: "设置成功",
          icon: "success",
        });
      }
    },
  });
};
const scanCode = () => {
  uni.scanCode({
    success: (res) => {
      console.log(res);
      toScanCode(res.result);
    },
    fail: (error) => {
      uni.showModal({
        title: "失败",
        content: error.errMsg,
        showCancel: true,
      });
      console.log(error);
    },
  });
};
const toScanCode = (url) => {
  let pramsStr = "";
  if (url.includes("id=")) {
    const idValue = url.match(/id=([^&]+)/) ? url.match(/id=([^&]+)/)[1] : null;
    pramsStr = `?id=${idValue}`;
  }
  if (url.includes("desk=")) {
    const idValue = url.match(/desk=([^&]+)/)
      ? url.match(/desk=([^&]+)/)[1]
      : null;
    pramsStr = `?desk=${idValue}`;
  }
  if (pramsStr) {
    uni.navigateTo({
      url: "/pages/orderDetail/index" + pramsStr,
    });
  }
};
const codeUrl = ref("");
const popup3 = ref(null);
const addQRcode = async () => {
  uni.showModal({
    title: "生成二维码",
    editable: true,
    content: "",
    placeholderText: "桌号，可不填",
    showCancel: true,
    success: async ({ confirm, cancel, content }) => {
      if (confirm) {
        let res = await addQrCodeApi({ desk: content });
        codeUrl.value = res;
        popup3.value.open();
      }
    },
  });
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
      popup3.value.close();
    },
    fail: (error) => {
      console.log(error);
      uni.showModal({
        title: "失败",
        content: error.errMsg,
        showCancel: true,
        success: ({ confirm, cancel }) => {},
      });
      popup3.value.close();
    },
  });
};
</script>

<template>
  <div class="mt-[20rpx]">
    <div class="px-[12px] mb-[12px] flex">
      <uni-easyinput
        clearable
        prefixIcon="search"
        confirmType="搜索"
        v-model="searchValue"
        @blur="search"
        placeholder="输入订单ID精准查询"
      >
      </uni-easyinput>
      <AbButton icon="scan" @click="scanCode" class="ml-[10px]"
        >扫一扫</AbButton
      >
    </div>
    <uni-swipe-action>
      <uni-swipe-action-item
        v-for="item in todayOrder"
        :key="item.id"
        :right-options="options"
        @click="itemClick(item)"
        :disabled="item.isFinish"
        class="mb-2"
      >
        <view
          @click.stop="toDetail(item, oName(item))"
          class="flex shadow-lg py-[20rpx] px-[20rpx] items-center relative"
          style="border: 2rpx solid #f5f5f5"
        >
          <div class="text-text2 text-14">
            <p>{{ item.orderName }}</p>
            <p class="text-12">创建时间：{{ item.showTime }}</p>
          </div>
          <div class="ml-auto">
            <uni-tag
              :type="btnTypes[item.taste - 1]"
              v-if="item.taste && item.taste != 1"
              style="margin-right: 4px"
              :text="tasteTypes[item.taste - 1]"
              size="small"
            />
            <uni-tag
              style="margin-right: 4px"
              v-if="item.isPack"
              text="打包"
              size="small"
              type="warning"
            />
            <uni-tag
              style="margin-right: 4px"
              v-if="item.desk"
              :text="item.desk + '号桌'"
              size="small"
              type="primary"
            />
            <uni-tag
              :text="!item.isFinish ? '进行中' : '已完成'"
              size="small"
              :type="!item.isFinish ? 'primary' : ''"
            />
          </div>
          <span
            class="absolute top-0 rotate-45 text-12 text-text3 left-1/2 scale-75"
            style="border: 1px solid red"
            v-if="item.undoneRecord"
            >有加菜</span
          >

          <adBell
            v-if="!item.isRead && !item.isRead && !item.isFinish"
          ></adBell>
        </view>
      </uni-swipe-action-item>
    </uni-swipe-action>
    <AbEmpty v-if="todayOrder?.length === 0" />
    <div class="px-[20rpx] mt-[20rpx] pb-[20px]">
      <AbButton icon="plusempty" @click="addDialog">新增订单</AbButton>
      <AbButton
        icon="gear"
        class="mt-[12px]"
        type="primary"
        @click="setAllFinish"
        >一键设置订单完成</AbButton
      >
      <AbButton
        icon="link"
        iconColor="#000"
        class="mt-[12px]"
        type="default"
        @click="addQRcode"
        >生成顾客点餐二维码</AbButton
      >
    </div>
    <uni-popup ref="popup1" type="dialog">
      <uni-popup-dialog
        :duration="2000"
        :before-close="true"
        @close="popup1.close()"
        @confirm="popupConfirm"
      >
        <uni-section title="实收金额" type="line" padding>
          <uni-easyinput
            errorMessage
            v-model="formData.actualMoney"
            type="number"
            focus
            placeholder="请输入收款金额"
          ></uni-easyinput>
        </uni-section>
      </uni-popup-dialog>
    </uni-popup>
    <uni-popup ref="popup2" type="dialog">
      <uni-popup-dialog
        title="添加订单"
        :duration="2000"
        :before-close="true"
        @close="popup2.close()"
        @confirm="popupConfirm2"
      >
        <div class="w-full">
          <div>
            <uni-easyinput
              ref="nameInput"
              errorMessage
              v-model="orderName"
              type="text"
              focus
              placeholder="请输入订单名称"
            ></uni-easyinput>
            <p v-if="!orderName" class="text-text3 text-12">请输入订单名称</p>
          </div>
          <div class="flex justify-start mt-[10px]">
            <AbRadio
              v-model="radioVal"
              :list="[
                { label: '在这吃', value: '1' },
                { label: '打包', value: '2' },
              ]"
            ></AbRadio>
          </div>
          <div class="flex justify-start mt-[8rpx]">
            <AbRadio
              v-model="radioVal2"
              :list="[
                { label: '正常辣', value: '1' },
                { label: '微辣', value: '2' },
                { label: '特辣', value: '3' },
              ]"
            ></AbRadio>
          </div>
          <div class="mt-[10px]">
            <uni-easyinput
              v-model="desk"
              type="number"
              placeholder="请输入桌号(可不填)"
            ></uni-easyinput>
          </div>
        </div>
      </uni-popup-dialog>
    </uni-popup>
    <uni-popup ref="popup3" type="dialog">
      <uni-popup-dialog
        title="点餐二维码"
        confirmText="保存二维码"
        cancelText="关闭"
        :duration="2000"
        :before-close="true"
        @close="popup3.close()"
        @confirm="downloadImage"
      >
        <div class="flex justify-center w-full h-auto">
          <img :src="codeUrl" class="w-full" />
        </div>
      </uni-popup-dialog>
    </uni-popup>
  </div>
</template>

<style lang="scss" scoped>
:deep(.uni-easyinput__content-input) {
  height: 30px;
}
</style>
