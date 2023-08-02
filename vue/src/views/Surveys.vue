<template>
  <PageComponent>
    <template v-slot:header>
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900">Surveys</h1>
        <RouterLink :to="{ name: 'Create' }"
                    class="py-2 px-3 text-white bg-emerald-500 rounded-md hover:bg-emerald-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 -mt-1 inline-block" fill="none" viewBox="0 0 24 24"
               stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add
        </RouterLink>
      </div>
    </template>
    <div class="grid grid-cols-a gap-3 sm:grid-cols-2 md:grid-cols-3">
       <SurveyListItem v-for="survey in surveys" :key="survey.id" :survey="survey" @remove="removeSurvey" />
    </div>
  </PageComponent>
</template>

<script setup>
import { computed, onMounted } from "vue";

import store, { Actions } from "../store";

import PageComponent from "../components/PageComponent.vue";
import SurveyListItem from "../components/SurveyListItem.vue";

const surveys = computed(() => store.state.surveys.data);

onMounted(async () => {
    await store.dispatch(Actions.Surveys.Get);
});


async function removeSurvey(id) {
  const confirmation = confirm("Are you sure you want to delete this survey? Operation cannot be undone.");
  if (confirmation) {
    await store.dispatch(Actions.Survey.Remove, id);
  }
}
</script>
