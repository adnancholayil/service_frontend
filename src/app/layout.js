import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '../components/providers/Providers';
import Navbar from '../components/layouts/Navbar';
import Footer from '../components/layouts/Footer';
import NotificationDrawer from '../components/layouts/NotificationDrawer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata = {
  title: 'ServiceHub - On-Demand Local Services & Professionals',
  description: 'Book certified plumbers, electricians, cleaners, and other professionals in your area. Safe, background-verified, and highly rated local services.',
  keywords: 'home services, local plumber, local electrician, ac servicing, carpenter, home cleaner, service tutor, professional driver, garden service',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      {/* pb-[calc(4rem+env(safe-area-inset-bottom))] for mobile to clear the bottom nav bar */}
      <body className="min-h-full flex flex-col bg-background text-foreground pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">
        <Providers>
          <Navbar />
          <main className="flex-1 flex flex-col w-full">
            {children}
          </main>
          <Footer />
          <NotificationDrawer />
        </Providers>
      </body>
    </html>
  );
}
