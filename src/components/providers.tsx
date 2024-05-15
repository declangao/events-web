'use client';

import { ThemeProvider } from 'next-themes';
import { PropsWithChildren } from 'react';
import { ApolloWrapper } from './apollo-wrapper';

const Providers = ({ children }: PropsWithChildren) => {
  return (
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
  );
};

export default Providers;
