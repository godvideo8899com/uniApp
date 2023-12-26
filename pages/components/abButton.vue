<script setup>
const props = defineProps({
  icon: {
    type: String,
    default: "",
  },
  iconSize: {
    type: Number,
    default: 18,
  },
  iconColor: {
    type: String,
    default: "#fff",
  },
});
</script>

<template>
  <button
    size="default"
    type="warn"
    class="py-[12rpx]"
    style="line-height: normal; font-size: 14px"
  >
    <view class="flex items-center justify-center"
      ><uni-icons
        :type="icon"
        :color="iconColor"
        :size="iconSize"
        class="mr-[2px]"
      />
      <slot></slot>
    </view>
  </button>
</template>

<style lang="scss" scoped></style>
