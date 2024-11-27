import { ApolloClient, InMemoryCache } from "@apollo/client/core/index.js";
import { jwtDecode } from "jwt-decode";
import { z } from "zod";

import { GRAPHL_TOKEN_KEY } from "./consts";
import { AuthenticationRequestDocument, AuthenticationVerificationDocument } from "~/generated/graphql/operations";



/** Class used to express errors with the authentication flow. */
export class AuthenticationError extends Error {}
export type OnLoginFn = (token: string | undefined) => Promise<void>;



export interface AuthenticatorLoginInput {
  endpoint: string;
  authenticator: string;
  role: string;
  username: string;
  password: string;

  mutationId?: string;
}

/**
 * @param data Credentials to use when requesting the JWT.
 */
export async function loginWithAuthenticator(
  data: AuthenticatorLoginInput,
): Promise<void> {
  const client = new ApolloClient({
    uri: data.endpoint,
    cache: new InMemoryCache(),
  });

  // define onLogin as a reference to the useApollo composable https://apollo.nuxtjs.org/getting-started/composables
  const { onLogin } = useApollo();

  const authenticationRes = await client.mutate({
    mutation: AuthenticationRequestDocument,
    variables: {
      input: {
        authenticator: data.authenticator,
        role: data.role,
        userName: data.username,
        clientMutationId: data.mutationId,
      },
    },
  });

  const { challenge, message } = authenticationRes.data?.authenticationRequest?.jwtRequest ?? {};
  if(authenticationRes.errors) {
    throw new AuthenticationError("GraphQL errors from authentication request", {
      cause: authenticationRes.errors,
    });
  }
  if(!challenge) {
    throw new AuthenticationError(message || "Bad response from authentication request mutation");
  }

  const verificationRes = await client.mutate({
    mutation: AuthenticationVerificationDocument,
    variables: {
      input: {
        authenticator: data.authenticator,
        signedChallenge: `${challenge}|${data.password}`,
        clientMutationId: data.mutationId,
      },
    },
  });

  if(verificationRes.errors) {
    throw new AuthenticationError("GraphQL errors from authentication verification", {
      cause: verificationRes.errors,
    });
  }

  const jwt = verificationRes.data?.authenticationValidation?.jwtClaim;
  if(!jwt) {
    throw new AuthenticationError("Received empty JWT claim from authentication verification mutation");
  }
  // This applies the jwt to the Apollo client, but the client has a hardcoded endpoint :-(
  return onLogin(jwt);
}


const GraphQLUserSchema = z.object({
  authenticator: z.string(),
  role: z.string(),
  user_name: z.string(),
});
export type GraphQLUser = z.infer<typeof GraphQLUserSchema>;

export function useGraphQLUser(): ComputedRef<GraphQLUser | undefined> {
  const graphqlToken = useCookie(GRAPHL_TOKEN_KEY);

  return computed(() => {
    if(!graphqlToken.value) {
      return undefined;
    }

    const jwtObj = jwtDecode(graphqlToken.value);
    if(jwtObj.exp && jwtObj.exp < (Date.now() / 1000)) {
      console.warn("GraphQL token has expired. Redirecting to login page...");
      graphqlToken.value = null;
      return undefined;
    }

    try {
      return GraphQLUserSchema.parse(jwtObj);
    } catch(err) {
      console.error("Error parsing GraphQL JWT:", err);
      return undefined;
    }
  });
}
