<template>
  <transition name="fade">
    <div class="quiz-body" :style="{ '--fade-time': `${fadeTimeSeconds}s` }">
      <h2
        :class="fadeClass"
        :style="{ '--fade-time-short': `${fadeTimeSeconds - 1}s` }"
      >
        WOULD YOU...
      </h2>
      <h1 :class="fadeClass">{{ largeText }}</h1>
      <progress-bar :progress="progress" />
      <div class="quiz-body__answers" :class="fadeClass">
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
    </div>
  </transition>
</template>
<script>
import { ANSWER_OPTIONS, QUIZ_STATES } from "~/assets/js/utils";
import AnswerButton from "./AnswerButton.vue";
import EmailForm from "./EmailForm.vue";
import ProgressBar from "./ProgressBar.vue";
const FADE_CLASSES = {
  FADE_IN: "fade-in",
  FADE_OUT: "fade-out",
};
export default {
  components: { ProgressBar, AnswerButton, EmailForm },
  props: {
    index: {
      required: true,
      type: Number,
    },
  },
  data: () => {
    return {
      ANSWER_OPTIONS: ANSWER_OPTIONS,
      showEmailForm: false,
      email: "",
      fadeClass: "",
      fadeTimeSeconds: 2,
      fadeHoldTimeSeconds: 1,
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
    answerSelected(answer) {
      if (!this.showEmailForm) {
        if (answer == ANSWER_OPTIONS.YES) {
          if (this.index == 0) {
            // NB: Show email form
            this.showEmailForm = true;
          } else {
            if (this.index < this.$store.state.questions.length - 1) {
              this.fadeClass = FADE_CLASSES.FADE_OUT;

              setTimeout(() => {
                this.$store.commit("setCurrentQuestionIndex", this.index + 1);
                this.fadeClass = FADE_CLASSES.FADE_IN;
              }, this.fadeTimeSeconds * 1000 + this.fadeHoldTimeSeconds * 1000);
            } else {
              // TODO: WINNER STATE
            }
          }
        } else {
          // TODO: failed state
        }
      }
    },
    emailSubmittedSuccessfully() {
      this.fadeClass = FADE_CLASSES.FADE_OUT;

      setTimeout(() => {
        this.showEmailForm = false;
        this.$store.commit("setCurrentQuestionIndex", this.index + 1);
        this.fadeClass = FADE_CLASSES.FADE_IN;
      }, this.fadeTimeSeconds * 1000 + this.fadeHoldTimeSeconds * 1000);
    },
  },
  mounted() {
    this.fadeClass = FADE_CLASSES.FADE_IN;
  },
};
</script>
<style lang="scss" scoped>
.quiz-body {
  position: relative;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .fade-in {
    opacity: 1;
    transition: opacity var(--fade-time);
  }

  .fade-out {
    opacity: 0;
    transition: opacity var(--fade-time);
  }

  h1,
  h2 {
    font-family: "Basica";
    text-align: center;

    color: var(--color-white);
    text-shadow: 0px 5px 48px rgba(255, 220, 255, 0.7),
      0px -2px 19px rgba(255, 120, 255, 0.6);
  }

  h2 {
    letter-spacing: 3px;
    &.fade-in {
      opacity: 1;
      transition: opacity var(--fade-time-short);
    }

    @include tablet {
      font-size: 30px;
      margin: 0 0 8px 0;
    }
  }

  h1 {
    opacity: 0;
    @include tablet {
      font-size: 60px;
      letter-spacing: 4px;

      margin: 0 0 27px 0;
    }
  }

  &__answers {
    position: relative;
    width: 100%;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    opacity: 0;

    .quiz-body__answers__answer:not(.no-hover):hover {
      color: var(--color-emerald);
      text-shadow: none;
    }

    &__answer {
      color: var(--color-white);
      text-shadow: 0px 5px 48px rgba(255, 220, 255, 0.7),
        0px -2px 19px rgba(255, 120, 255, 0.6);

      flex: 1 0 50%;
      &--yes {
        @include tablet {
          margin: 0 35px 0 0;
        }
      }
    }

    .answer-btn {
      @include tablet {
        font-size: 30px;
      }
    }
  }
}

.fade {
  opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>