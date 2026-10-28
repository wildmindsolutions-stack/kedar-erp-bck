import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PREBOOK_CATALOGUE = [
  // (1) Wheat Aata: 5 kg, 10 kg, 25 kg
  {
    name: 'Wheat Aata (5 kg)',
    category: 'Flour',
    unit: 'Bag',
    packSize: '5 kg',
    price: 200,
    hsn: '1101',
    gst: 5,
    description: 'Fresh stone-ground pure whole wheat atta. Soft rotis, rich flavour, 100% natural with no preservatives. 5% tax included.',
  },
  {
    name: 'Wheat Aata (10 kg)',
    category: 'Flour',
    unit: 'Bag',
    packSize: '10 kg',
    price: 380,
    hsn: '1101',
    gst: 5,
    description: 'Fresh stone-ground pure whole wheat atta in standard 10 kg family pack. Soft rotis every day. 5% tax included.',
  },
  {
    name: 'Wheat Aata (25 kg)',
    category: 'Flour',
    unit: 'Bag',
    packSize: '25 kg',
    price: 900,
    hsn: '1101',
    gst: 5,
    description: 'Wholesale value 25 kg bag of premium stone-ground whole wheat atta. 5% tax included.',
  },

  // (2) Multigrain Aata: 5 kg, 10 kg, 15 kg
  {
    name: 'Multigrain Aata (5 kg)',
    category: 'Flour',
    unit: 'Bag',
    packSize: '5 kg',
    price: 260,
    hsn: '1101',
    gst: 5,
    description: 'Healthy wholesome blend of wheat, chana, jowar, bajra, ragi and methi. High fibre, diabetic-friendly. 5% tax included.',
  },
  {
    name: 'Multigrain Aata (10 kg)',
    category: 'Flour',
    unit: 'Bag',
    packSize: '10 kg',
    price: 520,
    hsn: '1101',
    gst: 5,
    description: 'Nutrient-dense multigrain atta for daily family wellness in economical 10 kg pack. 5% tax included.',
  },
  {
    name: 'Multigrain Aata (15 kg)',
    category: 'Flour',
    unit: 'Bag',
    packSize: '15 kg',
    price: 780,
    hsn: '1101',
    gst: 5,
    description: '15 kg monthly pack of wholesome farm-fresh multigrain atta. 5% tax included.',
  },

  // (3) Wheat: 25 kg
  {
    name: 'Wheat (25 kg)',
    category: 'Grains',
    unit: 'Bag',
    packSize: '25 kg',
    price: 550,
    hsn: '1001',
    gst: 5,
    description: 'Cleaned, sun-dried bold premium wheat grain. Specially graded for home flour milling and yearly storage. 5% tax included.',
  },

  // (4) Bajra Aata: 1 kg, 5 kg
  {
    name: 'Bajra Aata (1 kg)',
    category: 'Flour',
    unit: 'Bag',
    packSize: '1 kg',
    price: 45,
    hsn: '1102',
    gst: 5,
    description: 'Freshly milled pearl millet flour, gluten-free and packed with natural minerals and iron. 5% tax included.',
  },
  {
    name: 'Bajra Aata (5 kg)',
    category: 'Flour',
    unit: 'Bag',
    packSize: '5 kg',
    price: 220,
    hsn: '1102',
    gst: 5,
    description: 'Stone-ground 5 kg bajra atta for winter rotlas and nutritious wholesome meals. 5% tax included.',
  },

  // (5) Chanaa Besan: 1 kg, 2 kg, 5 kg, 10 kg
  {
    name: 'Chanaa Besan (1 kg)',
    category: 'Flour',
    unit: 'Bag',
    packSize: '1 kg',
    price: 90,
    hsn: '1106',
    gst: 5,
    description: '100% pure chana dal besan, finely milled, aromatic and unadulterated. Perfect for sweets, pakodas and dhokla. 5% tax included.',
  },
  {
    name: 'Chanaa Besan (2 kg)',
    category: 'Flour',
    unit: 'Bag',
    packSize: '2 kg',
    price: 180,
    hsn: '1106',
    gst: 5,
    description: '2 kg pure chana dal besan. Freshly packed, rich natural golden colour and aroma. 5% tax included.',
  },
  {
    name: 'Chanaa Besan (5 kg)',
    category: 'Flour',
    unit: 'Bag',
    packSize: '5 kg',
    price: 450,
    hsn: '1106',
    gst: 5,
    description: '5 kg kitchen pack of pure unadulterated chana dal besan. 5% tax included.',
  },
  {
    name: 'Chanaa Besan (10 kg)',
    category: 'Flour',
    unit: 'Bag',
    packSize: '10 kg',
    price: 890,
    hsn: '1106',
    gst: 5,
    description: '10 kg wholesale pack of premium pure gram flour (besan). 5% tax included.',
  },

  // (6) Chana Dal: 2.5 kg, 5 kg, 10 kg, 20 kg
  {
    name: 'Chana Dal (2.5 kg)',
    category: 'Pulses',
    unit: 'Bag',
    packSize: '2.5 kg',
    price: 200,
    hsn: '0713',
    gst: 5,
    description: 'Unpolished premium split chana dal. High protein, naturally sweet flavour, quick cooking. 5% tax included.',
  },
  {
    name: 'Chana Dal (5 kg)',
    category: 'Pulses',
    unit: 'Bag',
    packSize: '5 kg',
    price: 400,
    hsn: '0713',
    gst: 5,
    description: '5 kg pack of carefully sorted and cleaned split chana dal. 5% tax included.',
  },
  {
    name: 'Chana Dal (10 kg)',
    category: 'Pulses',
    unit: 'Bag',
    packSize: '10 kg',
    price: 800,
    hsn: '0713',
    gst: 5,
    description: '10 kg family pack of premium unpolished chana dal. 5% tax included.',
  },
  {
    name: 'Chana Dal (20 kg)',
    category: 'Pulses',
    unit: 'Bag',
    packSize: '20 kg',
    price: 1600,
    hsn: '0713',
    gst: 5,
    description: '20 kg wholesale sack of highest grade chana dal directly from Gujarat farms. 5% tax included.',
  },

  // (7) Maiz Aata: 5 kg, 10 kg
  {
    name: 'Maiz Aata (5 kg)',
    category: 'Flour',
    unit: 'Bag',
    packSize: '5 kg',
    price: 200,
    hsn: '1102',
    gst: 5,
    description: 'Traditional stone-ground yellow maize (corn) flour for authentic makki ki roti. Pure, fragrant and wholesome. 5% tax included.',
  },
  {
    name: 'Maiz Aata (10 kg)',
    category: 'Flour',
    unit: 'Bag',
    packSize: '10 kg',
    price: 400,
    hsn: '1102',
    gst: 5,
    description: '10 kg pack of pure stone-ground maize atta for authentic traditional taste. 5% tax included.',
  },
];

