'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cart';
import { useState, useEffect } from 'react';

const NAV_LINKS = [
  { href: '/shop', label: 'Shop' },
  { href: '/shop?category=animal-health', label: 'Categories' },
  { href: '/#from-the-farm', label: 'From the Farm' },
  { href: '/booking', label: 'Expert Advice' },
  { href: '/#contact', label: 'Contact' },
];

export default function Navbar() {
  const count = useCart((s) => s.count());
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`bg-white sticky top-0 z-50 transition-shadow duration-200 ${scrolled ? 'shadow-nav' : 'border-b border-rule'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
              <Image src="/images/logo.jpg" alt="Waingo Farm & Agrovet logo" width={40} height={40} className="w-full h-full object-cover" priority />
            </div>
            <div>
              <div className="font-serif font-bold text-forest text-lg leading-none tracking-tight">Waingo</div>
              <div className="font-sans text-[10px] text-ink-light leading-none mt-0.5 tracking-wide">Farm & Agrovet</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3.5 py-2 text-sm font-sans font-medium text-ink-mid hover:text-forest rounded transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <a
              href="tel:+254704659267"
              className="hidden md:flex items-center gap-1.5 text-sm font-sans font-medium text-forest hover:text-forest-mid transition-colors px-3 py-2"
            >
              <PhoneIcon />
              0704 659 267
            </a>

            <Link
              href="/cart"
              className="relative flex items-center justify-center w-10 h-10 rounded hover:bg-parchment transition-colors text-ink-mid hover:text-forest"
              aria-label={`Cart (${count} items)`}
            >
              <CartIcon />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-bark text-white font-mono font-bold text-[10px] flex items-center justify-center rounded-full px-1 leading-none">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </Link>

            {/* Mobile toggle */}
            <button
              className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-[5px] rounded hover:bg-parchment transition-colors"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              <span className={`w-5 h-[1.5px] bg-ink transition-all origin-center ${open ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
              <span className={`w-5 h-[1.5px] bg-ink transition-opacity ${open ? 'opacity-0' : ''}`} />
              <span className={`w-5 h-[1.5px] bg-ink transition-all origin-center ${open ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden border-t border-rule py-4 pb-6">
            <nav className="flex flex-col gap-1 mb-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-2 py-2.5 text-sm font-sans font-medium text-ink-mid hover:text-forest rounded transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <a
              href="tel:+254704659267"
              className="flex items-center gap-2 px-2 py-2.5 text-sm font-sans font-medium text-forest"
            >
              <PhoneIcon />
              0704 659 267
            </a>
          </div>
        )}
      </div>
    </header>
  );
}

function PhoneIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  );
}
