<template>
  <div>
    <img class="mx-auto h-12 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
         alt="Your Company"/>
    <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Sign-in to your account</h2>
    <p class="mt-2 text-center text-sm text-gray-600">
      or
      {{ " " }}
      <RouterLink :to="{ name: 'SignUp' }" class="font-medium text-indigo-600 hover:text-indigo-500">sign-up for free
      </RouterLink>
      .
    </p>
  </div>
  <form class="mt-8 space-y-6" @submit.prevent="login">
    <p v-if="error" class="flex items-center justify-between py-2 px-5 rounded-md bg-red-500 text-white">
      <span class="text-sm">
        {{ error }}
      </span>
      <span class="flex justify-center items-center transition-colors bg-black bg-opacity-0 hover:bg-opacity-20 rounded-full w-8 h-8 p-1 cursor-pointer" @click="clean.error">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
             class="h-7 w-7">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
      </svg>
      </span>
    </p>
    <input type="hidden" name="remember" value="true"/>
    <div class="-space-y-px rounded-md shadow-sm">
      <div>
        <label for="email-address" class="sr-only">Email address</label>
        <input id="email-address" name="email" type="email" autocomplete="email" required="" v-model="user.email"
               class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
               placeholder="Email address"/>
      </div>
      <div>
        <label for="password" class="sr-only">Password</label>
        <input id="password" name="password" type="password" autocomplete="current-password" required=""
               v-model="user.password"
               class="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
               placeholder="Password"/>
      </div>
    </div>

    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <input id="remember-me" name="remember-me" type="checkbox" v-model="user.remember"
               class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
        <label for="remember-me" class="ml-2 block text-sm text-gray-900">Remember me</label>
      </div>
    </div>

    <div>
      <button type="submit"
              class="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3">
              <LockClosedIcon class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true"/>
            </span>
        Sign in
      </button>
    </div>
  </form>
</template>

<script setup>
import { LockClosedIcon } from "@heroicons/vue/20/solid";
import { useRouter } from "vue-router";
import { ref } from "vue";

import store, { Actions } from "../../store/index.js";

const router = useRouter();

const user = {
  email: String(),
  password: String(),
  remember: false
};

const error = ref(String());

const clean = {
  error: () => {
    error.value = String();
  },
  user: () => {
    user.email = String();
    user.password = String();
    user.remember = false;
  }
};

function login() {
  store.dispatch(Actions.User.SignIn, user).then(() => {
    router.push({ name: "Dashboard" });
  }).catch(($error) => {
    error.value = $error.response.data.message || $error.response.data.error;
  });
}

</script>
