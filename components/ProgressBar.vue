<template>
  <div class="progress-bar">
    <div class="progress-bar__bg" />
    <div
      class="progress-bar__bar"
      :style="{ '--percentage': `${progress}%` }"
    />
  </div>
</template>
<script>
export default {
  props: {
    progress: {
      required: true,
      type: Number,
    },
  },
};
</script>
<style lang="scss" scoped>
.progress-bar {
  position: relative;
  height: 9px;
  width: 100%;

  margin: 0 0 33px 0;

  &__bg {
    position: absolute;
    top: 0;
    left: 0;

    height: 100%;
    width: 100%;

    background-image: url(~/assets/img/bar-left.png),
      url(~/assets/img/bar-middle.png), url(~/assets/img/bar-right.png);
    background-size: 9px 9px, calc(100% - 18px) 9px, 9px 9px;
    background-position: left top, center top, right top;
    background-repeat: no-repeat, no-repeat, no-repeat;
  }

  &__bar {
    position: absolute;
    top: 0;
    left: 0;

    height: 100%;
    width: var(--percentage);

    background-color: var(--color-white);

    border-radius: 9px;

    transition: all 0.5s;
  }
}
</style>