<script setup>
import { ref, computed, inject } from "vue";
import dayjs from "dayjs";
import { getToken } from "@/utils/auth";
import abMiniButton from "../components/abMiniButton.vue";
import abEmpty from "../components/abEmpty.vue";
import addRecords from "./addRecords.vue";
import AbRadio from "../components/abRadio.vue";
import { onLoad, onBackPress } from "@dcloudio/uni-app";
import {
  orderApi,
  orderUpdateApi,
  orderAddApi,
  addFoodsApi,
  addRecordsApi,
} from "@/utils/api";
const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
  isChange: {
    type: Boolean,
    default: false,
  },
  queryData: {
    type: Object,
    default: () => {},
  },
  allList: {
    type: Array,
    default: () => [],
  },
  backupData: {
    type: Array,
    default: () => [],
  },
});
const btnStutas = inject("btnStutas");
const socket = inject("socket");
const emits = defineEmits([
  "clear",
  "updateClone",
  "initOrder",
  "setCloneData",
]);
// const isDisabled = com;
const totalMoney = computed(() => {
  let total = props.list.reduce((a, b) => {
    return a + b.price * b.count;
  }, 0);
  return parseFloat(total.toFixed(2));
});
const totalCount = computed(() => {
  let total = props.list.reduce((a, b) => {
    return a + b.count;
  }, 0);
  return total;
});
const submitOne = async () => {
  if (!props.isChange) {
    uni.showToast({
      title: "没有更改，无需提交",
      icon: "none",
    });
    return;
  }
  if (props.queryData.id) {
    let changeArr = [];
    props.list.forEach((element) => {
      const item = props.backupData.find((i) => i.id == element.id);
      if (element.count != item.count) {
        let changeItem = JSON.parse(JSON.stringify(element));
        changeItem.count = element.count - item.count;
        if (changeItem.count > 0) {
          changeArr.push(changeItem);
        }
      }
    });
    await orderUpdateApi({
      id: props.queryData.id,
      orderDetail: props.list,
      totalMoney: totalMoney.value,
      totalCount: totalCount.value,
      recordsList: changeArr.length ? changeArr : "",
      isAdmin: true,
    });
    emits("setCloneData");
  } else {
    let time = dayjs().format("HH:mm");
    let res2 = await orderAddApi(
      {
        orderName: time + "-" + props.queryData.desk + "号桌",
        isPack: false,
        taste: Number(radioVal2.value),
        isFinish: false,
        totalCount: totalCount.value,
        totalMoney: totalMoney.value,
        orderDetail: props.list,
        actualMoney: 0,
        desk: Number(props.queryData.desk) || "",
        userOperation: true,
      },
      true
    );
    console.log(res2);
    if (!getToken()) {
      btnStutas.value = true;
    }
    props.queryData.id = res2.data;
    socket.emit("message", {
      desk: props.queryData.desk,
      type: "submitted",
      orderId: res2.data,
    });
    if (res2.orderFlag) {
      uni.setStorageSync("orderId", res2.data);
      uni.reLaunch({ url: "/pages/orderDetail/orderInfo" });
    }
    popupTwo.value.close();
  }
  emits("updateClone");
  uni.showToast({
    icon: "success",
    title: "已提交",
  });
};
const popupOne = ref(null);
const addData = ref([]);
const lookDetail = async () => {
  let res = await addRecordsApi({
    orderId: props.queryData.id || "234wert",
  });
  addData.value = res;
  popupOne.value.open();
};
onBackPress(() => {
  if (props.isChange) {
    uni.showModal({
      title: "提示",
      content: "订单未保存，是否保存",
      success: async ({ confirm, cancel }) => {
        if (confirm) {
          await submitOne();
          return true;
        } else {
          return true;
        }
      },
    });
  }
});
//清空
const clear = () => {
  uni.showModal({
    title: "提示",
    content: "确定要清空所有选项吗",
    showCancel: true,
    success: ({ confirm, cancel }) => {
      if (confirm) {
        emits("clear");
        uni.showToast({
          icon: "success",
        });
      }
    },
  });
};
const popupTwo = ref(null);
const radioVal2 = ref("1");
const popupConfirm2 = async () => {
  submitOne();
};
let cloneData = [];
const btnFlag = ref(false);
const addFood = () => {
  uni.showToast({
    title: "已重置菜单，请选择您要添加的菜品",
    icon: "none",
    mask: false,
  });
  cloneData = JSON.parse(JSON.stringify(props.allList));
  btnStutas.value = false;
  btnFlag.value = true;
  emits("clear");
};
const submitAddFood = async () => {
  let items = props.list.filter((item) => item.count > 0);
  await addFoodsApi({
    orderId: props.queryData.id,
    desk: props.queryData.desk,
    items: items,
    totalMoney: totalMoney.value,
    totalCount: totalCount.value,
  });
  let sendMsg = ``;
  items.forEach((item) => {
    sendMsg += ` ${item.name}  x ${item.count} \n`;
  });
  socket.emit("message", {
    msg: sendMsg,
    desk: props.queryData.desk,
    type: "addFoods",
    orderId: props.queryData.id,
  });
  uni.showModal({
    title: "提示",
    content: "提交成功，等待上菜吧",
    confirmText: "知道了",
    showCancel: false,
  });
  btnStutas.value = true;
  btnFlag.value = false;
  emits("initOrder");
};
const cancelAdd = () => {
  uni.showModal({
    title: "提示",
    content: "是否放弃本次加菜",
    showCancel: true,
    success: ({ confirm, cancel }) => {
      if (confirm) {
        btnStutas.value = true;
        btnFlag.value = false;
        emits("updateClone", cloneData);
      }
    },
  });
};
const currentDesk = ref(1);
const setDesk = async () => {
  uni.showModal({
    title: "设置桌号",
    content: currentDesk.value,
    editable: true,
    placeholderText: "请输入桌号",
    showCancel: true,
    success: async ({ confirm, cancel, content }) => {
      if (confirm) {
        await orderUpdateApi({
          id: props.queryData.id,
          desk: Number(content),
        });
        uni.showToast({
          title: "成功",
          icon: "success",
          mask: true,
        });
      }
    },
  });
};
socket.on("message", (data) => {
  if (props.queryData.desk && props.queryData.desk == data.desk) {
    if (data.type == "submitted") {
      uni.showModal({
        title: "提示",
        content: "您的同桌已经提交了订单",
        showCancel: false,
        confirmText: "知道了",
        success: () => {
          emits("initOrder");
        },
      });
      return;
    }
    if (!getToken()) {
      uni.showModal({
        title: "来自您同桌的加菜",
        content: data.msg,
        showCancel: false,
        confirmText: "知道了",
        success: () => {
          emits("initOrder");
        },
      });
    }
  }
});
</script>

