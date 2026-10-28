import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const ROLES = [
  { name: 'Owner', permissions: ['*'] },
  { name: 'Admin', permissions: ['*'] },
  {
    name: 'Manager',
    permissions: [
      'dashboard:read', 'manufacturing:read', 'manufacturing:write',
      'inventory:read', 'inventory:write', 'sales:read', 'sales:write',
      'customers:read', 'customers:write', 'payments:read', 'payments:write',
      'delivery:read', 'delivery:write', 'products:read', 'products:write',
    ],
  },
  {
    name: 'Accountant',
    permissions: [
      'dashboard:read', 'sales:read', 'sales:write',
      'customers:read', 'customers:write', 'payments:read', 'payments:write', 'products:read',
    ],
  },
  {
    name: 'Warehouse',
    permissions: [
      'dashboard:read',
      'manufacturing:read', 'manufacturing:write',
      'inventory:read', 'inventory:write',
      'delivery:read', 'delivery:write', 'products:read',
    ],
  },
  {
    name: 'Sales',
    permissions: [
      'dashboard:read',
      'sales:read', 'sales:write', 'customers:read', 'customers:write', 'products:read',
    ],
  },
];

const DEMO_USERS = [
  { name: 'Admin User', email: 'admin@kedarenterprise.com', role: 'Owner' },
  { name: 'Rajesh Manager', email: 'manager@kedarenterprise.com', role: 'Manager' },
  { name: 'Priya Accountant', email: 'accountant@kedarenterprise.com', role: 'Accountant' },
  { name: 'Suresh Warehouse', email: 'warehouse@kedarenterprise.com', role: 'Warehouse' },
  { name: 'Amit Sales', email: 'sales@kedarenterprise.com', role: 'Sales' },
];

const CATEGORIES = [
  'Grains', 'Pulses', 'Flour', 'Snacks', 'Spices', 'Other Agricultural Products',
];

const UNITS = [
  { name: 'Kilogram', symbol: 'kg' },
  { name: 'Quintal', symbol: 'qtl' },
  { name: 'Bag', symbol: 'bag' },
  { name: 'Packet', symbol: 'pkt' },
];

const PRODUCTS = [
  { name: 'Wheat', category: 'Grains', unit: 'Quintal', price: 2200, hsn: '1001', gst: 0 },
  { name: 'Bajra', category: 'Grains', unit: 'Quintal', price: 1800, hsn: '1008', gst: 0 },
  { name: 'Chana', category: 'Pulses', unit: 'Quintal', price: 5500, hsn: '0713', gst: 0 },
  { name: 'Moong', category: 'Pulses', unit: 'Quintal', price: 8500, hsn: '0713', gst: 0 },
  { name: 'Toor Dal', category: 'Pulses', unit: 'Quintal', price: 12000, hsn: '0713', gst: 0 },
  { name: 'Wheat Flour', category: 'Flour', unit: 'Bag', price: 450, hsn: '1101', gst: 5 },
  { name: 'Potato Wafers', category: 'Snacks', unit: 'Packet', price: 20, hsn: '1905', gst: 12 },
  { name: 'Potato Chips', category: 'Snacks', unit: 'Packet', price: 25, hsn: '1905', gst: 12 },
  { name: 'Mustard', category: 'Spices', unit: 'Kilogram', price: 120, hsn: '1207', gst: 5 },
  { name: 'Cumin', category: 'Spices', unit: 'Kilogram', price: 450, hsn: '0909', gst: 5 },
];

// Website pre-booking catalogue — 5% tax included directly.
const PREBOOK_PRODUCTS = [
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
  console.log('Seeding Kedar ERP database...');

  for (const role of ROLES) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: { permissions: role.permissions },
      create: { name: role.name, permissions: role.permissions },
    });
  }

  const passwordHash = await bcrypt.hash('admin123', 10);
  for (const u of DEMO_USERS) {
    const role = await prisma.role.findUnique({ where: { name: u.role } });
    await prisma.user.upsert({
      where: { email: u.email },
      update: { roleId: role!.id },
      create: { name: u.name, email: u.email, passwordHash, roleId: role!.id },
    });
  }

  for (const cat of CATEGORIES) {
    await prisma.productCategory.upsert({
      where: { name: cat },
      update: {},
      create: { name: cat },
    });
  }

  for (const unit of UNITS) {
    await prisma.unit.upsert({
      where: { name: unit.name },
      update: {},
      create: unit,
    });
  }

  const categories = await prisma.productCategory.findMany();
  const units = await prisma.unit.findMany();
  const catMap = Object.fromEntries(categories.map((c) => [c.name, c.id]));
  const unitMap = Object.fromEntries(units.map((u) => [u.name, u.id]));

  for (const p of PRODUCTS) {
    const existing = await prisma.product.findFirst({ where: { name: p.name } });
    if (!existing) {
      await prisma.product.create({
        data: {
          name: p.name,
          categoryId: catMap[p.category],
          unitId: unitMap[p.unit],
          price: p.price,
          hsnCode: p.hsn,
          gstRate: p.gst,
        },
      });
    }
  }

  for (const p of PREBOOK_PRODUCTS) {
    const prebookFields = { description: p.description, packSize: p.packSize, prebookEnabled: true };
    const existing = await prisma.product.findFirst({ where: { name: p.name } });
    if (existing) {
      await prisma.product.update({ where: { id: existing.id }, data: prebookFields });
    } else {
      await prisma.product.create({
        data: {
          name: p.name,
          categoryId: catMap[p.category],
          unitId: unitMap[p.unit],
          price: p.price,
          hsnCode: p.hsn,
          gstRate: p.gst,
          ...prebookFields,
        },
      });
    }
  }

  const fy = new Date().getMonth() >= 3
    ? `${new Date().getFullYear()}-${(new Date().getFullYear() + 1).toString().slice(-2)}`
    : `${new Date().getFullYear() - 1}-${new Date().getFullYear().toString().slice(-2)}`;

  await prisma.invoiceSequence.upsert({
    where: { financialYear: fy },
    update: {},
    create: { financialYear: fy, lastNumber: 0 },
  });

  const sampleCustomers = [
    { name: 'Sharma Wholesale', phone: '9876543210', city: 'Pune', state: 'Maharashtra', creditLimit: 500000 },
    { name: 'Patel Retail Store', phone: '9876543211', city: 'Mumbai', state: 'Maharashtra', creditLimit: 100000 },
    { name: 'Gupta Traders', phone: '9876543212', city: 'Ahmedabad', state: 'Gujarat', creditLimit: 300000 },
  ];

  for (const c of sampleCustomers) {
    const existing = await prisma.customer.findFirst({ where: { name: c.name } });
    if (!existing) {
      await prisma.customer.create({ data: c });
    }
  }

  console.log('Seed completed!');
  console.log('Demo logins (password: admin123 for all):');
  DEMO_USERS.forEach((u) => console.log(`  ${u.role}: ${u.email}`));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
