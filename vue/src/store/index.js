import { createStore } from "vuex";

import api from "../axios";

// Temporary data~
import surveys from "../data/surveys";

export const Mutations = {
  User: {
    SignOut: "user/sign-out",
    SignIn: "user/sign-in",
  },
};

export const Actions = {
  User: {
    SignUp: "user/sign-up",
    SignIn: "user/sign-in",
    SignOut: "user/sign-out",
  },
};

const store = createStore({
  state: {
    user: {
      data: {},
      token: sessionStorage.getItem("token") || false,
    },
    surveys,
  },
  getters: {},
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
  },
  modules: {},
});

export default store;
