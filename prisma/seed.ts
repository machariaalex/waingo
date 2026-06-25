import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const products = [
  // Animal Health
  { name: 'Terramycin Spray 150ml', slug: 'terramycin-spray-150ml', description: 'Broad-spectrum antibiotic spray for wounds and infections in cattle, poultry, and goats.', category: 'animal-health', price: 850, stock: 24, minStock: 5, unit: 'bottle', featured: true, imageUrl: 'https://images.unsplash.com/photo-VYJUFNh6Mvk?auto=format&fit=crop&w=800&q=80' },
  { name: 'Ivermectin 1% Injection 50ml', slug: 'ivermectin-1pct-50ml', description: 'Antiparasitic injection for cattle, sheep, and goats. Controls internal and external parasites.', category: 'animal-health', price: 1200, stock: 15, minStock: 5, unit: 'vial', imageUrl: 'https://images.unsplash.com/photo-nWKMtmbpxQs?auto=format&fit=crop&w=800&q=80' },
  { name: 'Newcastle Disease Vaccine (100 doses)', slug: 'newcastle-vaccine-100', description: 'Live freeze-dried vaccine for prevention of Newcastle disease in poultry.', category: 'animal-health', price: 650, stock: 30, minStock: 10, unit: 'vial', featured: true, imageUrl: 'https://images.unsplash.com/photo-1661963268465-6e586f17855c?auto=format&fit=crop&w=800&q=80' },
  { name: 'Foot & Mouth Disease Vaccine', slug: 'fmd-vaccine', description: 'FMD trivalent vaccine for cattle and pigs. Protects against strains O, A, and SAT2.', category: 'animal-health', price: 1800, stock: 8, minStock: 5, unit: 'dose', imageUrl: 'https://images.unsplash.com/photo-0MO1uUJoKw0?auto=format&fit=crop&w=800&q=80' },
  { name: 'Calcium Borogluconate 400ml', slug: 'calcium-borogluconate-400ml', description: 'IV solution for milk fever and hypocalcaemia in dairy cows.', category: 'animal-health', price: 550, stock: 20, minStock: 8, unit: 'bottle', imageUrl: '/images/calcium.jpeg' },
  { name: 'Penicillin-Streptomycin 100ml', slug: 'pen-strep-100ml', description: 'Combined antibiotic injection for respiratory and systemic infections.', category: 'animal-health', price: 780, stock: 18, minStock: 5, unit: 'vial', imageUrl: 'https://images.unsplash.com/photo-loJL4ijUobg?auto=format&fit=crop&w=800&q=80' },
  { name: 'Tick Grease (Acaricide) 1kg', slug: 'tick-grease-1kg', description: 'Grease-based acaricide for control of ticks, mites, and lice on cattle and sheep.', category: 'animal-health', price: 420, stock: 40, minStock: 10, unit: 'tin', imageUrl: 'https://images.unsplash.com/photo-FquDp5N1Gw0?auto=format&fit=crop&w=800&q=80' },
  { name: 'Vitamin ADE Injection 100ml', slug: 'vitamin-ade-100ml', description: 'Injectable vitamins A, D, and E for deficiency prevention in livestock.', category: 'animal-health', price: 680, stock: 22, minStock: 8, unit: 'vial', imageUrl: 'https://images.unsplash.com/photo-ybZ5hRxaWS4?auto=format&fit=crop&w=800&q=80' },

  // Feeds & Supplements
  { name: 'Unga Layer Mash 50kg', slug: 'unga-layer-mash-50kg', description: 'Complete layer feed for optimal egg production. Balanced protein and calcium.', category: 'feeds', price: 3200, stock: 45, minStock: 10, unit: 'bag', featured: true, imageUrl: 'https://images.unsplash.com/photo-1569466593977-94ee7ed02ec9?auto=format&fit=crop&w=800&q=80' },
  { name: 'Unga Chick Starter 50kg', slug: 'unga-chick-starter-50kg', description: 'High-protein starter feed for day-old chicks up to 8 weeks.', category: 'feeds', price: 3400, stock: 30, minStock: 10, unit: 'bag', imageUrl: 'https://images.unsplash.com/photo-1567326619821-2664df9c48da?auto=format&fit=crop&w=800&q=80' },
  { name: 'Dairy Meal 50kg', slug: 'dairy-meal-50kg', description: 'Concentrated dairy supplement for high-yielding cows. Increases milk production.', category: 'feeds', price: 2800, stock: 25, minStock: 8, unit: 'bag', featured: true, imageUrl: 'https://images.unsplash.com/photo-4MQtWCxUrYc?auto=format&fit=crop&w=800&q=80' },
  { name: 'Maize Germ 50kg', slug: 'maize-germ-50kg', description: 'Energy-rich poultry and pig feed supplement. High oil content.', category: 'feeds', price: 2200, stock: 35, minStock: 10, unit: 'bag', imageUrl: 'https://images.unsplash.com/photo-RNHpv06LWMU?auto=format&fit=crop&w=800&q=80' },
  { name: 'Rabbit Pellets 25kg', slug: 'rabbit-pellets-25kg', description: 'Complete balanced feed for rabbits. High fiber content for healthy digestion.', category: 'feeds', price: 1600, stock: 12, minStock: 5, unit: 'bag', imageUrl: 'https://images.unsplash.com/photo-o5JyQfuDDkQ?auto=format&fit=crop&w=800&q=80' },
  { name: 'Pig Grower Meal 50kg', slug: 'pig-grower-50kg', description: 'Balanced grower feed for pigs aged 20–60kg liveweight.', category: 'feeds', price: 2600, stock: 20, minStock: 8, unit: 'bag', imageUrl: 'https://images.unsplash.com/photo-auxz0RkXt7k?auto=format&fit=crop&w=800&q=80' },
  { name: 'Molasses 20L', slug: 'molasses-20l', description: 'Energy supplement for ruminants. Improves palatability of dry feeds.', category: 'feeds', price: 1100, stock: 15, minStock: 5, unit: 'jerry can', imageUrl: 'https://images.unsplash.com/photo-RxHhxWnXmNs?auto=format&fit=crop&w=800&q=80' },
  { name: 'Mineral Lick Block 3kg', slug: 'mineral-lick-3kg', description: 'Free-choice mineral block for cattle and goats. Salt, calcium, phosphorus, and trace minerals.', category: 'feeds', price: 380, stock: 60, minStock: 15, unit: 'block', imageUrl: 'https://images.unsplash.com/photo-n1U5UYQnkSY?auto=format&fit=crop&w=800&q=80' },

  // Seeds & Seedlings
  { name: 'Watermelon Seeds (Sugar Baby) 100g', slug: 'watermelon-sugar-baby-100g', description: 'Open-pollinated sugar baby watermelon. Round fruit, 6–8kg. Matures in 75–80 days.', category: 'seeds', price: 650, stock: 50, minStock: 10, unit: 'packet', featured: true, imageUrl: 'https://images.unsplash.com/photo-qxHshSm7XQU?auto=format&fit=crop&w=800&q=80' },
  { name: 'Sukuma Wiki Kale Seeds 100g', slug: 'sukuma-wiki-100g', description: 'Improved thousand-headed kale. High yield, tolerant of dry conditions. Staple green vegetable.', category: 'seeds', price: 280, stock: 80, minStock: 20, unit: 'packet', featured: true, imageUrl: 'https://images.unsplash.com/photo-yDpYrrOFQ5A?auto=format&fit=crop&w=800&q=80' },
  { name: 'Tomato Seeds (Tylka F1) 10g', slug: 'tomato-tylka-f1-10g', description: 'Determinate F1 hybrid. Disease-resistant. High yield, firm fruit for market.', category: 'seeds', price: 750, stock: 35, minStock: 10, unit: 'packet', imageUrl: 'https://images.unsplash.com/photo-2bJvF3C-Hbk?auto=format&fit=crop&w=800&q=80' },
  { name: 'Maize Seeds DK8031 2kg', slug: 'maize-dk8031-2kg', description: 'Certified DK8031 hybrid maize. High yield, drought-tolerant. 90-day variety.', category: 'seeds', price: 1400, stock: 40, minStock: 10, unit: 'bag', imageUrl: 'https://images.unsplash.com/photo-Q_MJjEN14uk?auto=format&fit=crop&w=800&q=80' },
  { name: 'Onion Seeds (Red Bombay) 50g', slug: 'onion-red-bombay-50g', description: 'Medium-size red onion. Good storage life. Performs well in coastal conditions.', category: 'seeds', price: 480, stock: 30, minStock: 8, unit: 'packet', imageUrl: 'https://images.unsplash.com/photo-edijxcD9xBg?auto=format&fit=crop&w=800&q=80' },
  { name: 'Capsicum Seeds (California Wonder) 10g', slug: 'capsicum-california-wonder-10g', description: 'Large bell pepper, 4-lobed. Green to red on maturity. Good market variety.', category: 'seeds', price: 520, stock: 25, minStock: 8, unit: 'packet', imageUrl: '/images/capsicum.jpeg' },
  { name: 'Napier Grass Cuttings (Bundle)', slug: 'napier-grass-cuttings', description: 'Fresh Napier/elephant grass cuttings. Bundle of 50 stems. Fast-growing fodder grass.', category: 'seeds', price: 200, stock: 100, minStock: 20, unit: 'bundle', imageUrl: 'https://images.unsplash.com/photo-MK7o68Pno3c?auto=format&fit=crop&w=800&q=80' },
  { name: 'Spinach Seeds (Mchicha) 50g', slug: 'spinach-mchicha-50g', description: 'Fast-growing local mchicha (amaranth). Ready to harvest in 30 days.', category: 'seeds', price: 180, stock: 60, minStock: 15, unit: 'packet', imageUrl: 'https://images.unsplash.com/photo-t6DpKVQdLYQ?auto=format&fit=crop&w=800&q=80' },

  // Tools & Fencing
  { name: 'Knapsack Sprayer 16L', slug: 'knapsack-sprayer-16l', description: 'Manual backpack sprayer. Brass pump, adjustable nozzle. For pesticides and herbicides.', category: 'tools', price: 3800, stock: 8, minStock: 3, unit: 'piece', featured: true, imageUrl: 'https://images.unsplash.com/photo-DDTYvkaL-Oo?auto=format&fit=crop&w=800&q=80' },
  { name: 'Hand Hoe (Jembe)', slug: 'hand-hoe-jembe', description: 'Heavy-duty local hoe with hardwood handle. Suitable for ridging and weeding.', category: 'tools', price: 650, stock: 20, minStock: 5, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-IClZBVw5W5A?auto=format&fit=crop&w=800&q=80' },
  { name: 'Panga (Machete)', slug: 'panga-machete', description: 'General-purpose panga with riveted wooden handle. 18-inch blade.', category: 'tools', price: 420, stock: 25, minStock: 8, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-DPQMn-nPSy8?auto=format&fit=crop&w=800&q=80' },
  { name: 'Watering Can 10L', slug: 'watering-can-10l', description: 'Galvanized steel watering can with detachable rose head.', category: 'tools', price: 850, stock: 12, minStock: 4, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-ovB9KUe5j_0?auto=format&fit=crop&w=800&q=80' },
  { name: 'Barbed Wire 1 Roll (200m)', slug: 'barbed-wire-200m', description: '200m roll of 2-strand barbed wire. Galvanized for rust resistance. For perimeter fencing.', category: 'tools', price: 4500, stock: 6, minStock: 3, unit: 'roll', imageUrl: '/images/barbed_wire.jpeg' },
  { name: 'Chain-Link Fencing 1.8m x 30m', slug: 'chain-link-1-8m-30m', description: '1.8m high chain-link fencing roll, 30m length. Galvanized for outdoor use.', category: 'tools', price: 8500, stock: 4, minStock: 2, unit: 'roll', imageUrl: '/images/chainlink.jpeg' },
  { name: 'Wheelbarrow (Steel Tray)', slug: 'wheelbarrow-steel', description: 'Heavy-duty construction wheelbarrow. 100L capacity, pneumatic tyre.', category: 'tools', price: 5500, stock: 5, minStock: 2, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-GjOWDRVLIUE?auto=format&fit=crop&w=800&q=80' },
  { name: 'Sickle / Mundu', slug: 'sickle-mundu', description: 'Traditional sickle for harvesting grass and crops. Hardened steel blade.', category: 'tools', price: 280, stock: 30, minStock: 8, unit: 'piece', imageUrl: 'https://images.unsplash.com/photo-yt8KHnkvXUQ?auto=format&fit=crop&w=800&q=80' },
];

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('waingo2024', 12);
  await prisma.adminUser.upsert({
    where: { username: 'wilson' },
    update: {},
    create: { username: 'wilson', password: hashedPassword },
  });
  console.log('Admin user created: wilson / waingo2024');

  // Create products
  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }
  console.log(`${products.length} products seeded.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
