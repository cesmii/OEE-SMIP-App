import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

import { GRAPHL_TOKEN_KEY } from "./lib/consts";



// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  build: {
    transpile: [ "vuetify" ],
  },
  generate: {
    // Generate Equipment Detail pages for a few equipment we know.
    routes: [ "/equipment/72943", "/equipment/73146", "/equipment/83885", "/equipment/84556" ],
  },
  app: {
    head: {
      charset: "utf-8",
      title: "CESMII OEE Dashboard",
    },
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        config.plugins!.push(vuetify({ autoImport: true }));
      });
    },
    "@nuxt/eslint",
    "@nuxtjs/apollo",
  ],
  apollo: {
    autoImports: true,
    clients: {
      default: {
        httpEndpoint: "https://east.cesmii.net/graphql",
        authHeader: "Authorization",
        authType: "Bearer",
        tokenStorage: "cookie",
        tokenName: GRAPHL_TOKEN_KEY,
        cookieAttributes: {
          sameSite: "strict",
          httpOnly: false,
        },
        inMemoryCacheOptions: {
          typePolicies: {
            AttributesGetTimeSeriesRecord: {
              keyFields: false,
            },
          },
        },
      },
      noauth: {
        httpEndpoint: "https://east.cesmii.net/graphql",
      },
    },
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
});
