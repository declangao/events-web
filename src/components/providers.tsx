'use client';

import { AuthContext } from '@/store/auth';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { ThemeProvider } from 'next-themes';
import { PropsWithChildren, useContext } from 'react';

const Providers = ({ children }: PropsWithChildren) => {
  const authCtx = useContext(AuthContext);

  const apolloClient = new ApolloClient({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
    cache: new InMemoryCache(),
    headers: {
      Authorization: authCtx.user ? authCtx.user.token : 'test',
    },
  });

  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default Providers;
