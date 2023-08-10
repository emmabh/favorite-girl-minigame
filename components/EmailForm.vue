<template>
  <div class="email-form">
    <form @submit="onSubmit">
      <input
        class="email-form__input"
        :value="email"
        placeholder="you@example.com"
        type="text"
      />
      <button class="email-form__submit-btn"><Arrow /></button>
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
};

const ERROR_MESSAGE = {
  [ERROR.INVALID_REQUEST]: `Make sure you e-mail is filled out`,
  [ERROR.INVALID_EMAIL]: `Please input a valid e-mail`,
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
      listId: "TODO",
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
      this.success = true;

      //   if (this.busy) {
      //     return;
      //   }

      //   const formData = formToObject(e.target);

      //   this.error = null;

      //   try {
      //     const recaptcha = await this.getRecaptcha();

      //     const submitData = {
      //       ...formData,
      //       recaptcha,
      //       id: this.listId,
      //     };

      //     this.busy = true;
      //     if (!validate(submitData.email)) {
      //       throw new Error(ERROR.INVALID_EMAIL);
      //     }

      //     const resp = await fetch(this.$store.getters.api("/subscribe"), {
      //       method: "POST",
      //       body: JSON.stringify(submitData),
      //     }).then((resp) => resp.json());

      //     this.success = true;
      //   } catch (e) {
      //     this.addError(getErrorMessage(e.message, this.defaultError));
      //   } finally {
      //     this.busy = false;
      //   }
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
      border: none;
      outline: none;
      background-color: transparent;

      color: var(--color-emerald);

      cursor: pointer;

      &:hover {
        color: var(--color-white);
      }
    }
  }
}
</style>