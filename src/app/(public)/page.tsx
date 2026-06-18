import Link from 'next/link';
import { prisma } from '@/lib/db';
import ProductCard from '@/components/shop/ProductCard';
import HeroSlider from '@/components/layout/HeroSlider';
import type { Product } from '@/types';

export const revalidate = 60;

async function getFeatured(): Promise<Product[]> {
  const p = await prisma.product.findMany({ where: { featured: true, active: true }, orderBy: { updatedAt: 'desc' }, take: 8 });
  return p as unknown as Product[];
}

export default async function HomePage() {
  const featured = await getFeatured();
  const heroFeatured = featured.slice(0, 1)[0];
  const restFeatured = featured.slice(1, 7);

  return (
    <div className="bg-white">
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <HeroSlider />

      {/* ── TRUST BADGES ─────────────────────────────────────────── */}
      <section className="bg-parchment border-b border-rule">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-rule">
            {[
              { icon: <ShieldIcon />, label: 'Genuine Products', sub: 'Certified & verified' },
              { icon: <TruckIcon />, label: 'Fast Delivery', sub: 'Along Mombasa corridor' },
              { icon: <HeadsetIcon />, label: 'Farmer Support', sub: 'Talk directly to Wilson' },
              { icon: <StarShieldIcon />, label: 'Trusted for Years', sub: 'By farmers across Kenya' },
            ].map((badge) => (
              <div key={badge.label} className="flex items-center gap-3 px-4 md:px-6 py-4 md:py-5">
                <div className="text-forest flex-shrink-0">{badge.icon}</div>
                <div>
                  <div className="font-sans font-semibold text-sm text-ink">{badge.label}</div>
                  <div className="font-sans text-xs text-ink-light">{badge.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <div className="mb-8">
          <h2 className="font-serif font-bold text-3xl text-ink mb-2">Shop by Category</h2>
          <p className="font-sans text-ink-light text-base">Find what you need, whether it&apos;s a vaccine, a seed packet, or a bag of feed.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { href: '/shop?category=seeds', label: 'Seeds & Seedlings', sub: 'Open-pollinated & hybrid', count: 8, bg: 'category-card-seeds' },
            { href: '/shop?category=animal-health', label: 'Animal Health', sub: 'Vaccines, treatments & more', count: 8, bg: 'category-card-health' },
            { href: '/shop?category=feeds', label: 'Feeds & Supplements', sub: 'Poultry, cattle & rabbits', count: 8, bg: 'category-card-feeds' },
            { href: '/shop?category=tools', label: 'Tools & Equipment', sub: 'Sprayers, jembes, fencing', count: 8, bg: 'category-card-tools' },
          ].map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className={`${cat.bg} group relative rounded-lg overflow-hidden h-44 md:h-52 flex flex-col justify-end p-5 hover:shadow-card-hover transition-shadow`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="relative">
                <div className="font-sans text-xs text-white/60 mb-1">{cat.sub}</div>
                <h3 className="font-serif font-bold text-white text-lg leading-tight">{cat.label}</h3>
                <div className="mt-2 flex items-center gap-1 text-white/70 group-hover:text-white transition-colors">
                  <span className="font-sans text-xs font-medium">Browse</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── BEST SELLERS ─────────────────────────────────────────── */}
      <section className="bg-parchment py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-serif font-bold text-3xl text-ink mb-1">Best Sellers</h2>
              <p className="font-sans text-ink-light text-sm">Our most popular products, consistently in demand.</p>
            </div>
            <Link href="/shop" className="hidden md:inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-forest hover:text-forest-mid transition-colors">
              See all products <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Featured large card + grid */}
          {featured.length > 0 && (
            <div className="grid md:grid-cols-3 gap-5">
              {/* Large featured item */}
              {heroFeatured && (
                <div className="md:col-span-1">
                  <ProductCard product={heroFeatured} variant="featured" />
                </div>
              )}

              {/* 2-col grid */}
              <div className="md:col-span-2 grid grid-cols-2 gap-4">
                {restFeatured.slice(0, 4).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 text-center md:hidden">
            <Link href="/shop" className="inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-forest">
              See all products <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ────────────────────────────────────────── */}
      <section className="bg-forest py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif font-bold text-white mb-3" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}>
              Why Farmers Choose Waingo
            </h2>
            <p className="font-sans text-white/60 text-base max-w-xl mx-auto">
              We&apos;re not a catalogue. We&apos;re farmers and advisors who know what works in Kenyan conditions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <CertifiedIcon />,
                title: 'Genuine Farm Inputs',
                body: 'Every product we stock is verified and sourced from reputable manufacturers. No counterfeits, no shortcuts.',
              },
              {
                icon: <HandshakeIcon />,
                title: 'Expert Advice',
                body: 'Wilson and the team give real recommendations based on your specific livestock and crop conditions.',
              },
              {
                icon: <DeliveryIcon />,
                title: 'Nationwide Delivery',
                body: 'We deliver across Kenya with priority service along the Mombasa–Nairobi corridor.',
              },
              {
                icon: <PriceTagIcon />,
                title: 'Competitive Pricing',
                body: 'We price fairly, buy in bulk, and pass those savings to farmers without compromising quality.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-white/8 border border-white/10 rounded-lg p-6">
                <div className="text-sage mb-4">{item.icon}</div>
                <h3 className="font-sans font-semibold text-white text-base mb-2">{item.title}</h3>
                <p className="font-sans text-sm text-white/55 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <div className="mb-10">
          <h2 className="font-serif font-bold text-3xl text-ink mb-2">Farmers Trust Us</h2>
          <p className="font-sans text-ink-light text-base">Real people, real results. From small-scale to commercial farmers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote: "I've been buying my layer feeds and Newcastle vaccines from Waingo for two years. Wilson always advises me correctly, my flock mortality dropped significantly after switching brands on his recommendation.",
              name: 'Peter Mwangi',
              location: 'Poultry Farmer, Machakos',
              initials: 'PM',
            },
            {
              quote: "Ordered watermelon seeds and they germinated at nearly 95%. The harvest was excellent. Waingo is the only agrovet I trust for vegetable seeds — they know their stock and they're honest about what grows well here.",
              name: 'Grace Achieng',
              location: 'Horticulture Farmer, Kwale',
              initials: 'GA',
            },
            {
              quote: "They came out for a vet visit when my dairy cows were showing FMD symptoms. Fast response, the right diagnosis, the right treatment. The whole herd recovered. I wouldn't go anywhere else.",
              name: 'Joseph Kamau',
              location: 'Dairy Farmer, Kilifi',
              initials: 'JK',
            },
          ].map((t) => (
            <div key={t.name} className="bg-parchment rounded-lg p-6">
              <svg className="w-8 h-8 text-rule mb-4" fill="currentColor" viewBox="0 0 32 32">
                <path d="M10 8C5.6 8 2 11.6 2 16s3.6 8 8 8c.7 0 1.4-.1 2-.3C11.4 25 10 26.8 10 29h4c0-2.8 1.6-5.4 4-6.9V8h-8zm18 0c-4.4 0-8 3.6-8 8s3.6 8 8 8c.7 0 1.4-.1 2-.3C29.4 25 28 26.8 28 29h4c0-2.8 1.6-5.4 4-6.9V8h-8z" />
              </svg>
              <p className="font-sans text-sm text-ink-mid leading-relaxed mb-5">{t.quote}</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-forest flex items-center justify-center flex-shrink-0">
                  <span className="font-sans font-bold text-white text-xs">{t.initials}</span>
                </div>
                <div>
                  <div className="font-sans font-semibold text-sm text-ink">{t.name}</div>
                  <div className="font-sans text-xs text-ink-light">{t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FROM THE FARM ─────────────────────────────────────────── */}
      <section id="from-the-farm" className="bg-parchment-dark py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-serif font-bold text-3xl text-ink mb-1">From the Farm</h2>
              <p className="font-sans text-ink-light text-sm">Farming tips, seasonal advice, and stories from Waingo Farm.</p>
            </div>
            <a
              href="https://www.tiktok.com/@waingofarmagrovet"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 font-sans text-sm font-medium text-ink-mid hover:text-forest transition-colors"
            >
              <TikTokIcon />
              Follow on TikTok
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                tag: 'Crops',
                title: 'Watermelon Farming on Sandy Soil: What We Learned This Season',
                body: 'After three seasons growing Sugar Baby watermelons at the Sabaki plot, here\'s what made the difference in yield and fruit size — including irrigation timing and spacing.',
                readTime: '4 min read',
                bgClass: 'category-card-seeds',
              },
              {
                tag: 'Livestock',
                title: 'Newcastle Disease in Layers: Early Signs and How to Act Fast',
                body: 'We see Newcastle outbreaks every dry season. This is the vaccination schedule and early warning signs that have saved hundreds of birds for our customers.',
                readTime: '3 min read',
                bgClass: 'category-card-health',
              },
              {
                tag: 'Seasonal Advice',
                title: 'What to Plant in October: A Guide for Coastal Kenya Farmers',
                body: 'October marks the start of the short rains along the Mombasa corridor. These are the seeds and planting tips that give the best results in this window.',
                readTime: '5 min read',
                bgClass: 'category-card-feeds',
              },
            ].map((post) => (
              <article key={post.title} className="bg-white rounded-lg overflow-hidden shadow-card group cursor-pointer">
                <div className={`${post.bgClass} h-36 relative flex items-end p-4`}>
                  <div className="absolute inset-0 bg-black/30" />
                  <span className="relative bg-white/15 backdrop-blur-sm border border-white/20 text-white font-sans font-medium text-xs px-2.5 py-1 rounded">
                    {post.tag}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-serif font-semibold text-base text-ink group-hover:text-forest transition-colors leading-snug mb-2">
                    {post.title}
                  </h3>
                  <p className="font-sans text-sm text-ink-light leading-relaxed line-clamp-3 mb-4">{post.body}</p>
                  <span className="font-sans text-xs text-ink-light">{post.readTime}</span>
                </div>
              </article>
            ))}
          </div>

          {/* TikTok CTA */}
          <div className="mt-8 bg-ink rounded-lg p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <TikTokIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-serif font-bold text-white text-lg">3.8 million likes on TikTok</div>
                <div className="font-sans text-white/50 text-sm">Real farm life from Sabaki — watermelons, livestock, daily tips.</div>
              </div>
            </div>
            <a
              href="https://www.tiktok.com/@waingofarmagrovet"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 inline-flex items-center gap-2 bg-white text-ink font-sans font-semibold text-sm px-5 py-2.5 rounded hover:bg-parchment transition-colors"
            >
              <TikTokIcon />
              Follow @waingofarm
            </a>
          </div>
        </div>
      </section>

      {/* ── BOOKING CTA ──────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <div className="grid md:grid-cols-2 gap-5">
          {/* Vet call-out */}
          <div className="bg-bark rounded-lg p-8 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5" style={{ background: 'radial-gradient(ellipse 80% 80% at 90% 20%, #fff, transparent)' }} />
            <div className="relative">
              <span className="inline-block bg-white/15 text-white font-sans text-xs font-medium px-2.5 py-1 rounded mb-4">Vet Services</span>
              <h3 className="font-serif font-bold text-white text-2xl mb-2">Need a vet call-out?</h3>
              <p className="font-sans text-white/65 text-sm leading-relaxed mb-6">
                Wilson can arrange a qualified vet to visit your farm for diagnosis, treatment, and vaccination programmes.
              </p>
              <Link href="/booking" className="inline-flex items-center gap-2 bg-white text-bark font-sans font-semibold text-sm px-5 py-2.5 rounded hover:bg-parchment transition-colors">
                Book a Vet Visit <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Bulk orders */}
          <div className="bg-parchment border border-rule rounded-lg p-8">
            <span className="inline-block bg-forest/10 text-forest font-sans text-xs font-medium px-2.5 py-1 rounded mb-4">Bulk Orders</span>
            <h3 className="font-serif font-bold text-ink text-2xl mb-2">Buying in bulk?</h3>
            <p className="font-sans text-ink-light text-sm leading-relaxed mb-6">
              Commercial farms and cooperatives get better pricing on bulk feeds, seeds, and health products. Call Wilson directly to discuss your requirements.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="tel:+254704659267" className="inline-flex items-center gap-2 bg-forest text-white font-sans font-semibold text-sm px-5 py-2.5 rounded hover:bg-forest-mid transition-colors">
                Call 0704 659 267
              </a>
              <a href="https://wa.me/254704659267" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-rule text-ink-mid font-sans font-medium text-sm px-5 py-2.5 rounded hover:bg-parchment-dark transition-colors">
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ── Icons ─────────────────────────────────────────────────────────

function ArrowRight({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
    </svg>
  );
}

function HeadsetIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

function StarShieldIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  );
}

function CertifiedIcon() {
  return (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  );
}

function HandshakeIcon() {
  return (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function DeliveryIcon() {
  return (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
    </svg>
  );
}

function PriceTagIcon() {
  return (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  );
}

function TikTokIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.2 8.2 0 004.79 1.53V6.77a4.85 4.85 0 01-1.02-.08z" />
    </svg>
  );
}
