// For React Server Component
// https://github.com/apollographql/apollo-client-nextjs

import { ApolloClient, HttpLink, InMemoryCache, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support/rsc';
import { cookies } from 'next/headers';

export const { getClient: getApolloClient } = registerApolloClient(() => {
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );

    if (networkError) console.log(`[Network error]: ${networkError}`);
  });

  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
  });

  const authLink = setContext((_, { headers }) => {
    const cookie = cookies().get('token');
    const token = cookie ? cookie.value : '';

    return {
      headers: {
        ...headers,
        authorization: token ? token : '',
      },
    };
  });

  // return new ApolloClient({
  //   cache: new InMemoryCache(),
  //   link: new HttpLink({
  //     // this needs to be an absolute url, as relative urls cannot be used in SSR
  //     uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
  //     // you can disable result caching here if you want to
  //     // (this does not work if you are rendering your page with `export const dynamic = "force-static"`)
  //     // fetchOptions: { cache: "no-store" },

  //     // headers: {
  //     //   Authorization: idTokenResult?.token ? idTokenResult?.token : '',
  //     // },
  //   }),
  // });
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: from([errorLink, authLink, httpLink]),
  });
});
