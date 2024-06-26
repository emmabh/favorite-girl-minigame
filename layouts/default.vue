<template>
  <div>
    <nuxt />
  </div>
</template>

<script>
import smoothscroll from "smoothscroll-polyfill";
import { registerBootlegVH } from "~/assets/js/utils";
import { BreakPointSet } from "~/assets/js/mixins/breakpoints";

export default {
  mixins: [BreakPointSet],
  data() {
    return {};
  },
  computed: {
    currentRoute() {
      return this.$route.path;
    },
  },
  mounted: function () {
    smoothscroll.polyfill();

    registerBootlegVH();
    // prevent the add to home screen banner
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
    });
  },
  methods: {
    onPreloaderDisappear() {
      this.$store.commit("setPreloaderActive", false);
    },
  },
};
</script>
<style lang="scss">
@import "~assets/scss/parts/fonts";

:root {
  --color-white: #fff;
  --color-black: #000;
  --color-emerald: #003936;

  --color-text: var(--color-black);
  --color-bg: var(--color-emerald);

  --font-size-x-small: 10px;
  --font-size-small: 12px;
  --font-size-normal: 16px;
  --font-size-medium: 21px;
  --font-size-large: 24px;
  --font-size-x-large: 36px;
  --font-size-xx-large: 46px;
  --font-size-xxx-large: 56px;

  --font-family-body: "Basica";
  --font-family-headline: "Basica";

  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;
  --font-weight-extra-bold: 900;

  --text-shadow: 0px 0px 10px rgba(255, 220, 255, 0.3),
    0px 0px 10px rgba(255, 220, 255, 0.3);

  @include tablet {
    --text-shadow: 0px 5px 48px rgba(255, 220, 255, 0.7),
      0px -2px 19px rgba(255, 150, 255, 0.5);
  }

  @for $i from 1 through 20 {
    --size-unit-#{$i}: #{$i * 5px};
  }
}

// ::-webkit-scrollbar {
//   width: 0px; /* remove scrollbar space */
//   background: transparent; /* optional: just make scrollbar invisible */
// }

*,
*:before,
*:after {
  box-sizing: border-box;
}

html {
  font-family: var(--font-family-body);
  font-size: var(--font-size-normal);
  color: var(--color-text);

  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;

  background-color: var(--color-bg);

  line-height: 1.25;
}

input,
button {
  font-family: inherit;
  font-weight: inherit;
}

html,
body {
  width: 100%;
  min-height: 100%;
}

.visually-hidden {
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
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

.fade-fast {
  opacity: 1;
}

.fade-fast-enter-active,
.fade-fast-leave-active {
  transition: opacity 0.5s;
}
.fade-fast-enter, .fade-fast-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

img {
  max-width: 100%;
}

.grecaptcha-badge {
  visibility: hidden;
}
</style>
