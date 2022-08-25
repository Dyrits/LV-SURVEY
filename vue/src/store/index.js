import { createStore } from "vuex";

const store = createStore({
    state: {
        user: {
            data: { name: "Zura" },
            token: null
        }
    },
    getters: {},
    actions: {},
    mutations: {}
})

export default store;
