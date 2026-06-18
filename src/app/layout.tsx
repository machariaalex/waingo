import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700', '800'],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['400', '500', '600', '700'],
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-ibm-plex-mono',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'Waingo Farm & Agrovet — Sabaki, Mombasa Road',
  description: 'Quality seeds, animal health products, feeds, supplements and farm equipment trusted by Kenyan farmers. On Mombasa Road past Signature Mall, Sabaki. Call Wilson: 0704 659 267.',
  keywords: ['agrovet', 'Mombasa', 'animal feeds', 'farm supplies', 'seeds', 'Kenya', 'Sabaki', 'Mombasa Road'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${jakarta.variable} ${ibmPlexMono.variable} font-sans bg-white text-ink antialiased`}>
        {children}
      </body>
    </html>
  );
}
