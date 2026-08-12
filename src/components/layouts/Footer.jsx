'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Shield, BadgeCheck } from 'lucide-react';

const SocialIcon = ({ href, label, children }) => (
  <a
    href={href}
    aria-label={label}
    target="_blank"
    rel="noopener noreferrer"
    className="h-9 w-9 flex items-center justify-center rounded-xl bg-muted text-muted-foreground hover:bg-brand hover:text-white transition-all"
  >
    {children}
  </a>
);

const FooterLink = ({ href, children }) => (
  <li>
    <Link href={href} className="text-sm text-muted-foreground dark:text-zinc-400 hover:text-foreground dark:hover:text-white transition-colors">
      {children}
    </Link>
  </li>
);

export function Footer() {
  const pathname = usePathname();

  if (
    pathname &&
    (pathname.startsWith('/messages') ||
     pathname.startsWith('/admin') ||
     pathname.startsWith('/provider/') || 
     pathname === '/provider')
  ) {
    return null;
  }

  return (
    <footer className="bg-card border-t border-border text-muted-foreground mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Column */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <Image
                src="/assets/LOGO.png"
                alt="Servio Logo"
                width={36}
                height={36}
                className="transition-transform duration-200 group-hover:scale-105"
              />
              <span className="text-lg font-extrabold tracking-tight text-foreground">
                Ser<span className="text-brand">vio</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs dark:text-zinc-400">
              On-demand local service professionals at your doorstep. Reliable, background-verified, and highly rated.
            </p>

            {/* Trust badges */}
            <div className="flex flex-col gap-2 pt-1">
              {[
                { icon: Shield, text: 'Background Verified' },
                { icon: BadgeCheck, text: 'Quality Guaranteed' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-xs font-semibold text-foreground/70">
                  <Icon className="h-3.5 w-3.5 text-brand shrink-0" /> {text}
                </div>
              ))}
            </div>

            {/* Social icons */}
            <div className="flex gap-2 pt-1">
              <SocialIcon href="#" label="Facebook">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </SocialIcon>
              <SocialIcon href="#" label="Instagram">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </SocialIcon>
              <SocialIcon href="#" label="Twitter / X">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </SocialIcon>
              <SocialIcon href="#" label="LinkedIn">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </SocialIcon>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="text-xs font-bold text-foreground tracking-widest uppercase mb-4">Services</h3>
            <ul className="space-y-2.5">
              <FooterLink href="/services?category=electrician">Electricians</FooterLink>
              <FooterLink href="/services?category=plumber">Plumbing Works</FooterLink>
              <FooterLink href="/services?category=cleaner">House Cleaning</FooterLink>
              <FooterLink href="/services?category=ac-technician">AC Servicing</FooterLink>
              <FooterLink href="/services?category=carpenter">Carpentry</FooterLink>
              <FooterLink href="/services">View All Services</FooterLink>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-xs font-bold text-foreground tracking-widest uppercase mb-4">Company</h3>
            <ul className="space-y-2.5">
              <FooterLink href="/providers">Find Providers</FooterLink>
              <FooterLink href="/bookings">My Bookings</FooterLink>
              <FooterLink href="/profile">My Profile</FooterLink>
              <FooterLink href="/#how-it-works">How It Works</FooterLink>
            </ul>
          </div>

          {/* For Providers */}
          <div>
            <h3 className="text-xs font-bold text-foreground tracking-widest uppercase mb-4">For Partners</h3>
            <ul className="space-y-2.5">
              <FooterLink href="/provider/dashboard">Provider Portal</FooterLink>
              <FooterLink href="/provider/bookings">Manage Bookings</FooterLink>
              <FooterLink href="/provider/services">My Services</FooterLink>
              <FooterLink href="/provider/earnings">Earnings</FooterLink>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground dark:text-zinc-500">
            © {new Date().getFullYear()} Servio. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground dark:text-zinc-400">
            <Link href="#" className="hover:text-foreground dark:hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-foreground dark:hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-foreground dark:hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