async function main() {
  console.log('Updating pre-booking catalogue to the 7 required products...');

  // Step 1: Disable prebook on any old products
  const disabled = await prisma.product.updateMany({
    where: { prebookEnabled: true },
    data: { prebookEnabled: false },
  });
  console.log(`Disabled prebook on ${disabled.count} previous products.`);

  const categories = await prisma.productCategory.findMany();
  const units = await prisma.unit.findMany();
  const catMap = Object.fromEntries(categories.map((c) => [c.name, c.id]));
  const unitMap = Object.fromEntries(units.map((u) => [u.name, u.id]));

  for (const item of PREBOOK_CATALOGUE) {
    const categoryId = catMap[item.category];
    const unitId = unitMap[item.unit];
    if (!categoryId || !unitId) {
      throw new Error(`Category "${item.category}" or Unit "${item.unit}" not found`);
    }

    const existing = await prisma.product.findFirst({
      where: { name: item.name },
    });

    let productId: string;
    if (existing) {
      const updated = await prisma.product.update({
        where: { id: existing.id },
        data: {
          categoryId,
          unitId,
          price: item.price,
          packSize: item.packSize,
          description: item.description,
          hsnCode: item.hsn,
          gstRate: item.gst,
          prebookEnabled: true,
          isActive: true,
          isDeleted: false,
        },
      });
      productId = updated.id;
      console.log(`Updated pre-booking product: ${item.name} (₹${item.price})`);
    } else {
      const created = await prisma.product.create({
        data: {
          name: item.name,
          categoryId,
          unitId,
          price: item.price,
          packSize: item.packSize,
          description: item.description,
          hsnCode: item.hsn,
          gstRate: item.gst,
          prebookEnabled: true,
          isActive: true,
        },
      });
      productId = created.id;
      console.log(`Created pre-booking product: ${item.name} (₹${item.price})`);
    }

    // Ensure demo stock exists for testing
    const stockCount = await prisma.stockLedger.aggregate({
      where: { productId },
      _sum: { qtyChange: true },
    });
    const currentStock = Number(stockCount._sum.qtyChange ?? 0);
    if (currentStock < 100) {
      const needed = 500 - currentStock;
      const batch = await prisma.productionBatch.create({
        data: {
          productId,
          batchNo: `BATCH-PRE-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
          batchDate: new Date(),
          qtyProduced: needed,
          notes: 'Initial stock for pre-booking fulfilment',
        },
      });
      await prisma.stockLedger.create({
        data: {
          productId,
          qtyChange: needed,
          reason: 'PRODUCTION',
          refId: batch.id,
          notes: 'Pre-booking stock seed',
        },
      });
      console.log(`  + Seeded 500 units stock for ${item.name}`);
    }
  }

  const finalCount = await prisma.product.count({ where: { prebookEnabled: true } });
  console.log(`\nPre-booking catalogue ready! Total enabled products: ${finalCount}`);
}

main()
  .catch((e) => {
    console.error('Failed to update pre-booking products:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
