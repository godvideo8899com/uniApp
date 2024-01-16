<script setup>
import { ref } from "vue";
import AbButton from "../components/abButton.vue";
import abMiniButton from "../components/abMiniButton.vue";
import { onPullDownRefresh } from "@dcloudio/uni-app";
import { articleListApi } from "@/utils/api";
import { isImageURL } from "@/utils/utils";
const recordsList = ref([
  {
    title: "",
    content: "",
    createTime: "",
    files: [],
  },
]);
const copy = (text) => {
  uni.setClipboardData({
    data: text,
  });
};
const searchValue = ref("");
const search = () => {
  getList();
};
const getList = async () => {
  let res = await articleListApi({ searchValue: searchValue.value });
  recordsList.value = res;
};
getList();
const addArticle = () => {
  uni.navigateTo({ url: "/pages/article/addArticle" });
};
onPullDownRefresh(async () => {
  searchValue.value = "";
  await getList();
  uni.stopPullDownRefresh();
});
const lookImg = (url) => {
  uni.previewImage({ urls: [url] });
};
const download = (url) => {
  if (process.env.VUE_APP_PLATFORM == "h5") {
    let a = document.createElement("a");
    //   a.download = "order.jpg";
    a.href = url;
    a.click();
  } else {
    uni.saveFile({
      tempFilePath: url,
      success: ({ savedFilePath }) => {
        uni.showToast({
          title: `保存成功${savedFilePath}`,
          icon: "success",
          mask: true,
        });
      },
      fail: (error) => {
        console.log(error);
        uni.showToast({
          icon: "none",
          title: error.errMsg,
        });
      },
    });
  }
};
</script>

<template>
  <view class="p-[16px]">
    <view class="flex items-center">
      <uni-easyinput
        clearable
        prefixIcon="search"
        confirmType="搜索"
        v-model="searchValue"
        @blur="search"
        placeholder="请输入关键字"
      >
      </uni-easyinput>
      <AbButton icon="plusempty" @click="addArticle" class="ml-[10px]"
        >添加</AbButton
      >
    </view>
    <view>
      <uni-collapse>
        <uni-collapse-item
          v-for="(item, index) in recordsList"
          :key="index"
          class="text-center"
          :show-animation="true"
          :title="item.title"
        >
          <view class="pb-[10px]">
            <view class="text-left relative" v-if="item.content">
              <text>{{ item.content }}</text>
              <abMiniButton
                icon="copy"
                class="absolute bottom-[-3px]"
                @click="copy(item.content)"
              >
                复制文本</abMiniButton
              >
            </view>
            <view class="mt-[8px]" style="border: 1px solid #eee">
              <view
                class="flex mb-[4px]"
                v-for="file in item.files"
                :key="file"
              >
                <text>{{ isImageURL(file) ? "图片" : "文件" }}-</text>
                <text>{{
                  file.slice(file.lastIndexOf("/") + 1, file.length)
                }}</text>
                <abMiniButton
                  v-if="isImageURL(file)"
                  type="default"
                  @click="lookImg(file)"
                  >预览</abMiniButton
                >
                <abMiniButton type="default" @click="download(file)"
                  >下载</abMiniButton
                >
              </view>
            </view>
          </view>
        </uni-collapse-item>
      </uni-collapse>
    </view>
  </view>
</template>

<style lang="scss" scoped></style>
