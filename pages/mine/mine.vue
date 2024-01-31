<script setup>
import { ref, reactive } from "vue";
import {
  userInfoApi,
  addAccountApi,
  getAccountApi,
  editAccountApi,
} from "@/utils/api";
import { onPullDownRefresh, onLoad } from "@dcloudio/uni-app";
import AbButton from "../components/abButton.vue";
import dayjs from "dayjs";
const infoData = ref({});
const authValue = ref("");
onLoad(async () => {
  let res = await userInfoApi();
  infoData.value = res;
  authValue.value = uni.getStorageSync("auth");
});
onPullDownRefresh(async () => {
  let res = await userInfoApi();
  infoData.value = res;
  uni.stopPullDownRefresh();
});
const logout = () => {
  uni.removeStorageSync("token");
  uni.reLaunch({ url: "/pages/login/login" });
};
const addPopup = ref(null);
const editPopup = ref(null);
const formData1 = reactive({
  userName: "",
  password: "",
  expireDate: dayjs().format("YYYY-MM-DD"),
  syncMerchantID: "",
});
const syncAccount = ref("");
const formData2 = reactive({
  userName: "",
  expireDate: dayjs().format("YYYY-MM-DD"),
});
const addForm = ref(null);
const startDate = ref(dayjs().subtract(1, "day").format("YYYY-MM-DD"));
const endDate = ref(dayjs().add(12, "month").format("YYYY-MM-DD"));
const rules1 = {
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
  expireDate: {
    rules: [
      {
        required: true,
        errorMessage: "请选择有效期",
      },
    ],
  },
};
const addAccount = () => {
  addForm.value.validate().then(async (res) => {
    try {
      let res1 = await addAccountApi(formData1);
      addPopup.value.close();
      uni.showToast({
        title: "添加成功",
        icon: "success",
        mask: true,
      });
    } catch (error) {
      addPopup.value.close();
    }
  });
};
const editForm = ref(null);
const openPopup = async () => {
  let res = await getAccountApi();
  userRange.value = res;
  editPopup.value.open();
};
const openPopup2 = async () => {
  let res = await getAccountApi();
  userRange.value = res;
  addPopup.value.open();
};
const changeUser = () => {
  formData2.expireDate = userRange.value.find(
    (item) => item.value == formData2.userName
  ).expireDate;
};
const changeUser2 = (item2) => {
  formData1.syncMerchantID = userRange.value.find(
    (item) => item.value == item2
  )?.merchantID;
};

const editAccount = () => {
  editForm.value.validate().then(async (res) => {
    try {
      let res1 = await editAccountApi(res);
      editPopup.value.close();
      uni.showToast({
        title: "修改成功",
        icon: "success",
        mask: true,
      });
    } catch (error) {
      editPopup.value.close();
    }
  });
};
const userRange = ref([]);
const toMyArticle = () => {
  uni.navigateTo({ url: "/pages/article/article" });
};
</script>

