<script setup>
import { reactive, ref, watch } from "vue";
import { selectList } from "@/store/globalStore";
import AbRadio from "../components/abRadio.vue";
import AbPicker from "../components/abPicker.vue";
import AbButton from "../components/abButton.vue";
import { addMenuApi, updateMenuApi } from "@/utils/api";
import env from "@/utils/env";
const formData = ref({
  id: "",
  name: "",
  price: "",
  type: "1",
  picImg: "",
  isOnline: true,
  unit: "串",
});
uni.$on("menuItem", function (data) {
  uni.setNavigationBarTitle({
    title: "修改菜单",
  });
  formData.value = data;
});
const imageValue = ref([]);
const fileValue = ref({
  tempFilePaths: [],
  tempFiles: [],
});
const fail = (e) => {
  console.log(e);
};
const select = (e) => {
  fileValue.value = e;
};
const upload = async () => {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: `${env.baseUrl}/upload`,
      fileType: "image",
      filePath: fileValue.value.tempFilePaths[0],
      name: "image",
      success: ({ data, statusCode }) => {
        console.log(data);
        formData.value.picImg = JSON.parse(data).data;
        resolve(JSON.parse(data));
      },
      fail: (error) => {
        console.log(error);
        reject(error);
      },
    });
  });
};
const menuForm = ref(null);
const submit = async () => {
  await menuForm.value.validate();
  fileValue.value.tempFilePaths.length && (await upload());
  console.log(formData.value.picImg);
  let reqImg = "";
  if (formData.value.picImg) {
    reqImg = formData.value.picImg.includes("http")
      ? ""
      : formData.value.picImg;
  }
  let reqData = {
    ...formData.value,
    type: Number(formData.value.type),
    price: Number(formData.value.price),
    picImg: reqImg,
  };
  if (formData.value.id) {
    await updateMenuApi(reqData);
  } else {
    await addMenuApi(reqData);
  }
  uni.showToast({
    title: "成功",
    icon: "success",
    mask: true,
  });
  uni.navigateBack();
};
const rules = {
  name: {
    rules: [
      {
        required: true,
        errorMessage: "请填写商品名",
      },
    ],
  },
  price: {
    rules: [
      {
        required: true,
        errorMessage: "请填写价格",
      },
    ],
  },
};
</script>

<template>
  <div class="p-[10px]">
    <uni-forms :modelValue="formData" ref="menuForm" :rules="rules">
      <uni-forms-item label="商品:" name="name">
        <uni-easyinput
          type="text"
          v-model="formData.name"
          placeholder="请输入商品名"
        />
      </uni-forms-item>
      <uni-forms-item label="价格:" name="price">
        <uni-easyinput
          type="number"
          v-model="formData.price"
          placeholder="请输入价格"
        />
      </uni-forms-item>
      <uni-forms-item label="分类:" name="unit">
        <AbPicker v-model="formData.type" :selectList="selectList"></AbPicker>
      </uni-forms-item>
      <uni-forms-item label="单位:" name="unit">
        <AbRadio
          class="mt-[8px]"
          v-model="formData.unit"
          :list="[
            { label: '串', value: '串' },
            { label: '份', value: '份' },
            { label: '瓶', value: '瓶' },
            { label: '件', value: '件' },
            { label: '个', value: '个' },
          ]"
        ></AbRadio>
      </uni-forms-item>
      <uni-forms-item label="上架:" name="unit">
        <switch
          :checked="formData.isOnline"
          @change="formData.isOnline = $event.detail.value"
        />
      </uni-forms-item>
      <uni-forms-item label="预览图:" name="unit">
        <uni-file-picker
          v-model="imageValue"
          fileMediatype="image"
          mode="grid"
          limit="1"
          @select="select"
          @fail="fail"
          sizeType="compressed"
        />
      </uni-forms-item>
    </uni-forms>
    <AbButton @click="submit" icon="plusempty">提 交</AbButton>
  </div>
</template>

<style lang="scss" scoped></style>
