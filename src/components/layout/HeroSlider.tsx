'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const SLIDES = [
  {
    src: 'https://images.unsplash.com/photo-1560603248-7a0649f99bed?auto=format&fit=crop&w=1920&q=80',
    alt: 'Aerial view of lush green tea plantation, Kenya',
    position: 'object-center object-top',
  },
  {
    src: 'https://images.unsplash.com/photo-1647463047632-f06655631086?auto=format&fit=crop&w=1920&q=80',
    alt: 'Woman farmer standing in a corn field, West Africa',
    position: 'object-center',
  },
  {
    src: 'https://images.unsplash.com/photo-1710149484964-d966b771c204?auto=format&fit=crop&w=1920&q=80',
    alt: 'African woman displaying freshly harvested rice grain',
    position: 'object-center',
  },
  {
    src: 'https://images.unsplash.com/photo-1509099381441-ea3c0cf98b94?auto=format&fit=crop&w=1920&q=80',
    alt: 'Women farming in the fields, East Africa',
    position: 'object-center',
  },
];

const INTERVAL = 5500;

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function advance() {
    setCurrent((c) => {
      setPrev(c);
      return (c + 1) % SLIDES.length;
    });
  }

  function goTo(i: number) {
    setPrev(current);
    setCurrent(i);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(advance, INTERVAL);
  }

  useEffect(() => {
    timerRef.current = setInterval(advance, INTERVAL);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  return (
    <section className="relative min-h-[88vh] flex flex-col justify-end overflow-hidden">

      {/* ── Slides ── */}
      {SLIDES.map((slide, i) => {
        const isActive = i === current;
        const isPrev = i === prev;
        return (
          <div
            key={slide.src}
            className="absolute inset-0 transition-opacity duration-[1600ms] ease-in-out"
            style={{ opacity: isActive ? 1 : 0, zIndex: isActive ? 2 : isPrev ? 1 : 0 }}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              className={`object-cover ${slide.position} ${isActive ? 'animate-ken-burns' : ''}`}
              sizes="100vw"
            />
          </div>
        );
      })}

      {/* ── Dark gradient overlay for text legibility ── */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/50 via-black/30 to-black/75 pointer-events-none" />

      {/* ── Hero text ── */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-4 md:px-6 pb-20 pt-36">
        <div className="max-w-2xl">

          {/* Location pill */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-7">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full flex-shrink-0 animate-pulse" />
            <span className="font-sans text-xs text-white/80 font-medium tracking-wide">
              Sabaki, Mombasa Road &middot; Open 7 days a week
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-serif font-bold text-white leading-[1.07] mb-5 drop-shadow-lg"
            style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4rem)' }}
          >
            Everything Your Farm{' '}
            <span className="text-harvest-light italic">Needs,</span>
            <br />
            Trusted by Kenyan Farmers
          </h1>

          {/* Sub-copy */}
          <p className="font-sans text-white/75 text-lg leading-relaxed mb-8 max-w-xl drop-shadow">
            Quality seeds, animal health products, feeds, supplements and farm equipment &mdash; all under one roof on Mombasa Road.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2.5 bg-harvest text-white font-sans font-semibold px-7 py-3.5 rounded-full hover:bg-harvest-light transition-all duration-200 text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Shop Products
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <a
              href="https://wa.me/254704659267"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-white/12 backdrop-blur-sm border border-white/30 text-white font-sans font-medium px-7 py-3.5 rounded-full hover:bg-white/22 transition-all duration-200 text-base"
            >
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Talk to an Expert
            </a>
          </div>
        </div>
      </div>

      {/* ── Slide indicators ── */}
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
            className={`transition-all duration-400 rounded-full ${
              i === current
                ? 'w-8 h-1.5 bg-white'
                : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
