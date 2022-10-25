<template>
  <div class="trpc-example">
    <h1>Vue 3 + vue-query + tRPC example</h1>
    <Error
      v-if="getMessagesHasError"
      error-message="Something went wrong - cannot fetch data"
      cta-text="Refetch data"
      @click="refetch()"
    />
    <Error
      v-if="addMessageHasError"
      error-message="Something went wrong - cannot submit message"
      cta-text="Reset error"
      @click="reset"
    />
    <AddDesignForm :form="form" @submit-form="handleSubmitForm" />
    <div v-if="showFormAndMessages" class="trpc-example__container">
      <div>
        <table class="styled-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>System</th>
              <th>default Item ID</th>
            </tr>
          </thead>
          <tbody v-for="design in data" :key="design.id">
            <tr>
              <td style="width: 300px">{{ design.id }}</td>
              <td style="width: 300px">{{ design.name }}</td>
              <td style="width: 300px">{{ design.systemId }}</td>
              <td style="width: 300px">{{ design.defaultItemId }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import Error from './components/Error.vue';
import { useQuery, useMutation, useQueryClient } from 'vue-query';
import { trpc } from './api/trpc';
import { Form } from './types';
import AddDesignForm from './components/AddDesignForm.vue';

const queryClient = useQueryClient();

const form = reactive({
  name: '',
  systemId: 0,
  defaultItemId: 0,
});
const getDesigns = () => trpc.query("getDesigns");

const {
  isError: getMessagesHasError,
  isLoading,
  data,
  refetch,
} = useQuery("getDesigns", getDesigns);

// const addMessage = (form: Form) => trpc.mutation('addMessage', form);
const addDesign = (form: Form) => trpc.mutation('addDesign', form)
const { error: addMessageHasError, mutate, reset } = useMutation('addDesign', addDesign);

const handleSubmitForm = () => {
  mutate(form, {
    onSuccess: () => {
      queryClient.invalidateQueries('getDesigns');
    },
  });
};

const showFormAndMessages = computed(() => {
  return !getMessagesHasError.value && !addMessageHasError.value;
});
</script>

<style scoped lang="scss">
@import "./style.css";

.trpc-example {
  max-width: 800px;

  &__container {
    text-align: left;
  }
}

.styled-table {
  border-collapse: collapse;
  margin: 25px 0;
  font-size: 0.9em;
  font-family: sans-serif;
  min-width: 400px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}
.styled-table thead tr {
  background-color: #009879;
  color: #ffffff;
  text-align: left;
}
.styled-table th,
.styled-table td {
  padding: 12px 15px;
}
.styled-table tbody tr {
  border-bottom: 1px solid #dddddd;
}

.styled-table tbody tr:nth-of-type(even) {
  background-color: #f3f3f3;
}

.styled-table tbody tr:last-of-type {
  border-bottom: 2px solid #009879;
}
.styled-table tbody tr.active-row {
  font-weight: bold;
  color: #009879;
}
</style>
