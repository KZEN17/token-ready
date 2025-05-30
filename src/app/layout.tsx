import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '../lib/theme';

import './globals.css';
import Layout from '@/components/common/Layout';


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TokenReady - Where Conviction Meets Launch',
  description: 'Community-driven launchpad for belief-based investing in the Internet Capital Market',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Layout>
            {children}
          </Layout>
        </ThemeProvider>
      </body>
    </html>
  );
}