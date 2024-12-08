<template>
  <v-app>
    <v-app-bar>
      <v-app-bar-title>
        {{route.meta.title}}
      </v-app-bar-title>

      <v-toolbar-items class="mr-4">
        <v-switch
          v-model="theme.global.name.value"
          icon
          false-value="light"
          true-value="dark"
          class="mr-8"
        >
          <template #prepend>
            <v-icon icon="mdi-weather-sunny"/>
          </template>
          <template #append>
            <v-icon icon="mdi-weather-night"/>
          </template>
        </v-switch>

        <div v-if="user" class="d-flex align-center ga-4">
          <span>
            <v-icon icon="mdi-account-outline"/>
            {{ user.user_name }}
          </span>
          <v-btn class="h-100" @click="logout">
            Log Out
          </v-btn>
        </div>
        <v-btn v-else to="/login">
          Log In
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>

    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useTheme } from "vuetify";

import { logoutGraphQL, useGraphQLUser } from "~/lib/auth";



const route = useRoute();
const theme = useTheme();
const user = useGraphQLUser();



function logout() {
  logoutGraphQL().then(() => navigateTo("/login"));
}
</script>
