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
  border-radius: 20px;
  padding: 0px 10px;

  border: 3px solid var(--color-white);

  cursor: pointer;

  @include tablet {
    border: 5px solid var(--color-white);
    padding: 20px;
    border-radius: 27px;
    height: 70px;
  }

  @media screen and (min-width: 1100px) {
    height: 84px;
  }

  &.no-hover {
    cursor: auto;
  }

  @media (hover: hover) {
    &:not(.no-hover):hover {
      @media (hover: hover) {
        background-color: var(--color-white);
        -webkit-tap-highlight-color: transparent;
      }
    }
  }
}
</style>