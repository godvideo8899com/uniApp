<script setup>
import { reactive, ref } from "vue";
import AbButton from "../components/abButton.vue";
import { loginApi, menuApi } from "@/utils/api";
import { setToken } from "@/utils/auth";
import loginImg from "../../static/logo.png";
const formData = reactive({
  userName: "",
  password: "",
});
const userInfo = uni.getStorageSync("userInfo");
console.log(userInfo);
const rememberPwd = ref("");
const hobby = [
  {
    text: "记住密码",
    value: "1",
  },
];
if (userInfo.userName && userInfo.password) {
  formData.userName = userInfo.userName;
  formData.password = userInfo.password;
  rememberPwd.value = ["1"];
}
const loginForm = ref(null);
const login = () => {
  loginForm.value.validate().then(async (res) => {
    let data = await loginApi(formData);
    if (formData.userName == "superAdmin") {
      uni.setStorageSync("auth", "superAdmin");
    } else {
      uni.removeStorageSync("auth");
    }
    if (rememberPwd.value.length) {
      uni.setStorageSync("userInfo", formData);
    } else {
      uni.removeStorageSync("userInfo");
    }
    setToken(data.tokenStr);
    console.log(data.merchantID);
    uni.setStorageSync("merchantID", data.merchantID);
    let resMenu = await menuApi({});
    uni.setStorageSync("menuList", resMenu);
    uni.reLaunch({
      url: "/pages/index/index",
      animationType: "pop-in",
      animationDuration: 200,
    });
  });
};
const rules = {
  userName: {
    rules: [
      {
        required: true,
        errorMessage: "请填写用户名",
      },
    ],
  },
  password: {
    rules: [
      {
        required: true,
        errorMessage: "请填写密码",
      },
    ],
  },
};
</script>

<template>
  <div>
    <image :src="loginImg" class="w-full" srcset="" />
    <p class="text-center text-text3">请登录</p>
  </div>
  <div class="p-[12px]">
    <uni-forms :modelValue="formData" ref="loginForm" :rules="rules">
      <uni-forms-item label="用户名:" name="userName">
        <uni-easyinput
          type="text"
          v-model="formData.userName"
          placeholder="请输入用户名"
        />
      </uni-forms-item>
      <uni-forms-item label="密码:" name="password">
        <uni-easyinput
          type="password"
          v-model="formData.password"
          placeholder="请输入密码"
        />
      </uni-forms-item>
    </uni-forms>
    <div class="mb-[12px]">
      <uni-data-checkbox multiple v-model="rememberPwd" :localdata="hobby" />
    </div>
    <AbButton icon="auth" @click="login">登 录</AbButton>
  </div>
</template>

<style lang="scss" scoped></style>
