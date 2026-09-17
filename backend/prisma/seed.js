import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  console.log('Memulai proses seeding data rute...');

  // Hapus data lama jika ada
  await prisma.route.deleteMany();

  // Baca file routes.json
  const filePath = path.join(__dirname, '../data/routes.json');
  const rawData = fs.readFileSync(filePath, 'utf8');
  const { routes } = JSON.parse(rawData);

  // Masukkan data ke SQLite
  for (const item of routes) {
    await prisma.route.create({
      data: {
        category: item.category,
        pickup: item.pickup,
        drop: item.drop,
        price: item.price,
        priceFormatted: item.priceFormatted,
        title: item.title,
        description: item.description,
        image: item.image,
        badge: item.badge,
        icon: item.icon,
      },
    });
  }

  console.log(`Berhasil memasukkan ${routes.length} data rute ke database!`);
}

main()
  .catch((e) => {
    console.error('Gagal seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
