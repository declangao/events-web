'use client';

import { APIProvider } from '@vis.gl/react-google-maps';
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
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
          {children}
        </APIProvider>
      </ThemeProvider>
    </ApolloWrapper>
  );
};

export default Providers;
