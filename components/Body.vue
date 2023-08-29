<template>
  <div
    class="quiz-body"
    :style="{
      '--fade-time': `${fadeTimeSeconds}s`,
      '--h2-transform': `${h2Transform}%`,
    }"
    ref="quizbody"
  >
    <div class="quiz-body__question">
      <h2 class="hidden">WOULD YOU...</h2>
      <transition name="fade">
        <h2 v-if="!$store.state.quizState" ref="h2">WOULD YOU...</h2>
      </transition>
      <h1 ref="largetext" :class="fadeClass">{{ largeText }}</h1>
    </div>
    <progress-bar :progress="progress" />
    <transition name="fade">
      <div
        v-if="!$store.state.quizState"
        class="quiz-body__answers"
        :class="fadeClass"
      >
        <answer-button
          class="quiz-body__answers__answer quiz-body__answers__answer--yes"
          :class="{ 'no-hover': showEmailForm }"
          @selected="answerSelected(ANSWER_OPTIONS.YES)"
        >
          <div v-if="!showEmailForm">
            {{ yesAnswer }}
          </div>
          <email-form v-else @success="emailSubmittedSuccessfully" />
        </answer-button>
        <answer-button
          class="quiz-body__answers__answer quiz-body__answers__answer--no"
          @selected="answerSelected(ANSWER_OPTIONS.NO)"
        >
          {{ noAnswer }}
        </answer-button>
      </div>
    </transition>
    <div
      :class="fadeClass"
      v-if="$store.state.quizState"
      class="quiz-body__comparison-text"
    >
      {{ subText }}
    </div>
  </div>
</template>
<script>
import { ANSWER_OPTIONS, onWindowResize, QUIZ_STATES } from "~/assets/js/utils";
import AnswerButton from "./AnswerButton.vue";
import EmailForm from "./EmailForm.vue";
import ProgressBar from "./ProgressBar.vue";
import { Howl, Howler } from "howler";
import { CaptchaMixin } from "~/assets/js/mixins/recaptcha";

