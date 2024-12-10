<template>
  <NuxtPwaManifest />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { provideApolloClient } from "./lib/graphql";



provideApolloClient();
</script>
