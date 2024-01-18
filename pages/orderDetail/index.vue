<script setup>
import { orderApi, menuApi, orderUpdateApi, orderAddApi } from "@/utils/api";
import { ref, computed, provide } from "vue";
import { onPullDownRefresh, onLoad } from "@dcloudio/uni-app";
import { getToken } from "@/utils/auth";
import abMenuList from "./abMenuList.vue";
import orderBottom from "./orderBottom.vue";
import { selectList } from "@/store/globalStore";
const menuList = ref([]);
const userMenu = ref({});
const searchValue = ref("");
const mIndex = ref(1);
const oIndex = ref(0);
let cloneData = ref([]);
const queryData = ref({});
onLoad(async (options) => {
  options.merchantID && uni.setStorageSync("merchantID", options.merchantID);
  queryData.value = options;
  let title = "欢迎点餐";
  if (options.name || options.desk) {
    title = options.name || options.desk + "号桌";
  }
  uni.setNavigationBarTitle({
    title: title,
  });
  initOrder();
});
const btnStutas = ref(false);
provide("btnStutas", btnStutas);
const disabledBtn = computed(() => {
  return userMenu.value?.isFinish || (queryData.value.desk && btnStutas.value);
});
const initOrder = async () => {
  let storeMenu = uni.getStorageSync("menuList");
  if (storeMenu && getToken()) {
    menuList.value = storeMenu;
  } else {
    let mRes = await menuApi({ filter: true });
    menuList.value = mRes;
    uni.setStorageSync("menuList", mRes);
  }
  menuList.value.forEach((element) => {
    element.count = 0;
  });
  cloneData.value = menuList.value.map((v) => v.count);
  let from = {};
  if (queryData.value.id) {
    from = {
      id: queryData.value.id,
    };
  } else if (queryData.value.desk) {
    from = {
      desk: queryData.value.desk,
      isFinish: false,
    };
  }
  if (Object.keys(from).length) {
    let res = await orderApi(from, true);
    if (!res.length) {
      return;
    }
    userMenu.value = res[0];
    if (userMenu.value.desk == queryData.value.desk) {
      btnStutas.value = true;
    }
    queryData.value.id = userMenu.value.id;
    menuList.value.forEach((element) => {
      element.count = 0;
      userMenu.value.orderDetail.forEach((item) => {
        if (element.id == item.id) {
          element.count = item.count;
        }
      });
    });
    cloneData.value = menuList.value.map((v) => v.count);
    setCloneData();
  }
};
const addCloneData = ref([]);
const setCloneData = () => {
  addCloneData.value = JSON.parse(JSON.stringify(menuList.value));
};
onPullDownRefresh(async () => {
  await initOrder();
  uni.stopPullDownRefresh();
});
const orderMsg = async () => {
  console.log(menuList.value);
};
const usefulList = computed(() => {
  return menuList.value.filter((item) => item.count);
});
const isChange = computed(() => {
  return (
    JSON.stringify(cloneData.value) !=
    JSON.stringify(menuList.value.map((v) => v.count))
  );
});
//分类数量统计
const typeNum = computed(() => {
  let obj = {};
  selectList.value.forEach((item) => {
    obj[item.value] = menuList.value
      .filter((i) => {
        return i.type == item.value && i.count;
      })
      .reduce((a, b) => {
        return a + Number(b.count);
      }, 0);
  });

  return obj;
});
const clearSelect = () => {
  menuList.value.forEach((item) => {
    item.count = 0;
  });
};
const updateClone = (data) => {
  console.log(data);
  if (data) {
    menuList.value = data;
  }
  cloneData.value = menuList.value.map((v) => v.count);
};
const search = () => {
  popupOne.value.open();
};
const popupOne = ref(null);
</script>

<template>
  <div class="p-[12px]">
    <uni-easyinput
      clearable
      prefixIcon="search"
      confirmType="搜索"
      v-model="searchValue"
      @blur="search"
      placeholder="请输入关键字"
    >
    </uni-easyinput>
  </div>
  <div class="flex" style="height: calc(100% - 98px)">
    <div class="h-full bg-bg1 w-1/3">
      <ul class="text-text2">
        <li
          class="text-center py-[8px] my-[4px] relative"
          v-for="(item, index) in selectList"
          :class="{ active: item.value == mIndex }"
          :key="index"
          @click="
            mIndex = item.value;
            oIndex = index;
          "
        >
          {{ item.text }}
          <div
            class="absolute left-[4px] top-[8px]"
            v-if="item.value == mIndex"
          >
            <uni-transition
              mode-class="slide-bottom"
              :styles="{
                width: '4px',
                height: '20px',
                backgroundColor: 'red',
              }"
              :show="item.value == mIndex"
              @change="change"
            />
          </div>
          <span
            v-if="typeNum[item.value]"
            class="bg-bg2 text-text4 rounded-md text-12 px-[6px] absolute top-0 right-[2px] scale-[80%]"
            >{{ typeNum[item.value] }}</span
          >
        </li>
      </ul>
    </div>
    <div class="h-full overflow-hidden w-2/3">
      <div
        class="h-full scrollDom"
        :style="{
          transform: `translateY(-${oIndex * 100}%)`,
        }"
      >
        <scroll-view
          scroll-y="true"
          class="h-full"
          :key="item.value"
          v-for="item in selectList"
        >
          <abMenuList
            :list="menuList.filter((i) => i.type == item.value)"
            :disabledBtn="disabledBtn"
          />
        </scroll-view>
      </div>
    </div>
  </div>
  <orderBottom
    :list="usefulList"
    :allList="menuList"
    :backupData="addCloneData"
    :isChange="isChange"
    :queryData="queryData"
    @clear="clearSelect"
    @updateClone="updateClone"
    @initOrder="initOrder"
    @setCloneData="setCloneData"
  />
  <uni-popup ref="popupOne" type="bottom">
    <div class="p-[12px] bg-bg3">
      <abMenuList
        :list="
          menuList.filter((i) =>
            i.name.includes(searchValue ? searchValue : 'qwe12323sdss')
          )
        "
        :disabledBtn="disabledBtn"
      />
    </div>
  </uni-popup>
</template>

<style lang="scss" scoped>
uni-page-body {
  height: 100%;
}
:deep(.uni-easyinput__content-input) {
  height: 30px;
}
ul {
  .active {
    color: #000;
    font-weight: bold;
    background: #fff;
  }
}
.scrollDom {
  transition: all 0.3s;
}
</style>
