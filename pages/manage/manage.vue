<script setup>
import { selectList } from "@/store/globalStore";
import { menuApi, deleteMenuApi } from "@/utils/api";
import { ref, reactive, watchEffect } from "vue";
import { onPullDownRefresh } from "@dcloudio/uni-app";
import abMiniButton from "../components/abMiniButton.vue";
import abButton from "../components/abButton.vue";
import AbPicker from "../components/abPicker.vue";
import imgErr from "@/static/imgErr.png";
const sIndex = ref(0);
const manageSelectList = reactive([
  { text: "全部", value: 0 },
  ...selectList.value,
]);
const productList = ref([]);
const getList = async () => {
  let form = {};
  if (sIndex.value) {
    form.type = sIndex.value;
  }
  let res = await menuApi(form);
  productList.value = res;
  if (JSON.stringify(form) == "{}") {
    uni.setStorageSync("menuList", res);
  }
  uni.stopPullDownRefresh();
};
//合并两个数组
// manageSelectList.push(...selectList.value);
watchEffect(async () => {
  getList();
});
const toDelete = async (item) => {
  uni.showModal({
    title: "提示",
    content: `确定删除${item.name}吗？`,
    showCancel: true,
    success: ({ confirm, cancel }) => {
      if (confirm) {
        deleteMenuApi({ id: item.id })
          .then((res) => {
            uni.showToast({
              title: "删除成功",
            });
            productList.value = productList.value.filter(
              (i) => i.id != item.id
            );
            uni.setStorageSync("menuList", productList.value);
          })
          .catch((err) => {
            uni.showToast({
              title: "删除失败" + err,
            });
          });
      }
    },
  });
};
onPullDownRefresh(async () => {
  sIndex.value = 0;
  let res = await menuApi({ type: sIndex.value });
  productList.value = res;
  uni.setStorageSync("menuList", res);
  uni.stopPullDownRefresh();
});
const addMenu = () => {
  uni.navigateTo({
    url: "/pages/manage/addMenu",
  });
};
uni.$on("changeMenu", (res) => {
  sIndex.value = 0;
  menuApi({ type: sIndex.value }).then((res) => {
    productList.value = res;
    uni.setStorageSync("menuList", res);
  });
  uni.showToast({
    title: "成功",
    icon: "success",
    mask: true,
  });
});
const toEdit = (item) => {
  getApp().globalData.menuItem = item;
  uni.navigateTo({
    url: "/pages/manage/addMenu",
    success: (result) => {
      setTimeout(() => {
        uni.$emit("menuItem", item);
      }, 200);
    },
  });
};

const cardClick = (url) => {
  if (!url) {
    return;
  }
  uni.previewImage({
    urls: [url],
    success: (result) => {},
    fail: (error) => {},
  });
};
</script>

<template>
  <div class="">
    <div class="p-[13px] flex justify-between items-center">
      <AbPicker
        class="w-3/5"
        v-model="sIndex"
        :selectList="manageSelectList"
        label="选择分类"
      ></AbPicker>
      <abButton @click="addMenu" class="w-1/3" icon="plus">新增</abButton>
    </div>
    <view>
      <view v-for="item in productList" :key="item.id" class="card-item">
        <view class="card-actions flex items-center">
          <view class="flex-[0.8]">
            <image
              :src="item.picImg || imgErr"
              @click="cardClick(item.picImg)"
              mode="scaleToFill"
              class="w-[80rpx] h-[80rpx] rounded-[10rpx]"
            />
          </view>

          <view class="flex flex-col flex-1">
            <text>{{ item.name }}</text>
            <text class="text-12 text-text2">{{
              manageSelectList.find((i) => i.value == item.type).text
            }}</text>
          </view>
          <view class="flex-1">
            <span
              >价格：<span class="text-text3">{{ item.price }}</span></span
            >
          </view>
          <abMiniButton plain @click.stop="toEdit(item)" class="mr-[16px]"
            >修改</abMiniButton
          >
          <abMiniButton
            plain
            type="warn"
            icon="trash"
            iconColor="#fa2c19"
            @click.stop="toDelete(item)"
            >删除</abMiniButton
          >
        </view>
      </view>
    </view>
  </div>
</template>

<style lang="scss" scoped>
.card-item {
  border: 1px solid #ebeef5;
  box-shadow: rgba(0, 0, 0, 0.08) 0px 0px 3px 1px;
  background-color: #fff;
  margin: 10px 12px;
  padding: 6px 10px;
  border-radius: 4px;
}
</style>
