/**
 * Reset a Foundation website customer password by phone number.
 * Usage: npx ts-node scripts/reset-foundation-password.ts <phone> [newPassword]
 */
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
  return digits.slice(-10);
}

async function main() {
  const phoneArg = process.argv[2];
  const newPassword = process.argv[3] || 'Kedar@2026';

  if (!phoneArg) {
    console.error('Usage: npx ts-node scripts/reset-foundation-password.ts <phone> [newPassword]');
    process.exit(1);
  }

  const normalized = normalizePhone(phoneArg);
  const customers = await prisma.customer.findMany({
    where: { isDeleted: false, phone: { not: null } },
    include: { foundationAccount: true },
  });

  const customer = customers.find(
    (c) => c.phone && normalizePhone(c.phone) === normalized,
  );

  if (!customer) {
    console.error(`No customer found with phone ${phoneArg}`);
    process.exit(1);
  }

  if (!customer.foundationAccount) {
    console.error(`Customer "${customer.name}" has no Foundation website login. Register at /login first.`);
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.foundationAccount.update({
    where: { id: customer.foundationAccount.id },
    data: { passwordHash },
  });

  console.log('Password reset successfully.');
  console.log(`  Name:  ${customer.name}`);
  console.log(`  Email: ${customer.foundationAccount.email}`);
  console.log(`  Phone: ${customer.phone}`);
  console.log(`  New password: ${newPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
