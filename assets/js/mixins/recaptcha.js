export const CaptchaMixin = {
  methods: {
    getRecaptcha() {
      return new Promise(resolve => {
        // eslint-disable-next-line no-undef
        grecaptcha.enterprise.ready(() => {
          // eslint-disable-next-line no-undef
          grecaptcha
            .enterprise
            .execute("6LdSZ8QnAAAAAPFHWrpFkXoGkC0CaDFtOd6xtWW1", {
              action: "LOGIN"
            })
            .then(token => {
              resolve(token);
            });
        });
      });
    }
  }
};
