import { createStore } from "vuex";

import api from "../axios";

export const Mutations = {
  User: {
    SignOut: "user/sign-out",
    SignIn: "user/sign-in"
  },
  Surveys: {
    Set: "surveys/get"
  },
  Survey: {
    Save: "survey/save",
    Set: "survey/set",
    Remove: "survey/remove"
  }
};

export const Actions = {
  User: {
    SignUp: "user/sign-up",
    SignIn: "user/sign-in",
    SignOut: "user/sign-out"
  },
  Surveys: {
    Get: "surveys/get"
  },
  Survey: {
    Create: "survey/create",
    Save: "survey/save",
    Get: "survey/get",
    Remove: "survey/remove"
  }
};

const store = createStore({
  state: {
    user: {
      data: {},
      token: sessionStorage.getItem("token") || false
    },
    surveys : {
      loading: true,
      data: []
    },
    survey: {
      loading: true,
      data: {}
    },
    questions: { types: ["text", "select", "radio", "checkbox", "textarea"] }
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
    [Actions.Surveys.Get]: async ({ commit }) => {
      // Set the loading state to true:
      commit(Mutations.Surveys.Set, { loading: true, data: []});
      return api.get("/surveys").then(({ data: { data } }) => {
        commit(Mutations.Surveys.Set, { data });
        return data;
      }).catch((error) => {
        console.error(error);
        commit(Mutations.Surveys.Set, { data: []});
        throw error;
      });
    },
    [Actions.Survey.Get]: async ({ commit, state }, id) => {
      // Set the loading state to true:
      commit(Mutations.Survey.Set, { loading: true, data: {}});
      // Check if the survey is in the store:
      let survey = state.surveys.data.find((survey) => survey.id === Number(id));
      // If it is, return it:
      if (survey) {
        commit(Mutations.Survey.Set, { data: survey });
        return survey;
      }
      // If not, get it from the API:
      return api.get(`/surveys/${id}`).then(({ data: { data } }) => {
        commit(Mutations.Survey.Set, { data });
        return data;
      }).catch((error) => {
        console.error(error);
        commit(Mutations.Survey.Set, {});
        throw error;
      });
    },
    [Actions.Survey.Create]: ({ commit }) => {
      commit(Mutations.Survey.Set, { data: {} });
    },
    [Actions.Survey.Save]: ({ commit }, survey) => {
      const isUpdate = !!survey.id;
      const url = isUpdate ? `/surveys/${survey.id}` : "/surveys";
      const method = isUpdate ? "put" : "post";
      return api[method](url, survey).then(({ data: { data } }) => {
        commit(Mutations.Survey.Save, { data });
        return data;
      });
    },
    [Actions.Survey.Remove]: ({ commit }, id) => {
      return api.delete(`/surveys/${id}`).then(() => {
        commit(Mutations.Survey.Remove, id);
      }).catch((error) => {
        console.error(error);
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
    [Mutations.Surveys.Set]: (state, surveys) => {
      state.surveys = { data: surveys.data, loading: surveys.loading || false };
    },
    [Mutations.Survey.Set]: (state, survey) => {
      state.survey = { data: survey.data, loading: survey.loading || false };
    },
    [Mutations.Survey.Save]: (state, survey) => {
      const surveys = state.surveys.data.filter(({ id }) => id !== survey.id);
      state.surveys.data = [...surveys, survey];
    },
    [Mutations.Survey.Remove]: (state, id) => {
      state.surveys.data = state.surveys.data.filter((survey) => survey.id !== id);
    }
  },
  modules: {}
});

export default store;
