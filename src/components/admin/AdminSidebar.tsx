'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

const links = [
  { href: '/admin', label: 'Dashboard', icon: '⊞' },
  { href: '/admin/products', label: 'Products', icon: '▦' },
  { href: '/admin/orders', label: 'Orders', icon: '▤' },
  { href: '/admin/bookings', label: 'Bookings', icon: '◫' },
  { href: '/admin/stock', label: 'Stock & Reorder', icon: '⊡' },
];

export default function AdminSidebar() {
  const path = usePathname();

  return (
    <aside className="w-56 bg-charcoal-ink text-manila flex flex-col min-h-screen flex-shrink-0">
      <div className="p-4 border-b border-manila/10">
        <div className="font-heading font-bold text-sm text-manila">WAINGO</div>
        <div className="font-mono text-[10px] text-manila/40 uppercase tracking-widest">Admin Console</div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {links.map((link) => {
          const active = path === link.href || (link.href !== '/admin' && path.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-sm font-body text-sm transition-colors ${active ? 'bg-soil-red text-manila' : 'text-manila/60 hover:text-manila hover:bg-manila/5'}`}
            >
              <span className="text-base leading-none">{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-manila/10">
        <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-sm text-manila/40 hover:text-manila text-xs font-mono transition-colors mb-1">
          ← Public Site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-sm text-manila/40 hover:text-manila text-xs font-mono transition-colors"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
