<script setup>
import { ref, watch } from "vue";
const emit = defineEmits(["update:modelValue"]);
const props = defineProps(["list", "modelValue"]);
const modelValue = ref(props.modelValue);
watch(
  () => props.modelValue,
  (val) => {
    modelValue.value = val;
  }
);
const select = (item) => {
  modelValue.value = item.value;
  emit("update:modelValue", item.value);
};
</script>

<template>
  <ul class="flex justify-start p-0">
    <li
      class="flex items-center cursor-pointer mr-[8rpx]"
      :class="{ active: item.value === modelValue }"
      v-for="item in list"
      @click="select(item)"
    >
      <uni-icons
        :type="item.value === modelValue ? 'circle-filled' : 'circle'"
        color=""
        size="18"
      /><text>{{ item.label || item.text }}</text>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
.active {
  color: #e43d33;
}
</style>
