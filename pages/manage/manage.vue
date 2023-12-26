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
  uni.stopPullDownRefresh();
});
const addMenu = () => {
  uni.navigateTo({
    url: "/pages/manage/addMenu",
  });
};
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

const cardClick = (event, url) => {
  if (event == "title") {
    uni.previewImage({
      urls: [url],
      success: (result) => {},
      fail: (error) => {},
    });
  }
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
      <uni-card
        v-for="item in productList"
        :title="item.name"
        :thumbnail="item.picImg || imgErr"
        :sub-title="manageSelectList.find((i) => i.value == item.type).text"
        :extra="`价格：${item.price}`"
        @click="cardClick($event, item.picImg)"
      >
        <view class="card-actions flex py-[6px] justify-around">
          <abMiniButton plain @click.stop="toEdit(item)">修改</abMiniButton>
          <abMiniButton
            plain
            type="warn"
            icon="trash"
            iconColor="#fa2c19"
            @click.stop="toDelete(item)"
            >删除</abMiniButton
          >
        </view>
      </uni-card>
    </view>
  </div>
</template>

<style lang="scss" scoped></style>
