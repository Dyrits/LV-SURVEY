import { createRouter, createWebHistory } from "vue-router";

import Dashboard from "../views/Dashboard.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";

const routes = [
    {
        path: "/Dashboard",
        name: "Dashboard",
        component: Dashboard
    },
    {
        path: "/Login",
        name: "Login",
        component: Login,
    },
    {
        path: "/Register",
        name: "Register",
        component: Register,
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
