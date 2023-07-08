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
    Set: "survey/set"
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
    Get: "survey/get"
  }
};

const store = createStore({
  state: {
    user: {
      data: {},
      token: sessionStorage.getItem("token") || false,
    },
    surveys,
    survey: {
      loading: false,
      data: {},
    },
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
      return api[method](url, survey).then(({ data: { data } }) => {
        commit(Mutations.Survey.Save, data);
        return data;
      });
    },
    [Actions.Survey.Get]: async ({ commit }, id) => {
      // Set the loading state to true:
      commit(Mutations.Survey.Set, {}, true);
      // Check if the survey is in the store:
      let survey = surveys.find((survey) => survey.id === Number(id));
      // If it is, return it:
      if (survey) {
        commit(Mutations.Survey.Set, survey);
        return survey;
      }
      // If not, get it from the API:
      return api.get(`/survey/${id}`).then(({ data: { data } }) => {
        commit(Mutations.Survey.Set, data);
        return data;
      }).catch((error) => {
        console.error(error);
        commit(Mutations.Survey.Set, {});
        throw error;
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
    },
    [Mutations.Survey.Set]: (state, survey, loading = false) => {
      state.survey = { loading, data: survey };
    }
  },
  modules: {},
});

export default store;
