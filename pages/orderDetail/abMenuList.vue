<script setup>
import imgErr from "@/static/imgErr.png";
import AbEmpty from "../components/abEmpty.vue";
const props = defineProps({
  list: {
    type: Array,
    default: () => {
      return [];
    },
  },
  disabledBtn: {
    type: Boolean,
    default: false,
  },
});
const error = (item) => {
  item.picImg = imgErr;
};
const showImg = (url) => {
  if (url.includes("imgErr")) return;
  uni.previewImage({
    urls: [url],
  });
};

const change = (item) => {
  uni.$emit("shake");
};
</script>

<template>
  <ul class="w-full">
    <li
      v-for="(item, index) in list"
      :key="index"
      class="flex p-[8px] mb-[12px] w-full mx-[12px] items-center"
      style="border-bottom: 1px solid var(--border_c)"
    >
      <image
        :src="item.picImg || imgErr"
        @error="error(item)"
        @click="showImg(item.picImg)"
        class="w-[60px] h-[60px]"
      />
      <div class="ml-[10px]">
        <p>{{ item.name }}</p>
        <p>
          <span class="text-text3">{{ item.price.toFixed(2) }}</span
          ><span class="text-text2 text-12">/{{ item.unit }}</span>
        </p>
        <uni-number-box
          v-model="item.count"
          :min="0"
          @change="change()"
          :disabled="disabledBtn"
        />
      </div>
    </li>
  </ul>
  <AbEmpty v-if="!list.length" text="暂无数据" />
</template>

<style lang="scss" scoped></style>
