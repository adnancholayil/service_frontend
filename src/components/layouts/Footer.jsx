'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles } from 'lucide-react';

const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export function Footer() {
  const pathname = usePathname();

  if (pathname && (pathname.startsWith('/messages') || pathname.startsWith('/admin') || pathname.startsWith('/provider'))) {
    return null;
  }

  return (
    <footer className="border-t border-border bg-card text-muted-foreground mt-auto">
      <div className="mx-auto max-w-[1600px] px-2 py-12 sm:px-4 lg:px-4">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white shadow-sm">
                <Sparkles className="h-4.5 w-4.5" />
              </span>
              <span>Service<span className="text-brand">Hub</span></span>
            </Link>
            <p className="text-sm max-w-xs">
              On-demand local service professionals at your doorstep. Reliable, background-verified, and highly rated.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-foreground transition-colors"><FacebookIcon className="h-5 w-5" /></a>
              <a href="#" className="hover:text-foreground transition-colors"><TwitterIcon className="h-5 w-5" /></a>
              <a href="#" className="hover:text-foreground transition-colors"><InstagramIcon className="h-5 w-5" /></a>
              <a href="#" className="hover:text-foreground transition-colors"><LinkedinIcon className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Links Grid */}
          <div className="mt-8 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0 sm:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Services</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li><Link href="/services?category=electrician" className="hover:text-foreground transition-colors">Electricians</Link></li>
                <li><Link href="/services?category=cleaner" className="hover:text-foreground transition-colors">House Cleaning</Link></li>
                <li><Link href="/services?category=ac-technician" className="hover:text-foreground transition-colors">AC Servicing</Link></li>
                <li><Link href="/services?category=plumber" className="hover:text-foreground transition-colors">Plumbing Works</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">For Providers</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li><Link href="/register?role=provider" className="hover:text-foreground transition-colors">Join as Partner</Link></li>
                <li><Link href="/provider/dashboard" className="hover:text-foreground transition-colors">Partner Dashboard</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Success Stories</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Resource Hub</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Company</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li><Link href="#" className="hover:text-foreground transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Contact Support</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} ServiceHub Technologies Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
