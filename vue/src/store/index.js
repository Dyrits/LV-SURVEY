import { createStore } from "vuex";

export const Mutations = {
  User: {
    SignOut: "user/sign-out",
    SignUp: "user/sign-up",
  },
};

export const Actions = {
  User: {
    SignUp: "user/sign-up",
  },
};

const store = createStore({
  state: {
    user: {
      data: {},
      token: sessionStorage.getItem("token") || false,
    },
  },
  getters: {},
  actions: {
    [Actions.User.SignUp]: ({ commit }, user) => {
      return fetch("http://localhost:8000/api/user/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(user),
      })
        .then((response) => response.json())
        .then((data) => {
          commit(Mutations.User.SignUp, data);
          return data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  mutations: {
    [Mutations.User.SignOut]: (state) => {
      state.user.data = {};
      state.user.token = false;
    },
    [Mutations.User.SignUp]: (state, data) => {
      state.user.data = data.user;
      state.user.token = data.token;
      sessionStorage.setItem("token", data.token);
    },
  },
  modules: {},
});

export default store;