const FADE_CLASSES = {
  FADE_IN: "fade-in",
  FADE_OUT: "fade-out",
};
export default {
  mixins: [CaptchaMixin],
  transition: "fade",
  components: { ProgressBar, AnswerButton, EmailForm },
  props: {
    index: {
      required: true,
      type: Number,
    },
  },
  watch: {
    "$store.state.muted"(isMuted) {
      Howler.mute(isMuted);
    },
  },
  data: () => {
    const loserSound = new Howl({
      src: [`/sound/loser.mp3`],
      loop: false,
      volume: 0.5,
      autoplay: false,
    });

    const winnerSound = new Howl({
      src: [`/sound/winning.mp3`],
      loop: false,
      volume: 0.5,
      autoplay: false,
    });
    return {
      ANSWER_OPTIONS: ANSWER_OPTIONS,
      showEmailForm: false,
      email: "",
      fadeClass: "",
      fadeTimeSeconds: 2,
      fadeHoldTimeSeconds: 2,
      finalStateHoldTimeSeconds: 5,
      h2Transform: 0,
      unlisten: [],
      loserSound,
      winnerSound,
      numberOfNos: 0,
    };
  },
  computed: {
    largeText() {
      if (this.$store.state.quizState == QUIZ_STATES.FAILED) {
        return "you failed. guess you didnt want it enough.";
      } else if (this.$store.state.quizState == QUIZ_STATES.PASSED) {
        return "congrats! you achieved your dream!";
      } else {
        return this.question;
      }
    },
    subText() {
      if (this.$store.state.quizState == QUIZ_STATES.FAILED) {
        return `${this.$store.state.currentPeopleSucceededPercentage}% of people surpassed you`;
      } else if (this.$store.state.quizState == QUIZ_STATES.PASSED) {
        return `${this.$store.state.currentPeopleFailedPercentage}% of people failed behind you`;
      } else {
        return "";
      }
    },
    id() {
      return this.$store.state.questions[this.index].id;
    },
    question() {
      return this.$store.state.questions[this.index].question;
    },
    yesAnswer() {
      return this.$store.state.questions[this.index].answers.yes;
    },
    noAnswer() {
      return this.$store.state.questions[this.index].answers.no;
    },
    progress() {
      return Math.ceil((this.index / this.$store.state.questions.length) * 100);
    },
  },
  methods: {
    async answerSelected(answer) {
      if (!this.showEmailForm) {
        // NB: Submit answer
        const recaptcha = await this.getRecaptcha();
        if (recaptcha) {
          console.log(this.id);
          const answeredYes = answer == ANSWER_OPTIONS.YES;
          const resp = await this.$store.getters
            .postResponse(this.id, answeredYes, recaptcha)
            .then((resp) => resp.json())
            .catch((err) => {
              console.log(err);
              return {
                no: 26,
                yes: 54,
              };
            });

          var finalResp = resp;
          if (resp.errors) {
            finalResp = {
              no: 26,
              yes: 54,
            };
          }

          this.numberOfNos = this.numberOfNos + finalResp.no;
          const currentFailedPercentage =
            Math.ceil(
              ((this.numberOfNos / (finalResp.yes + this.numberOfNos)) * 100) /
                10
            ) * 10;
          this.$store.commit(
            "setCurrentPeopleFailedPercentage",
            currentFailedPercentage
          );

          const currentSucceededPercentage =
            Math.ceil(
              ((finalResp.yes / (finalResp.yes + finalResp.no)) * 100) / 10
            ) * 10;
          this.$store.commit(
            "setCurrentPeopleSucceededPercentage",
            currentSucceededPercentage
          );
        }
        if (answer == ANSWER_OPTIONS.YES) {
          if (this.index == 0) {
            // NB: Show email form
            this.showEmailForm = true;
          } else {
            this.winnerSound.play();
            if (this.index < this.$store.state.questions.length - 1) {
              this.fadeClass = FADE_CLASSES.FADE_OUT;
              setTimeout(() => {
                this.$store.commit("setCurrentQuestionIndex", this.index + 1);
              }, this.fadeTimeSeconds * 1000);

              setTimeout(() => {
                this.updateH2Transform();
              }, this.fadeTimeSeconds * 1000 + (this.fadeHoldTimeSeconds / 2) * 1000);

              setTimeout(() => {
                this.fadeClass = FADE_CLASSES.FADE_IN;
              }, this.fadeTimeSeconds * 1000 + this.fadeHoldTimeSeconds * 1000);
            } else {
              this.triggerSuccess();
            }
          }
        } else {
          // TODO: failed state
          this.loserSound.play();
          this.triggerFailure();
        }
      }
    },
    emailSubmittedSuccessfully() {
      this.fadeClass = FADE_CLASSES.FADE_OUT;
      this.winnerSound.play();

      setTimeout(() => {
        this.$store.commit("setCurrentQuestionIndex", this.index + 1);
      }, this.fadeTimeSeconds * 1000);

      setTimeout(() => {
        this.updateH2Transform();
      }, this.fadeTimeSeconds * 1000 + (this.fadeHoldTimeSeconds / 2) * 1000);

      setTimeout(() => {
        this.showEmailForm = false;
        this.fadeClass = FADE_CLASSES.FADE_IN;
      }, this.fadeTimeSeconds * 1000 + this.fadeHoldTimeSeconds * 1000);
    },
    updateH2Transform() {
      if (!this.$store.state.quizState) {
        const h2Dims = this.$refs.h2.getBoundingClientRect();
        const textDims = this.$refs.largetext.getBoundingClientRect();

        const h2Height = h2Dims.height;
        const textHeight = textDims.height;

        this.h2Transform = -1 * (textHeight / h2Height) * 100;
      }
    },
    triggerFailure() {
      this.fadeClass = FADE_CLASSES.FADE_OUT;
      setTimeout(() => {
        this.$store.commit("setQuizState", QUIZ_STATES.FAILED);
      }, this.fadeTimeSeconds * 1000);

      setTimeout(() => {
        this.showEmailForm = false;
        this.fadeClass = FADE_CLASSES.FADE_IN;
      }, this.fadeTimeSeconds * 1000 + this.fadeHoldTimeSeconds * 1000);

      setTimeout(() => {
        this.$emit("dismiss");
      }, this.fadeTimeSeconds * 1000 + this.fadeHoldTimeSeconds * 1000 + this.finalStateHoldTimeSeconds * 1000);
    },
    triggerSuccess() {
      this.fadeClass = FADE_CLASSES.FADE_OUT;
      setTimeout(() => {
        this.$store.commit("setQuizState", QUIZ_STATES.PASSED);
        this.$store.commit("setCurrentQuestionIndex", this.index + 1);
      }, this.fadeTimeSeconds * 1000);

      setTimeout(() => {
        this.showEmailForm = false;
        this.fadeClass = FADE_CLASSES.FADE_IN;
      }, this.fadeTimeSeconds * 1000 + this.fadeHoldTimeSeconds * 1000);

      setTimeout(() => {
        this.$emit("dismiss");
      }, this.fadeTimeSeconds * 1000 + this.fadeHoldTimeSeconds * 1000 + this.finalStateHoldTimeSeconds * 1000);
    },
  },
  mounted() {
    this.fadeClass = FADE_CLASSES.FADE_IN;
    this.updateH2Transform();

    this.unlisten = [onWindowResize(this.updateH2Transform)];
  },
  beforeDestroy() {
    this.unlisten.forEach((cb) => cb());
  },
};
</script>
<style lang="scss" scoped>
.quiz-body {
  position: relative;
  width: 100%;

  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 100%;
  gap: 55px;

  @include tablet {
    gap: 69px;
  }

  .fade-in {
    opacity: 1;
    transition: all var(--fade-time);
  }

  .fade-out {
    opacity: 0;
    transition: all var(--fade-time);
  }

  &__question {
    position: relative;
    transition: all 0.5s;
    align-self: flex-end;

    h1,
    h2 {
      font-family: "Basica";
      text-align: center;

      color: var(--color-white);
      text-shadow: 0px 5px 48px rgba(255, 220, 255, 0.7),
        0px -2px 19px rgba(255, 120, 255, 0.6);
    }

    h2 {
      position: absolute;

      bottom: 0;
      left: 50%;

      font-size: 16px;
      letter-spacing: 3px;

      transform: translate3d(-50%, var(--h2-transform), 0);

      transition: transform var(--fade-time);

      white-space: nowrap;

      @include tablet {
        font-size: 30px;
        margin: 0 0 8px 0;
      }

      &.hidden {
        opacity: 0;
        position: relative;
        bottom: auto;
        left: auto;
        transform: none;
      }

      &.fade-in {
        opacity: 1;
        transition: opacity var(--fade-time-short);
      }
    }

    h1 {
      opacity: 0;
      font-size: 30px;
      line-height: 35px;
      margin: 0;

      @include tablet {
        font-size: 60px;
        letter-spacing: 4px;
        line-height: 65px;
      }
    }
  }

  &__answers {
    position: relative;
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    opacity: 0;

    align-self: flex-start;

    @include tablet {
      flex-direction: row;
    }

    @media (hover: hover) {
      .quiz-body__answers__answer:not(.no-hover):hover {
        color: var(--color-emerald);
        text-shadow: none;
      }
    }

    &__answer {
      color: var(--color-white);
      text-shadow: 0px 5px 48px rgba(255, 220, 255, 0.7),
        0px -2px 19px rgba(255, 120, 255, 0.6);

      flex: 0 0 60px;
      width: 100%;

      @include tablet {
        flex: 1 0 50% - 17.5;
        width: auto;
      }

      &--yes {
        margin: 0 0 20px 0;

        @include tablet {
          margin: 0 35px 0 0;
        }
      }
    }

    .answer-btn {
      font-size: 16px;

      @include tablet {
        font-size: 18px;
      }

      @media screen and (min-width: 1100px) {
        font-size: 25px;
      }

      @media screen and (min-width: 1300px) {
        font-size: 30px;
      }
    }
  }

  &__comparison-text {
    position: relative;
    text-align: center;
    color: var(--color-white);
    text-shadow: 0px 5px 48px rgba(255, 220, 255, 0.7),
      0px -2px 19px rgba(255, 120, 255, 0.6);

    font-size: 16px;

    align-self: flex-start;

    @include tablet {
      font-size: 30px;
    }

    @include desktop {
      font-size: 40px;
    }
  }

  .progress-bar {
    position: absolute;

    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
  }
}

.fade {
  opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>