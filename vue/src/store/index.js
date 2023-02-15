import { createStore } from "vuex";

export const Mutations = {
  User: {
    SignOut: "user/sign-out",
  },
};

export const Actions = {};

const store = createStore({
  state: {
    user: {
      data: {
        name: "Tom Cook",
        email: "tom@example.com",
        image:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
      token: true,
    },
  },
  getters: {},
  actions: {},
  mutations: {
    [Mutations.User.SignOut]: (state) => {
      state.user.data = {};
      state.user.token = false;
    },
  },
  modules: {},
});

export default store;
