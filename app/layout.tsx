import { Toaster } from '@/components/ui/sonner';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import Footer from '@/components/footer';
import MobileFooterNav from '@/components/mobile-footer-nav';
import { ProfileProvider } from '@/context/profile-context';
import { OutletProvider } from '@/context/outlet-context';
import { UserProvider } from '@/context/user-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NextJS + Shadcn',
  description: 'Boilerplate using NextJS and Shadcn',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ProfileProvider>
            <OutletProvider>
              <UserProvider>
                <div className="flex w-full min-h-screen">
                  <Sidebar />
                  <div className="flex flex-col flex-1">
                    <Header />
                    <main className="md:pl-64">{children}</main>
                    <Footer />
                  </div>
                  <MobileFooterNav />
                </div>
              </UserProvider>
            </OutletProvider>
          </ProfileProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
