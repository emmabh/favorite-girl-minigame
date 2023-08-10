<template>
  <button class="answer-btn" @click="$emit('selected')">
    <slot />
  </button>
</template>
<script>
export default {};
</script>
<style lang="scss">
.answer-btn {
  position: relative;
  height: 84px;

  background-color: transparent;
  outline: none;

  border-radius: 27px;
  border: 5px solid var(--color-white);

  cursor: pointer;

  padding: 20px;

  &.no-hover {
    cursor: auto;
  }

  &:not(.no-hover):hover {
    background-color: var(--color-white);
  }
}
</style>