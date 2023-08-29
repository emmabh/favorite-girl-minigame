<template>
  <div class="email-form">
    <form @submit="onSubmit">
      <input
        v-if="!success"
        class="email-form__input"
        :value="email"
        placeholder="you@example.com"
        type="text"
        name="email"
        :disabled="busy || success"
      />
      <span v-else>SUCCESS</span>
      <button
        v-if="!success"
        :disabled="busy || success"
        class="email-form__submit-btn"
      >
        <Arrow />
      </button>
    </form>
    <div v-if="error" class="email-form__error">
      {{ error }}
    </div>
  </div>
</template>
<script>
import { validate } from "email-validator";
import { CaptchaMixin } from "~/assets/js/mixins/recaptcha";
import { formToObject } from "~/assets/js/utils";
import Arrow from "~/assets/img/arrow.svg?inline";

const ERROR = {
  INVALID_REQUEST: "subscriptions/invalid-request",
  AUTH: "auth/verification-failed",
  ADD_FAILED: "subscriptions/add-to-list-failed",
  INTERNAL: "subscriptions/invalid-status",
  INTERNAL_LIST: `subscriptions/remove-from-list-failed`,
  INVALID_ACTION: `subscriptions/invalid-action`,
  INVALID_EMAIL: `frontend/invalid-email`,
  DEFAULT: `frontend/default`,
};

const ERROR_MESSAGE = {
  [ERROR.INVALID_REQUEST]: `Make sure you e-mail is filled out`,
  [ERROR.INVALID_EMAIL]: `Please input a valid e-mail`,
  [ERROR.DEFAULT]: `Please try again`,
};

/**
 *
 */
const isKnownError = (msg) => {
  return Object.values(ERROR).includes(msg);
};

/**
 * If we have a custom error message attached to this specific error message
 * use it, otherwise deliver a default one
 */
const getErrorMessage = (msg, defaultError = "There was an error") => {
  return isKnownError(msg) && msg in ERROR_MESSAGE
    ? ERROR_MESSAGE[msg]
    : defaultError;
};

export default {
  components: { Arrow },
  mixins: [CaptchaMixin],
  data: () => {
    return {
      email: "",
      error: null,
      busy: false,
      success: false,
      defaultError: `Please try again`,
    };
  },
  watch: {
    success(isSuccessful) {
      if (isSuccessful) {
        setTimeout(() => {
          this.$emit("success");
        }, 1000);
      }
    },
  },
  methods: {
    async onSubmit(e) {
      // TODO: Submit email
      e.preventDefault();

      if (this.busy) {
        return;
      }

      const formData = formToObject(e.target);

      this.error = null;

      try {
        const recaptcha = await this.getRecaptcha();

        if (!recaptcha) {
          throw new Error(ERROR.DEFAULT);
        }

        const submitData = {
          ...formData,
          recaptcha,
        };

        this.busy = true;
        console.log(submitData.email);
        if (!validate(submitData.email)) {
          throw new Error(ERROR.INVALID_EMAIL);
        }

        const resp = await this.$store.getters
          .subscribeToList(submitData.email, recaptcha)
          .then((resp) => resp.json());

        if (resp.errors) {
          this.addError(
            getErrorMessage(resp.errors[0].message, this.defaultError)
          );
        } else {
          this.success = true;
        }
      } catch (e) {
        this.addError(getErrorMessage(e.message, this.defaultError));
      } finally {
        this.busy = false;
      }
    },
    addError(msg) {
      this.error = msg;
    },
  },
};
</script>
<style lang="scss" scoped>
.email-form {
  form {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .email-form__input {
      position: relative;
      margin: 0 10px 0 0;

      outline: none;
      border: none;
      background-color: transparent;

      color: var(--color-emerald);

      flex: 1 0 auto;

      &::placeholder {
        color: var(--color-emerald);
        opacity: 0.5;
      }
    }

    .email-form__submit-btn {
      position: relative;
      border: none;
      outline: none;
      background-color: transparent;

      color: var(--color-emerald);

      padding: 0;

      cursor: pointer;

      width: 20px;
      height: 18px;

      @include tablet {
        width: 27px;
        height: 24px;
        object-fit: fill;
      }

      &:hover {
        color: var(--color-white);
      }

      svg {
        position: relative;
        width: 100%;
        height: 100%;
      }
    }
  }

  &__error {
    position: absolute;
    color: red;
    text-align: center;

    margin-top: 110px;

    width: calc(100% - 32px);

    @include tablet {
      position: relative;
      width: auto;

      font-size: 16px;
      text-align: left;

      margin-top: 30px;
    }

    @include desktop {
      font-size: 20px;
    }
  }
}
</style>