<template>
  <view class="p-[16px]">
    <div class="flex items-center shadow-md p-[6px] bg-bg1 rounded-md">
      <image src="@/static/user.png" class="w-[50px] h-[50px]" />
      <view class="ml-[12px]">
        <p>
          账号：<span class="text-text3">{{ infoData.userName }}</span>
        </p>
        <p>
          账号姓名：<span class="text-text3">{{ infoData.realName }}</span>
        </p>
      </view>
    </div>
    <!-- <ul class="mt-[12px]">
      <li class="flex items-center shadow-md p-[12px] bg-bg1 rounded-md">
        <image src="@/static/transaction-order.svg" class="w-[20px] h-[20px]" />
        <span class="ml-[2px]"> 平台总订单数量 </span>
        <span class="ml-auto text-text3 text-16 font-bold">
          {{ infoData.orderCount }}
        </span>
      </li>
      <li
        class="flex items-center shadow-md p-[12px] bg-bg1 rounded-md mt-[12px]"
      >
        <image src="@/static/money-alt.svg" class="w-[20px] h-[20px]" />
        <span class="ml-[2px]"> 平台订单总金额 </span>
        <span class="ml-auto text-text3 text-16 font-bold">
          {{ infoData.totalMoney }}
        </span>
      </li>
      <li
        class="flex items-center shadow-md p-[12px] bg-bg1 rounded-md mt-[12px]"
      >
        <image src="@/static/money-stack.svg" class="w-[20px] h-[20px]" />
        <span class="ml-[2px]"> 平台订单总优惠 </span>
        <span class="ml-auto text-text3 text-16 font-bold">
          {{ infoData.discountedMoney }}
        </span>
      </li>
    </ul> -->
    <ul class="mt-[12px]">
      <li class="flex items-center shadow-md p-[12px] bg-bg1 rounded-md">
        <image src="@/static/order-light.svg" class="w-[20px] h-[20px]" />
        <span class="ml-[2px]"> 我添加的订单数量 </span>
        <span class="ml-auto text-text3 text-16 font-bold">
          {{ infoData.orderCount }}
        </span>
      </li>
      <li
        class="flex items-center shadow-md p-[12px] bg-bg1 rounded-md mt-[12px]"
      >
        <image src="@/static/money-bag-outline.svg" class="w-[20px] h-[20px]" />
        <span class="ml-[2px]"> 我的订单总金额 </span>
        <span class="ml-auto text-text3 text-16 font-bold">
          {{ infoData.totalMoney }}
        </span>
      </li>
      <li
        class="flex items-center shadow-md p-[12px] bg-bg1 rounded-md mt-[12px]"
      >
        <image
          src="@/static/hand-money-outline.svg"
          class="w-[20px] h-[20px]"
        />
        <span class="ml-[2px]"> 我的订单总优惠 </span>
        <span class="ml-auto text-text3 text-16 font-bold">
          {{ infoData.discountedMoney }}
        </span>
      </li>
      <li
        v-if="authValue == 'superAdmin'"
        class="flex items-center shadow-md p-[12px] bg-bg1 rounded-md mt-[12px]"
        @click="toMyArticle"
      >
        <image src="@/static/article-line.svg" class="w-[20px] h-[20px]" />
        <span class="ml-[2px]"> 我的添加的文章 </span>
        <uni-icons class="ml-auto" type="arrowright" color="" size="20" />
      </li>
      <li
        v-if="authValue == 'superAdmin'"
        class="flex items-center shadow-md p-[12px] bg-bg1 rounded-md mt-[12px]"
      >
        <ab-button type="primary" icon="plusempty" @click="openPopup2"
          >添加账户</ab-button
        >
        <ab-button type="primary" icon="compose" @click="openPopup"
          >修改账户</ab-button
        >
      </li>
    </ul>
    <div class="mt-[60px]">
      <AbButton type="default" icon="undo" iconColor="#000" @click="logout"
        >退出登录</AbButton
      >
    </div>
    <uni-popup ref="addPopup" type="dialog">
      <uni-popup-dialog
        title="添加账户"
        :before-close="true"
        @close="addPopup.close()"
        @confirm="addAccount"
      >
        <uni-forms :modelValue="formData1" ref="addForm" :rules="rules1">
          <uni-forms-item label="用户名:" name="userName" required>
            <uni-easyinput
              type="text"
              v-model="formData1.userName"
              placeholder="请输入用户名"
            />
          </uni-forms-item>
          <uni-forms-item label="密码:" name="password" required>
            <uni-easyinput
              type="text"
              v-model="formData1.password"
              placeholder="请输入密码"
            />
          </uni-forms-item>
          <uni-forms-item label="有效期:" name="expireDate">
            <uni-datetime-picker
              v-model="formData1.expireDate"
              :start="startDate"
              :end="endDate"
              type="date"
            />
          </uni-forms-item>
          <uni-forms-item label="同步菜品">
            <uni-data-select
              v-model="syncAccount"
              :localdata="userRange"
              @change="changeUser2"
              placeholder="请选择同步的商户"
            ></uni-data-select>
          </uni-forms-item>
        </uni-forms>
      </uni-popup-dialog>
    </uni-popup>
    <uni-popup ref="editPopup" type="dialog">
      <uni-popup-dialog
        title="修改账户"
        :before-close="true"
        @close="editPopup.close()"
        @confirm="editAccount"
      >
        <uni-forms :modelValue="formData2" ref="editForm" :rules="rules1">
          <uni-forms-item label="用户名:" name="userName">
            <uni-data-select
              v-model="formData2.userName"
              :localdata="userRange"
              @change="changeUser"
            ></uni-data-select>
          </uni-forms-item>
          <uni-forms-item label="有效期:" name="expireDate">
            <uni-datetime-picker
              v-model="formData2.expireDate"
              :start="startDate"
              :end="endDate"
              type="date"
            />
          </uni-forms-item>
        </uni-forms>
      </uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<style lang="scss" scoped></style>
