import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/components/common';
import SupportCidToast from '@/components/common/SupportCidToast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AssignHub - Connect Students & Writers',
  description: 'Assignment services marketplace connecting students with professional writers',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>
          {/* Global error toast with correlation ID */}
          <div id="support-cid-toast-root">
            {/* This renders on every page to capture and show API errors */}
            {/* eslint-disable-next-line @next/next/no-sync-scripts */}
          </div>
          {children}
          {/* Render the toast component here */}
          {/* Since this is a client component tree, import the toast below */}
          <SupportCidToast />
        </ToastProvider>
      </body>
    </html>
  );
}
