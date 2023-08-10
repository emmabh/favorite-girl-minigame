<template>
  <div class="content" :style="{ '--fade-time': `${fadingTimeSeconds}s` }">
    <div class="body">
      <img
        :class="titleClass"
        class="body__title-img"
        src="~/assets/img/chrome-title.png"
        v-if="!$store.state.quizInProgress"
      />
      <Body v-if="$store.state.quizInProgress" :index="currentQuestionIndex" />
    </div>
    <Nav />
  </div>
</template>

<script>
import Body from "~/components/Body.vue";
import Nav from "../components/Nav.vue";

export default {
  components: {
    Nav,
    Body,
  },
  data: () => {
    return {
      introWaitTimeSeconds: 1,
      fadingTimeSeconds: 1,
      fadingHoldTimeSeconds: 3,
      titleClass: "",
    };
  },
  computed: {
    currentQuestionIndex() {
      return this.$store.state.currentQuestionIndex;
    },
  },
  mounted() {
    setTimeout(() => {
      this.titleClass = "fading-in";
    }, this.introWaitTimeSeconds * 1000);

    setTimeout(() => {
      this.titleClass = "fading-out";
    }, this.introWaitTimeSeconds * 1000 + this.fadingHoldTimeSeconds * 1000);

    setTimeout(() => {
      this.$store.commit("setQuizInProgress", true);
    }, this.introWaitTimeSeconds * 1000 + this.fadingHoldTimeSeconds * 1000 + this.fadingTimeSeconds * 1000);
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

  .body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    width: 76%;

    &__title-img {
      width: 58%;
      transition: opacity var(--fade-time);
      opacity: 0;

      &.fading-in {
        opacity: 1;
      }

      &.fading-out {
        opacity: 0;
      }
    }
  }

  .nav {
    position: absolute;
    bottom: 0;
  }
}
</style>
