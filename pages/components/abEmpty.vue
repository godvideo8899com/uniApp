<script setup>
const props = defineProps({
  text: {
    type: String,
    default: "暂无数据",
  },
});
console.log(props);
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <img
      class="w-3/5"
      src="https://static-ftcms.jd.com/p/files/61a9e3183985005b3958672b.png"
      alt=""
      srcset=""
    />
    <p class="text-gray-400 text-[28rpx]">{{ text }}</p>
  </div>
</template>

<style lang="scss" scoped></style>
