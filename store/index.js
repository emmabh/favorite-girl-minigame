export const state = () => {
  return {
    endpoint: "",
    domain: "",
    recaptchaKey: null,
    preloaderActive: true,
    quizInProgress: false,
    currentQuestionIndex: 0,
    muted: false,
    quizState: "",
    currentPeopleFailedPercentage: 0,
    currentPeopleSucceededPercentage: 0,
    questions: [
      {
        id: 1,
        question: "give me your email?",
        answers: {
          yes: "sure!",
          no: "nope"
        }
      },
      {
        id: 2,
        question: "mess up your sleep schedule",
        desktopEnding: " to achieve your dream?",
        answers: {
          yes: "it's already messed up",
          no: "no, I need my 8 hours"
        }
      },
      {
        id: 3,
        question: "shave your head?",
        answers: {
          yes: "hell yeah",
          no: "absolutely not"
        }
      },
      {
        id: 4,
        question: "give up your favorite food forever?",
        answers: {
          yes: "...ok fine",
          no: "no chance"
        }
      },
      {
        id: 5,
        question: "lick a sidewalk in New York City?",
        answers: {
          yes: "might regret it, but ya",
          no: "ew wtf"
        }
      },
      {
        id: 6,
        question: "sabotage a friends dream to achieve your own?",
        answers: {
          yes: "ill do it for my dream",
          no: "of course not"
        }
      }
    ]
  };
};

export const mutations = {
  setEndpoint(state, val) {
    state.endpoint = val;
  },
  setDomain(state, val) {
    state.domain = val;
  },
  setRecaptchaKey(state, val) {
    state.recaptchaKey = val;
  },
  setPreloaderActive(state, val) {
    state.preloaderActive = val;
  },
  setQuizInProgress(state, val) {
    state.quizInProgress = val;
  },
  setCurrentQuestionIndex(state, val) {
    state.currentQuestionIndex = val;
  },
  setMuted(state, val) {
    state.muted = val;
  },
  setCurrentPeopleFailedPercentage(state, val) {
    state.currentPeopleFailedPercentage = val;
  },
  setCurrentPeopleSucceededPercentage(state, val) {
    state.currentPeopleSucceededPercentage = val;
  },
  setQuizState(state, val) {
    state.quizState = val;
  }
};

export const getters = {
  api: state => path => {
    return `${state.endpoint}${path}`;
  },
  postResponse: (state, getters) => (id, answeredYes, recaptcha) => {
    return fetch(getters.api("/answer"), {
      method: "POST",
      body: JSON.stringify({ id, answeredYes, recaptcha })
    });
  },
  subscribeToList: (state, getters) => (email, recaptcha, id = "general") => {
    return fetch(getters.api("/subscribeToList"), {
      method: "POST",
      body: JSON.stringify({ email, id, recaptcha })
    });
  }
  // post: (state, getters) => data => {
  //   return fetch(getters.api("/post"), {
  //     method: "POST",
  //     body: JSON.stringify(data)
  //   });
  // }
};

export const actions = {
  async nuxtServerInit({ commit }, { env }) {
    commit("setEndpoint", env.endpoint);
    commit("setDomain", env.PROJECT_DOMAIN);
    commit("setRecaptchaKey", env.recaptcha);
  }
};