<template>
  <div>
    <div class="h-[40px] flex items-center px-[10px]">
      <span class="flex items-center text-text3 text-16 font-bold">
        <uni-icons type="cart" color="" size="24" class="mr-[2px]" />
        {{ totalMoney.toFixed(2) }}</span
      >
      <view class="ml-auto mr-[10px]"
        ><abMiniButton type="warn" @click="clear" icon="close"
          >清空</abMiniButton
        ></view
      >
      <view class="mr-[10px]" v-if="getToken()"
        ><abMiniButton @click="setDesk">设置桌号</abMiniButton></view
      >
      <view class="mr-[10px]"
        ><abMiniButton @click="lookDetail">查看明细</abMiniButton></view
      >
      <view class="mr-[10px]" v-if="queryData.desk && btnStutas"
        ><abMiniButton @click="addFood">我要加菜</abMiniButton></view
      >
      <view class="mr-[10px]" v-if="!btnStutas && btnFlag"
        ><abMiniButton @click="cancelAdd">取消</abMiniButton></view
      >
      <view
        class="mr-[10px]"
        v-if="!btnStutas && btnFlag && !list.every((i) => i.count == 0)"
        ><abMiniButton type="warn" icon="plusempty" @click="submitAddFood"
          >选好了</abMiniButton
        ></view
      >
      <view class="" v-if="queryData.id && !queryData.desk"
        ><abMiniButton type="warn" @click="submitOne">提交</abMiniButton></view
      >

      <view class="" v-if="!queryData.id"
        ><abMiniButton type="warn" @click="popupTwo.open()"
          >提交</abMiniButton
        ></view
      >
    </div>
    <uni-popup ref="popupOne" type="bottom">
      <view class="bg-bg3 p-[12px]">
        <div class="flex justify-center items-center px-[10px]">
          <span class="text-16 font-bold text-text2 ml-auto">订单汇总</span>
          <uni-icons
            class="ml-auto"
            type="closeempty"
            @click="popupOne.close()"
            color="#ccc"
            size="24"
          />
        </div>
        <scroll-view scroll-y="true" style="max-height: 80vh">
          <div v-if="list.length">
            <ul>
              <li class="grid grid-cols-4 text-center py-[4px] font-bold">
                <span>名称</span><span>单价</span><span>数量</span
                ><span>小记</span>
              </li>
              <li
                v-for="item in list"
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

            <div class="mt-[12px] flex justify-center">
              <span class="text-text3 font-bold mr-[10px]"
                >总数量:{{ totalCount }}</span
              >
              <span class="text-text3 font-bold">总计:{{ totalMoney }}</span>
            </div>
          </div>
          <abEmpty v-else text="暂无数据" />
          <addRecords
            :recordsList="addData"
            v-if="addData.length > 1"
          ></addRecords>
        </scroll-view>
      </view>
    </uni-popup>
    <uni-popup ref="popupTwo" type="dialog">
      <uni-popup-dialog
        title="添加订单"
        :duration="2000"
        :before-close="true"
        @close="popupTwo.close()"
        @confirm="popupConfirm2"
      >
        <div class="w-full">
          <AbRadio
            v-model="radioVal2"
            :list="[
              { label: '正常辣', value: '1' },
              { label: '微辣', value: '2' },
              { label: '特辣', value: '3' },
            ]"
          ></AbRadio>
        </div>
      </uni-popup-dialog>
    </uni-popup>
  </div>
</template>

<style lang="scss" scoped></style>
