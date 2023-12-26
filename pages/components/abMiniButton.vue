<script setup>
const props = defineProps({
  icon: {
    type: String,
    default: "",
  },
  iconSize: {
    type: Number,
    default: 14,
  },
  iconColor: {
    type: String,
    default: "#fff",
  },
  type: {
    type: String,
    default: "primary",
  },
  plain: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <button
    size="mini"
    :type="type"
    class=""
    :plain="plain"
    style="line-height: normal; font-size: 12px; padding: 3px 6px"
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
