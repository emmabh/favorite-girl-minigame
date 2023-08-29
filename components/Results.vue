<template>
  <div class="results">
    <div class="results__text">
      <div class="results__text__outer">
        It<span style="font-family: Arial">'</span>s never official until you
        share it with the world
      </div>
    </div>
    <div class="results__buttons">
      <a
        class="results__buttons__button results__buttons__button--download"
        :href="downloadImgLocation"
        download="favorite-girl"
      >
        <img
          class="results__buttons__button--download__img"
          src="~/assets/img/download.png"
        />
      </a>
      <a
        class="results__buttons__button results__buttons__button--twitter"
        :href="tweetLink"
        target="_blank"
      >
        <img
          class="results__buttons__button--twitter__img"
          src="~/assets/img/twitter.png"
        />
      </a>
      <button
        @click="share"
        class="results__buttons__button results__buttons__button--share"
        v-if="canShare"
      >
        <img
          class="results__buttons__button--share__img"
          src="~/assets/img/send.png"
        />
      </button>
    </div>
    <div class="results__shareable"><img :src="shareableImgSrc" /></div>
  </div>
</template>
<script>
import { QUIZ_STATES } from "~/assets/js/utils";
export default {
  data: () => {
    return {
      baseTweetLink: "https://twitter.com/intent/tweet?text=",
    };
  },
  computed: {
    shareableImgSrc() {
      if (this.$store.state.quizState == QUIZ_STATES.FAILED) {
        return require("~/assets/img/results/loser.jpg");
      } else {
        return require(`~/assets/img/results/winner-${this.$store.state.currentPeopleFailedPercentage}.jpg`);
      }
    },
    downloadImgLocation() {
      if (this.$store.state.quizState == QUIZ_STATES.FAILED) {
        return `/img/results/loser.jpg`;
      } else {
        return `/img/results/winner-${this.$store.state.currentPeopleFailedPercentage}.jpg`;
      }
    },
    shareText() {
      if (this.$store.state.quizState == QUIZ_STATES.FAILED) {
        return "I failed at achieving my dream. See if you'd beat me";
      } else {
        return `I beat ${this.$store.state.currentPeopleFailedPercentage}% of people to achieve my dream. See if you'd beat me`;
      }
    },
    tweetLink() {
      if (this.$store.state.quizState == QUIZ_STATES.FAILED) {
        return `${this.baseTweetLink}${encodeURIComponent(
          this.shareText + " https://favorite-girl.com"
        )}`;
      } else {
        return `${this.baseTweetLink}${encodeURIComponent(
          this.shareText + " https://favorite-girl.com"
        )}`;
      }
    },
    canShare() {
      return navigator.canShare;
    },
  },
  methods: {
    async share() {
      if (navigator.canShare) {
        const response = await fetch(this.downloadImgLocation);
        const blob = await response.blob();
        const filesArray = [
          new File([blob], "favorite-girl.jpg", {
            type: "image/jpeg",
            lastModified: new Date().getTime(),
          }),
        ];
        const shareData = {
          files: filesArray,
          text: this.shareText,
          url: "https://favorite-girl.com",
        };
        try {
          await navigator.share(shareData);
        } catch (err) {
          // Nothing;
          console.log(err);
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.results {
  display: grid;
  gap: 30px;
  width: 81%;
  height: 77%;

  grid-template-columns: 100%;
  grid-auto-rows: auto 60px minmax(0, 1fr);

  @include desktop {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;

    width: 75%;
    height: 73%;

    gap: 50px;
  }

  &__text {
    color: var(--color-white);
    display: flex;
    justify-content: flex-end;
    font-size: 40px;
    text-align: center;

    @include desktop {
      grid-row-start: 1;
      grid-row-end: 1;
      grid-column-start: 1;
      grid-column-end: 1;

      text-shadow: 0px 5px 48px rgba(255, 220, 255, 0.7),
        0px -2px 19px rgba(255, 120, 255, 0.6);
      text-align: left;

      align-items: flex-end;
    }
  }

  &__buttons {
    display: flex;

    flex-direction: row;
    justify-content: center;
    align-items: center;

    @include desktop {
      grid-row-start: 2;
      grid-row-end: 2;
      grid-column-start: 1;
      grid-column-end: 1;
      justify-content: flex-start;
      align-items: flex-start;
    }

    &:last-child {
      margin: 0;
    }

    &__button {
      outline: none;
      background: transparent;
      border: none;
      cursor: pointer;

      height: 60px;

      margin: 0 25px 0 0;

      @include desktop {
        height: 60px;
        margin: 0 25px 0 0;
      }

      img {
        height: 100%;
        width: auto;
      }
    }
  }

  &__shareable {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    grid-column-start: 1;
    grid-column-end: 1;
    grid-row-start: 3;
    grid-row-end: 3;
    @include desktop {
      grid-row-start: 1;
      grid-row-end: 3;
      grid-column-start: 2;
      grid-column-end: 2;
    }

    img {
      height: 100%;
      width: auto;
      object-fit: contain;
    }
  }
}
</style>