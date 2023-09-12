<template>
  <div
    @click="onClickBody"
    class="content"
    :style="{ '--fade-time': `${fadingTimeSeconds}s` }"
  >
    <div class="body">
      <img
        :class="titleClass"
        class="body__title-img"
        src="~/assets/img/chrome-title.png"
        v-if="
          !$store.state.quizInProgress &&
          !showResults &&
          !this.$store.state.quizState
        "
      />
      <Transition name="fade">
        <Body
          v-if="$store.state.quizInProgress"
          :index="currentQuestionIndex"
          @dismiss="dismissQuiz"
        />
      </Transition>
      <Transition name="fade">
        <Results v-if="showResults" />
      </Transition>
    </div>
    <Nav />
  </div>
</template>

<script>
import Body from "~/components/Body.vue";
import Results from "~/components/Results.vue";
import Nav from "../components/Nav.vue";

export default {
  components: {
    Nav,
    Body,
    Results,
  },
  data: () => {
    return {
      introStarted: true,
      introSkipped: false,
      introFinished: false,
      introWaitTimeSeconds: 1,
      introHoldTimeSeconds: 10,
      titleFadingOutTimeout: null,
      startQuizTimeout: null,
      fadingTimeSeconds: 1,
      fadingHoldTimeSeconds: 3,
      titleClass: "",
      showResults: false,
    };
  },
  computed: {
    currentQuestionIndex() {
      return this.$store.state.currentQuestionIndex;
    },
  },
  mounted() {
    setTimeout(() => {
      this.introStarted = true;
      this.titleClass = "fading-in";
    }, this.introWaitTimeSeconds * 1000);

    this.titleFadingOutTimeout = setTimeout(() => {
      this.titleClass = "fading-out";
    }, this.introWaitTimeSeconds * 1000 + this.introHoldTimeSeconds * 1000);

    this.startQuizTimeout = setTimeout(() => {
      this.$store.commit("setQuizInProgress", true);
    }, this.introWaitTimeSeconds * 1000 + this.introHoldTimeSeconds * 1000 + this.fadingTimeSeconds * 1000);
  },
  methods: {
    onClickBody() {
      if (!this.introFinished) {
        this.skipIntro();
      }
    },
    skipIntro() {
      if (!this.introSkipped && this.introStarted) {
        this.introSkipped = true;
        this.introFinished = true;
        clearTimeout(this.titleFadingOutTimeout);
        clearTimeout(this.startQuizTimeout);

        this.titleClass = "fading-out";

        this.startQuizTimeout = setTimeout(() => {
          this.$store.commit("setQuizInProgress", true);
        }, this.fadingTimeSeconds * 1000);
      }
    },
    dismissQuiz() {
      this.$store.commit("setQuizInProgress", false);

      setTimeout(() => {
        this.showResults = true;
      }, this.fadingHoldTimeSeconds + 2 * 1000);
    },
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

  overflow: hidden;

  .body {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    height: 100%;
    width: 76%;

    &__title-img {
      position: relative;
      width: 116%;
      transition: opacity var(--fade-time);
      opacity: 0;
      max-width: none;

      @include desktop {
        width: 80%;
      }

      &.fading-in {
        opacity: 1;
      }

      &.fading-out {
        opacity: 0;
      }
    }

    .results {
      position: relative;
      // position: absolute;
      // top: 50%;
      // left: 50%;
      // transform: translate3d(-50%, -50%, 0);
    }
  }

  .nav {
    position: absolute;
    bottom: 0;
    left: 0;
  }
}

.fade {
  opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 2s !important;
}

.fade-enter-from, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
