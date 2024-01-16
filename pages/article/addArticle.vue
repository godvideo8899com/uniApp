<script setup>
import { reactive } from "vue";
import AbButton from "../components/abButton.vue";
import env from "@/utils/env";
import { addArticleApi } from "@/utils/api";
const form = reactive({
  title: "",
  content: "",
  files: [],
});
const submit = async () => {
  if (!form.title) {
    uni.showToast({
      title: "请输入标题",
      icon: "none",
    });
    return;
  }
  uni.showLoading({
    mask: true,
  });
  let index = 0;
  for (const iterator of form.files) {
    await upload(index);
    index++;
  }
  let res = await addArticleApi(form);
  uni.hideLoading();
  uni.showToast({
    title: "添加成功",
    icon: "success",
    mask: true,
  });
  uni.navigateBack({
    delta: 1,
  });
  //   await upload();
};
const select = (e) => {
  console.log(e);
  form.files.push(e.tempFilePaths[0]);
};
const fileDel = (e) => {
  form.files.splice(e.index, 1);
};
const upload = async (num) => {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: `${env.baseUrl}/upload`,
      fileType: "all",
      filePath: form.files[num],
      name: "image",
      success: ({ data, statusCode }) => {
        form.files[num] = JSON.parse(data).data;
        console.log(form.files);
        resolve(JSON.parse(data));
      },
      fail: (error) => {
        console.log(error);
        reject(error);
      },
    });
  });
};
</script>

<template>
  <view class="p-[16px]">
    <uni-forms ref="myForm">
      <uni-forms-item required label="标题:">
        <uni-easyinput
          clearable
          v-model="form.title"
          type="text"
          placeholder="请输入标题"
        />
      </uni-forms-item>
      <uni-forms-item label="内容:">
        <uni-easyinput
          clearable
          v-model="form.content"
          type="text"
          placeholder="请输入内容"
        />
      </uni-forms-item>
      <uni-forms-item label="附件:">
        <uni-file-picker
          @select="select"
          @delete="fileDel"
          file-mediatype="all"
        ></uni-file-picker>
      </uni-forms-item>
    </uni-forms>
    <AbButton @click="submit" icon="plusempty">提 交</AbButton>
  </view>
</template>

<style lang="scss" scoped></style>
