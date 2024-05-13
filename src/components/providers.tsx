'use client';

import { ThemeProvider } from 'next-themes';
import { PropsWithChildren } from 'react';
import { ApolloWrapper } from './apollo-wrapper';

const Providers = ({ children }: PropsWithChildren) => {
  // const authCtx = useContext(AuthContext);
  // const apolloClient = new ApolloClient({
  //   uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
  //   cache: new InMemoryCache(),
  //   headers: {
  //     Authorization: authCtx.user ? authCtx.user.token : 'test',
  //   },
  // });

  return (
    // <ApolloProvider client={apolloClient}>
    <ApolloWrapper>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </ApolloWrapper>
    // </ApolloProvider>
  );
};

export default Providers;
