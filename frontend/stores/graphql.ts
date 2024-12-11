import { defineStore } from "pinia";



const ENDPOINT_KEY = "graphqlEndpoint";
const DEFAULT_ENDPOINT = "https://east.cesmii.net/graphql";

export const useGraphQLStore = defineStore("graphql", () => {
  let defaultEndpoint = DEFAULT_ENDPOINT;
  if(typeof localStorage !== "undefined") {
    const localEndpoint = localStorage.getItem(ENDPOINT_KEY);
    if(localEndpoint) {
      defaultEndpoint = localEndpoint;
    } else {
      localStorage.setItem(ENDPOINT_KEY, defaultEndpoint);
    }
  }
  const endpoint = ref(defaultEndpoint);

  function setEndpoint(url: string) {
    localStorage.setItem(ENDPOINT_KEY, url);
    endpoint.value = url;
  }

  return {
    endpoint,
    setEndpoint,
  };
});
