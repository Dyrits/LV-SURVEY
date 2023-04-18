import { createRouter, createWebHistory } from "vue-router";

import store from "../store";

import Dashboard from "../views/Dashboard.vue";
import Surveys from "../views/Surveys.vue";
import Survey from "../views/Survey.vue";
import SignIn from "../views/Authentication/SignIn.vue";
import SignUp from "../views/Authentication/SignUp.vue";
import BaseLayout from "../components/Layout/BaseLayout.vue";
import AuthenticationLayout from "../components/Layout/AuthenticationLayout.vue";

const routes = [
  {
    path: "/",
    name: "Index",
    redirect: "/dashboard",
    component: BaseLayout,
    children: [
      { path: "/dashboard", name: "Dashboard", component: Dashboard },
      { path: "/surveys", name: "Surveys", component: Surveys },
      { path: "/surveys/create", name: "Create", component: Survey },
      { path: "/surveys/:id", name: "Show", component: Survey },
    ],
  },
  {
    path: "/authentication",
    name: "Authentication",
    redirect: "/sign-in",
    component: AuthenticationLayout,
    meta: { authentication: true },
    children: [
      { path: "/sign-in", name: "SignIn", component: SignIn },
      { path: "/sign-up", name: "SignUp", component: SignUp },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const { authentication } = to.meta;
  const { token } = store.state.user;
  if (!authentication && !token) {
    next("/authentication");
  } else if (authentication && token) {
    next({ name: "Dashboard" });
  } else {
    next();
  }
});

export default router;
