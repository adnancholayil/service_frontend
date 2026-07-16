import './globals.css';
import { Montserrat } from 'next/font/google';
import Providers from '../components/providers/Providers';
import Navbar from '../components/layouts/Navbar';
import Footer from '../components/layouts/Footer';
import NotificationDrawer from '../components/layouts/NotificationDrawer';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
});

export const metadata = {
  title: 'Servio — Book Trusted Local Services',
  description: 'Book certified plumbers, electricians, cleaners, and other professionals in your area. Safe, background-verified, and highly rated local services.',
  keywords: 'home services, local plumber, local electrician, ac servicing, carpenter, home cleaner, professional driver, garden service',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`h-full antialiased ${montserrat.variable}`} suppressHydrationWarning>
      {/* pb-20: clear mobile bottom tab bar; md:pb-0 on desktop */}
      <body className="h-full flex flex-col bg-background text-foreground">
        <Providers>
          <Navbar />
          <main className="flex-1 flex flex-col w-full md:pb-0 pb-24">
            {children}
          </main>
          <Footer />
          <NotificationDrawer />
        </Providers>
      </body>
    </html>
  );
}
