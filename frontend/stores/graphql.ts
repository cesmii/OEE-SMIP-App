import { defineStore } from "pinia";



export const useGraphQLStore = defineStore("graphql", () => {
  // Default Endpoint.
  const endpoint = ref("https://east.cesmii.net/graphql");

  function setEndpoint(url: string) {
    endpoint.value = url;
  }

  return {
    endpoint,
    setEndpoint,
  };
});
