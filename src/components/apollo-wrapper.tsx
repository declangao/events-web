'use client';
// ^ this file needs the "use client" pragma

import { AuthContext } from '@/store/auth';
import { ApolloLink, HttpLink, useApolloClient } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import {
  ApolloNextAppProvider,
  NextSSRApolloClient,
  NextSSRInMemoryCache,
  SSRMultipartLink,
} from '@apollo/experimental-nextjs-app-support/ssr';
import { PropsWithChildren, useContext } from 'react';

// you can optionally enhance the `DefaultContext` like this to add some type safety to it.
declare module '@apollo/client' {
  export interface DefaultContext {
    token?: string;
  }
}

// have a function to create a client for you
function makeClient() {
  const authLink = setContext(async (_, { headers, token }) => {
    return {
      headers: {
        ...headers,
        ...(token ? { authorization: token } : {}),
      },
    };
  });

  const httpLink = new HttpLink({
    // this needs to be an absolute url, as relative urls cannot be used in SSR
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
    // you can disable result caching here if you want to
    // (this does not work if you are rendering your page with `export const dynamic = "force-static"`)
    // fetchOptions: { cache: 'no-store' },
    // you can override the default `fetchOptions` on a per query basis
    // via the `context` property on the options passed as a second argument
    // to an Apollo Client data fetching hook, e.g.:
    // const { data } = useSuspenseQuery(MY_QUERY, { context: { fetchOptions: { cache: "force-cache" }}});
  });

  return new NextSSRApolloClient({
    // use the `NextSSRInMemoryCache`, not the normal `InMemoryCache`
    cache: new NextSSRInMemoryCache(),
    link:
      typeof window === 'undefined'
        ? ApolloLink.from([
            // in a SSR environment, if you use multipart features like
            // @defer, you need to decide how to handle these.
            // This strips all interfaces with a `@defer` directive from your queries.
            new SSRMultipartLink({
              stripDefer: true,
            }),
            authLink,
            httpLink,
          ])
        : authLink.concat(httpLink),
  });
}

// you need to create a component to wrap your app in
export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      <ApolloContextUpdater>{children}</ApolloContextUpdater>
    </ApolloNextAppProvider>
  );
}

// https://github.com/apollographql/apollo-client-nextjs/issues/103
function ApolloContextUpdater({ children }: PropsWithChildren) {
  const authCtx = useContext(AuthContext);
  const apolloClient = useApolloClient();

  // just synchronously update the `apolloClient.defaultContext` before any child component can be rendered
  // so the value is available for any query started in a child
  apolloClient.defaultContext.token = authCtx.user?.token;

  return <>{children}</>;
}
