<template>
  <button class="answer-btn" @click="$emit('selected')" :class="{ selected }">
    <slot />
  </button>
</template>
<script>
export default {
  props: {
    selected: {
      default: false,
      type: Boolean,
    },
  },
};
</script>
<style lang="scss">
.answer-btn {
  position: relative;
  height: 84px;

  background-color: transparent;
  outline: none;
  border-radius: 20px;
  padding: 0px 20px;

  border: 3px solid var(--color-white);

  cursor: pointer;
  letter-spacing: 0.5px;

  @include tablet {
    border: 5px solid var(--color-white);
    padding: 20px;
    border-radius: 27px;
    height: 70px;
  }

  @media screen and (min-width: 1130px) {
    height: 84px;
  }

  &.no-hover {
    cursor: auto;
  }

  &.disabled {
    pointer-events: none;
    cursor: auto;
  }

  &.selected {
    color: var(--color-emerald) !important;
    text-shadow: none !important;
    background-color: var(--color-white);
  }

  @media (hover: hover) {
    &:not(.no-hover):not(.disabled):hover {
      @media (hover: hover) {
        color: var(--color-emerald);
        text-shadow: none;
        background-color: var(--color-white);
        -webkit-tap-highlight-color: transparent;
      }
    }
  }
}
</style>