import { InMemoryCache, HttpLink, ApolloClient  } from "@apollo/client/core";
import { setContext } from "@apollo/client/link/context";
import { DefaultApolloClient } from "@vue/apollo-composable";

import { GRAPHL_TOKEN_KEY } from "../consts";
import { useGraphQLStore } from "~/stores/graphql";



export function provideApolloClient() {
  const graphqlStore = useGraphQLStore();
  const jwtCookie = useCookie(GRAPHL_TOKEN_KEY);

  const cache = new InMemoryCache({
    typePolicies: {
      AttributesGetTimeSeriesRecord: {
        keyFields: false,
      },
    },
  });

  const httpLink = new HttpLink({
    // Get latest GraphQL endpoint, in case the user switched to a different server.
    uri: () => graphqlStore.endpoint,
  });

  // Add JWT to GraphQL requests.
  const authLink = setContext((_, { headers }) => {
    if(!jwtCookie.value) {
      return { headers };
    }

    return {
      headers: {
        ...headers,
        authorization: `Bearer ${jwtCookie.value}`,
      },
    };
  });

  const apolloClient = new ApolloClient({
    cache,
    link: authLink.concat(httpLink),
  });

  provide(DefaultApolloClient, apolloClient);
}
