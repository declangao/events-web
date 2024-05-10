import Navbar from '@/components/navbar';
import { appName } from '@/config';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: appName,
  description: 'Publish and join events',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div
          className={cn(
            'min-h-screen w-full bg-background font-sans antialiased flex flex-col overflow-x-hidden',
            inter.className
          )}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />

            <main className="flex-grow container pt-16">{children}</main>

            <Toaster richColors />

            {/* <Footer /> */}
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
