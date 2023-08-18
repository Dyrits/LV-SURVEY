<template>
  <PageComponent>
    <template v-slot:header>
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold text-gray-900">
          {{ route.params.id ? model.title : "Create a survey" }}
        </h1>
        <button
          v-if="route.params.id"
          type="button"
          @click="removeSurvey()"
          class="py-2 px-3 text-white bg-red-500 rounded-md hover:bg-red-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 -mt-1 inline-block"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
          Delete Survey
        </button>
      </div>
    </template>
    <div v-if="loading" class="flex justify-center">Loading...</div>
    <form @submit.prevent="saveSurvey" v-else>
      <div class="shadow sm:rounded-md sm:overflow-hidden">
        <div class="px-4 py-5 bg-white space-y-6 sm:p-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Image
            </label>
            <div class="mt-1 flex items-center">
              <img
                v-if="model.image"
                :src="model.image"
                :alt="model.title"
                class="w-64 h-48 object-cover"
              />
              <span
                v-else
                class="flex items-center justify-center h-12 w-12 rounded-full overflow-hidden bg-gray-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-[80%] w-[80%] text-gray-300"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
              <button
                type="button"
                class="relative overflow-hidden ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <input
                  type="file"
                  @change="editImage"
                  class="absolute left-0 top-0 right-0 bottom-0 opacity-0 cursor-pointer"
                />
                Change
              </button>
            </div>
          </div>
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700"
            >Title</label
            >
            <input
              type="text"
              name="title"
              id="title"
              v-model="model.title"
              autocomplete="survey_title"
              class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label for="about" class="block text-sm font-medium text-gray-700">
              Description
            </label>
            <div class="mt-1">
              <textarea
                id="description"
                name="description"
                rows="3"
                v-model="model.description"
                autocomplete="survey_description"
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                placeholder="Describe your survey"
              />
            </div>
          </div>
          <div>
            <label
              for="expiration"
              class="block text-sm font-medium text-gray-700"
            >Expire Date</label
            >
            <input
              type="date"
              name="expiration"
              id="expiration"
              v-model="model.expiration"
              class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                id="status"
                name="status"
                type="checkbox"
                v-model="model.status"
                class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
            </div>
            <div class="ml-3 text-sm">
              <label for="status" class="font-medium text-gray-700"
              >Active</label
              >
            </div>
          </div>
        </div>
        <div class="px-4 py-5 bg-white space-y-6 sm:p-6">
          <h3 class="text-2xl font-semibold flex items-center justify-between">
            Questions
            <button
              type="button"
              @click="addQuestion()"
              class="flex items-center text-sm py-1 px-4 rounded-sm text-white bg-gray-600 hover:bg-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clip-rule="evenodd"
                />
              </svg>
              Add Question
            </button>
          </h3>
          <div v-if="!model.questions || !model.questions.length" class="text-center text-gray-600">
            You don't have any questions created
          </div>
          <div v-for="(question, index) in model.questions" :key="question.id">
            <QuestionComponent
              :question="question"
              :index="index"
              @edit="editQuestion"
              @add="addQuestion"
              @remove="removeQuestion"
            />
          </div>
        </div>
        <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
          <button
            type="submit"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  </PageComponent>
</template>

<script setup>
import { onMounted, reactive, ref, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { v4 as uuidv4 } from "uuid";

import store, { Actions } from "../store";

import PageComponent from "../components/PageComponent.vue";
import QuestionComponent from "../components/Editor/QuestionComponent.vue";

const route = useRoute();
const router = useRouter();

const loading = computed(() => store.state.survey.loading);

const model = reactive({
  title: String(),
  expiration: null,
  status: false,
  description: null,
  image: null,
  questions: []
});

onMounted(async () => {
  if (route.params.id) {
    await store.dispatch(Actions.Survey.Get, route.params.id).then(survey => {
      Object.assign(model, {
        ...survey,
        status: survey.status !== "draft",
      });
    })
  } else {
    store.dispatch(Actions.Survey.Create).then(survey => {
      Object.assign(model, survey);
    });
  }
});

function addQuestion(index) {
  model.questions.splice(index, 0, {
    id: uuidv4(),
    type: "text",
    question: String(),
    description: null,
    data: {}
  });
}

function removeQuestion(question) {
  model.questions.splice(model.questions.indexOf(question), 1);
}

function editQuestion(question) {
  model.questions = model.questions.map($question => question.id === $question.id ? question : $question);
}

function editImage($event) {
  const file = $event.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    model.image = reader.result;
  }
  reader.readAsDataURL(file);
}

function saveSurvey() {
  store.dispatch(Actions.Survey.Save, model).then((survey) => {
    router.push({ name: "Show", params: { id: survey.id } })
  });
}

function removeSurvey() {
  const confirmation = confirm("Are you sure you want to delete this survey? Operation cannot be undone.");
  if (confirmation) {
    store.dispatch(Actions.Survey.Remove, model.id).then(() => {
      router.push({ name: "Index" })
    });
  }
}
</script>
