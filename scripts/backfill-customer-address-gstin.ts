/**
 * Additive backfill only — UPDATE null address/gstin. Never deletes.
 * Usage: npx ts-node scripts/backfill-customer-address-gstin.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ADDRESSES = [
  '12, SG Highway, Near Iscon Circle, Ahmedabad, Gujarat 380015',
  '45, FC Road, Shivajinagar, Pune, Maharashtra 411005',
  '78, Ring Road, Satellite, Ahmedabad, Gujarat 380015',
  '3rd Floor, Business Plaza, Andheri East, Mumbai, Maharashtra 400069',
  'Plot 22, GIDC Estate, Vatva, Ahmedabad, Gujarat 382445',
  'B-14, Industrial Area, Phase 2, Chandigarh 160002',
  'Near Railway Station, Station Road, Surat, Gujarat 395003',
  'Shop 9, Main Market, Kalupur, Ahmedabad, Gujarat 380001',
];

function randomGstin(stateCode = '24'): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const pan =
    Array.from({ length: 5 }, () => letters[Math.floor(Math.random() * 26)]).join('') +
    String(Math.floor(1000 + Math.random() * 9000)) +
    letters[Math.floor(Math.random() * 26)];
  return `${stateCode}${pan}1Z${Math.floor(Math.random() * 10)}`;
}

async function main() {
  const customers = await prisma.customer.findMany({
    where: {
      isDeleted: false,
      OR: [{ address: null }, { address: '' }, { gstin: null }, { gstin: '' }],
    },
  });

  console.log(`Found ${customers.length} customer(s) missing address and/or GSTIN`);

  let updated = 0;
  for (let i = 0; i < customers.length; i++) {
    const c = customers[i];
    const data: { address?: string; gstin?: string } = {};
    if (!c.address?.trim()) {
      data.address = ADDRESSES[i % ADDRESSES.length];
    }
    if (!c.gstin?.trim()) {
      const stateCode = (c.state || '').toLowerCase().includes('maha') ? '27' : '24';
      data.gstin = randomGstin(stateCode);
    }
    if (!Object.keys(data).length) continue;

    await prisma.customer.update({
      where: { id: c.id },
      data,
    });
    updated += 1;
    console.log(`Updated ${c.name}: ${JSON.stringify(data)}`);
  }

  console.log(`Done. Updated ${updated} customer(s). No rows deleted.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
