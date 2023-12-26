<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
});
const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <div>
    <input
      class="uni-input"
      focus
      placeholder="自动获得焦点"
      @input="emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<style lang="scss" scoped></style>
