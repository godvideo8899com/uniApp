<script setup>
const props = defineProps({
  modelValue: {
    type: Number,
    default: 1,
  },
  selectList: {
    type: Array,
    default: [],
  },
  label: {
    type: String,
    default: "",
  },
});
const emit = defineEmits(["update:modelValue"]);
const onchange = (e) => {
  emit("update:modelValue", props.selectList[e.detail.value].value);
};
</script>

<template>
  <div>
    <picker @change="onchange" :range="selectList.map((e) => e.text)">
      <view
        class="flex py-[6px] px-[8px] rounded-[4px]"
        style="border: 1px solid var(--border_c)"
      >
        <view class="mr-[10px]" v-if="label">{{ label }}:</view>
        <view class="uni-input text-text2">{{
          selectList.find((e) => e.value == modelValue).text
        }}</view>
      </view>
    </picker>
  </div>
</template>

<style lang="scss" scoped></style>
