<script setup lang="ts">
import { loginWithAuthenticator } from "~/lib/auth";



definePageMeta({
  title: "Login",
});

const endpoint = ref<string>();
const authenticator = ref<string>();
const role = ref<string>();
const username = ref<string>();
const password = ref<string>();

const formValid = ref<boolean>();
const loading = ref(false);
const errorMsg = ref<string>();



function required(value: string): string | boolean {
  return !!value || "This field is required";
}

async function onSubmit() {
  if(!formValid.value) {
    return;
  }

  errorMsg.value = undefined;
  loading.value = true;
  try {
    await loginWithAuthenticator({
      endpoint: endpoint.value!,
      authenticator: authenticator.value!,
      role: role.value!,
      username: username.value!,
      password: password.value!,
    });
    navigateTo("/");
  } catch(err) {
    console.error(err);
    errorMsg.value = err instanceof Error
      ? err.message
      : "An error occurred logging in. Please check your credentials and try again.";
  } finally {
    loading.value = false;
  }
}
</script>
<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" lg="6">
        <v-form v-model="formValid" @submit.prevent="onSubmit">
          <v-card :loading="loading">
            <v-card-text>
              <v-text-field
                id="endpoint"
                v-model="endpoint"
                label="Endpoint"
                name="endpoint"
                placeholder="https://"
                hint="The URL to the GraphQL endpoint on your SMIP instance"
                :rules="[required]"
              />
              <v-text-field
                id="authenticator"
                v-model="authenticator"
                label="Authenticator"
                name="Authenticator"
                :rules="[required]"
              />
              <!--
                This _could_ be a dropdown with specific roles, but GraphQL doesn't expose these roles.
                The roles are ostensibly "constructable" using the instance's ThinkIQ domain name,
                but we'll just have the user manually type it in here.
              -->
              <v-text-field
                id="role"
                v-model="role"
                label="Role"
                name="Role"
                :rules="[required]"
              />
              <v-text-field
                id="username"
                v-model="username"
                label="Username"
                name="Username"
                :rules="[required]"
              />
              <v-text-field
                id="password"
                v-model="password"
                label="Password"
                name="Password"
                type="password"
                hint="The authenticator's password"
                :rules="[required]"
              />
              <v-alert
                v-if="errorMsg"
                type="error"
                :title="errorMsg"
                closable
              />
            </v-card-text>
            <v-card-actions>
              <v-btn type="submit" block :loading="loading" variant="tonal">Submit</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>
