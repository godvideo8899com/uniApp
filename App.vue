<template></template>
<script setup>
import { provide } from "vue";
import { getToken } from "@/utils/auth";
import socket from "@/utils/socket";
import tipMusic from "./static/tip.mp3";
console.log(tipMusic);
provide("socket", socket);
socket.on("message", async (data) => {
  if (getToken()) {
    const innerAudioContext = uni.createInnerAudioContext();
    innerAudioContext.src = tipMusic;
    innerAudioContext.play();
    if (data.type == "addFoods") {
      uni.showModal({
        title: data.desk + "号桌-顾客加菜",
        content: data.msg,
        showCancel: false,
        confirmText: "知道了",
        success: ({ confirm, cancel }) => {
          if (confirm) {
            copyID(data.orderId);
          }
        },
      });
    }
    if (data.type == "submitted") {
      if (data.desk) {
        uni.showModal({
          title: "新增订单",
          content: data.desk + "号桌-顾客已经提交了订单，请及时处理",
          showCancel: false,
          confirmText: "知道了",
          success: ({ confirm, cancel }) => {
            if (confirm) {
              copyID(data.orderId);
            }
          },
        });
      } else {
        uni.showModal({
          title: "新增订单",
          content: "顾客自助提交了订单，请及时处理",
          showCancel: false,
          confirmText: "知道了",
          success: ({ confirm, cancel }) => {
            if (confirm) {
              copyID(data.orderId);
            }
          },
        });
      }
    }
  }
});
const copyID = (data) => {
  uni.setClipboardData({
    showToast: false,
    data,
    success: (result) => {
      uni.showToast({
        title: "订单ID已复制",
        icon: "none",
      });
    },
    fail: (error) => {},
  });
};
</script>

<style lang="scss">
@import "tailwindcss/base";
@import "tailwindcss/utilities";
html,
body {
  font-size: 14px;
  --border_c: #eee;
  --bg_1: #f5f5f5;
}
button {
  font-size: 14px;
  line-height: 2;
}
.uni-popup {
  z-index: 99999 !important;
}
ul {
  list-style: none;
  padding: 0;
}
.uni-calendar-item--multiple .uni-calendar-item--before-checked,
.uni-calendar-item--multiple .uni-calendar-item--after-checked,
.uni-datetime-picker--btn {
  background-color: #fa2c19 !important;
}
</style>
