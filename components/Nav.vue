<template>
  <div class="nav">
    <div class="nav__left">
      <a
        class="nav__left__ig"
        href="https://www.instagram.com/izzyraye_/"
        target="_blank"
      >
        <img class="nav__left__ig__img" src="~/assets/img/ig.png" />
      </a>
      <a
        class="nav__left__spotify"
        href="https://open.spotify.com/artist/6Rk8ElaHFHI5oxqsaOHWAo?si=SeRxX4SBRkmiENaLb5en9g"
        target="_blank"
      >
        <img class="nav__left__spotify__img" src="~/assets/img/spotify.png" />
      </a>
    </div>
    <img class="nav__presented-by" src="~/assets/img/presented-by.png" />
    <div class="nav__right">
      <button class="nav__right__volume-btn" @click="toggleSound">
        <img class="nav__right__volume-btn__img" :src="volumeSrc" />
      </button>
    </div>
  </div>
</template>
<script>
import { BreakPointMixin } from "~/assets/js/mixins/breakpoints";

export default {
  mixins: [BreakPointMixin],
  computed: {
    volumeSrc() {
      return !this.$store.state.muted
        ? require("~/assets/img/volume-on.png")
        : require("~/assets/img/volume-off.png");
    },
  },
  methods: {
    toggleSound() {
      this.$store.commit("setMuted", !this.$store.state.muted);
    },
  },
};
</script>
<style lang="scss" scoped>
.nav {
  width: calc(100% - 48px);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 24px 30px;

  @include tablet {
    justify-content: space-between;
  }

  &__left {
    position: fixed;
    top: 20px;
    left: 20px;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    @include tablet {
      position: relative;
      top: auto;
      left: auto;
    }

    &__ig {
      margin: 0 13px 0 0;
      cursor: pointer;

      &__img {
        width: 30px;
        height: 30px;

        @include tablet {
          width: 39px;
          height: 39px;
        }
      }
    }

    &__spotify {
      cursor: pointer;

      &__img {
        width: 30px;
        height: 29px;

        @include tablet {
          width: 42px;
          height: 41px;
        }
      }
    }
  }

  &__presented-by {
    width: 78%;

    @include tablet {
      width: 532px;
    }
  }

  &__right {
    position: fixed;
    top: 20px;
    right: 20px;

    @include tablet {
      position: relative;
      top: auto;
      left: auto;
    }
    &__volume-btn {
      cursor: pointer;

      width: 35px;
      height: 30px;

      padding: 0;

      outline: none;
      border: none;
      background-color: transparent;

      @include tablet {
        width: 51px;
        height: 44px;
      }

      &__img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>