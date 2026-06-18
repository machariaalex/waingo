import Link from 'next/link';

const SHOP_LINKS = [
  { href: '/shop?category=animal-health', label: 'Animal Health' },
  { href: '/shop?category=feeds', label: 'Feeds & Supplements' },
  { href: '/shop?category=seeds', label: 'Seeds & Seedlings' },
  { href: '/shop?category=tools', label: 'Tools & Equipment' },
];

const INFO_LINKS = [
  { href: '/booking', label: 'Book a Vet Call-out' },
  { href: '/booking', label: 'Farm Tours' },
  { href: '/booking', label: 'Bulk Orders' },
  { href: '/#from-the-farm', label: 'Farming Tips' },
];

export default function Footer() {
  return (
    <footer id="contact" className="bg-ink text-white">
      {/* Contact strip */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6 md:justify-between">
            <div>
              <p className="font-sans text-sm text-white/50 mb-1">Have a question? Talk to Wilson directly.</p>
              <a href="tel:+254704659267" className="font-serif text-2xl text-white hover:text-harvest transition-colors">
                0704 659 267
              </a>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://wa.me/254704659267"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white font-sans font-semibold text-sm px-5 py-2.5 rounded hover:bg-[#1ebe5b] transition-colors"
              >
                <WhatsAppIcon />
                WhatsApp Wilson
              </a>
              <a
                href="mailto:info@waingo.co.ke"
                className="inline-flex items-center gap-2 border border-white/20 text-white font-sans font-medium text-sm px-5 py-2.5 rounded hover:bg-white/5 transition-colors"
              >
                Email Us
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-forest rounded flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" fill="none">
                  <path d="M12 22C12 22 4 17 4 10a8 8 0 0116 0c0 7-8 12-8 12z" fill="white" fillOpacity="0.9" />
                  <line x1="12" y1="22" x2="12" y2="12" stroke="white" strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" />
                </svg>
              </div>
              <span className="font-serif font-bold text-lg text-white">Waingo</span>
            </div>
            <p className="font-sans text-sm text-white/50 leading-relaxed mb-5">
              Serving farmers and livestock keepers along Mombasa Road. Animal health products, feeds, seeds, and farm tools — in one place.
            </p>
            <a
              href="https://www.tiktok.com/@waingofarm"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white/50 hover:text-harvest transition-colors text-sm font-sans"
            >
              <TikTokIcon />
              @waingofarm · 3.8M+ likes
            </a>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-sans font-semibold text-sm text-white mb-4">Shop</h3>
            <ul className="space-y-2.5">
              {SHOP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="font-sans text-sm text-white/50 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/shop" className="font-sans text-sm text-harvest hover:text-harvest-light transition-colors">
                  All Products →
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-sans font-semibold text-sm text-white mb-4">Services</h3>
            <ul className="space-y-2.5">
              {INFO_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="font-sans text-sm text-white/50 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Location */}
          <div>
            <h3 className="font-sans font-semibold text-sm text-white mb-4">Find Us</h3>
            <address className="not-italic space-y-3">
              <div className="font-sans text-sm text-white/50 leading-relaxed">
                Sabaki, Mombasa Road<br />
                Past Signature Mall<br />
                Kenya
              </div>
              <div className="pt-1 border-t border-white/10">
                <p className="font-sans text-xs text-white/30 uppercase tracking-wider mb-1.5">Hours</p>
                <p className="font-sans text-sm text-white/50">Mon – Sat: 7:00am – 6:00pm</p>
                <p className="font-sans text-sm text-white/50">Sun: 8:00am – 1:00pm</p>
              </div>
            </address>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-sans text-xs text-white/30">
            © {new Date().getFullYear()} Waingo Farm & Agrovet. All rights reserved.
          </p>
          <Link href="/admin" className="font-sans text-xs text-white/20 hover:text-white/50 transition-colors">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}

function WhatsAppIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.2 8.2 0 004.79 1.53V6.77a4.85 4.85 0 01-1.02-.08z" />
    </svg>
  );
}
