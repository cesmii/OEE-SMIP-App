import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";



// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  build: {
    transpile: [ "vuetify" ],
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        config.plugins!.push(vuetify({ autoImport: true }));
      });
    },
    "@nuxt/eslint",
    "@nuxtjs/apollo",
    "nuxt-lodash",
  ],
  apollo: {
    autoImports: true,
    clients: {
      default: {
        httpEndpoint: "https://east.cesmii.net/graphql",
        authHeader: "Authorization",
        authType: "Bearer",
        tokenStorage: "cookie",
        tokenName: "graphql-token",
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
  lodash: {
    prefix: "_",
    prefixSkip: [ "string" ],
    upperAfterPrefix: false,
    exclude: [ "map" ],
    alias: [
      [ "camelCase", "stringToCamelCase" ], // => stringToCamelCase
      [ "kebabCase", "stringToKebab" ], // => stringToKebab
      [ "isDate", "isLodashDate" ], // => _isLodashDate
    ],
  },
});
