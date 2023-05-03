import { createStore } from "vuex";

import api from "../axios";

// Temporary data~
import surveys from "../data/surveys";

export const Mutations = {
  User: {
    SignOut: "user/sign-out",
    SignIn: "user/sign-in",
  },
  Survey: {
    Save: "survey/save",
  }
};

export const Actions = {
  User: {
    SignUp: "user/sign-up",
    SignIn: "user/sign-in",
    SignOut: "user/sign-out",
  },
  Survey: {
    Save: "survey/save",
  }
};

const store = createStore({
  state: {
    user: {
      data: {},
      token: sessionStorage.getItem("token") || false,
    },
    surveys,
    questions: { types: [] }
  },
  getters: {
    survey: (state) => (id) => {
      return state.surveys.find((survey) => survey.id === Number(id));
    }
  },
  actions: {
    [Actions.User.SignOut]: ({ commit }) => {
      return api.post("/user/sign-out").then(({ data }) => {
        commit(Mutations.User.SignOut);
        return data;
      });
    },
    [Actions.User.SignUp]: ({ commit }, user) => {
      return api.post("/user/sign-up", user).then(({ data }) => {
        commit(Mutations.User.SignIn, data);
        return data;
      });
    },
    [Actions.User.SignIn]: ({ commit }, user) => {
      return api.post("/user/sign-in", user).then(({ data }) => {
        commit(Mutations.User.SignIn, data);
        return data;
      });
    },
    [Actions.Survey.Save]: ({ commit }, survey) => {
      const isUpdate = !!survey.id;
      const url = isUpdate ? `/survey/${survey.id}` : "/survey";
      const method = isUpdate ? "put" : "post";
      return api[method](url, survey).then(({ data }) => {
        commit(Mutations.Survey.Save, data);
        return data;
      });
    }
  },
  mutations: {
    [Mutations.User.SignOut]: (state) => {
      state.user.data = {};
      state.user.token = false;
      sessionStorage.removeItem("token");
    },
    [Mutations.User.SignIn]: (state, data) => {
      state.user.data = data.user;
      state.user.token = data.token;
      sessionStorage.setItem("token", data.token);
    },
    [Mutations.Survey.Save]: (state, survey) => {
      const surveys = state.surveys.filter(({ id }) => id !== survey.id);
      state.surveys = [...surveys, survey];
    }
  },
  modules: {},
});

export default store;
