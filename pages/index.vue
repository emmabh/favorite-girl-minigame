<template>
  <div class="content">
    <div class="body">
      <img class="body__title-img" src="~/assets/img/chrome-title.png" />
    </div>
    <Nav />
  </div>
</template>

<script>
import Nav from "../components/Nav.vue";

export default {
  components: {
    Nav,
  },
};
</script>

<style lang="scss" scoped>
.content {
  position: relative;
  width: 100%;
  height: calc(var(--vh, 1vh) * 100);

  background-image: url(~/assets/img/bg.png);
  background-repeat: no-repeat;
  background-size: cover;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  padding: 24px 30px;

  .body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &__title-img {
      width: 58%;
    }
  }

  .nav {
    position: absolute;
    bottom: 0;
  }
}
</style>
