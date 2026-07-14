<<<<<<< HEAD
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const email = 'prajapatiaryan3103@gmail.com';
const password = 'Kedar@2026';
const name = 'Aryan Prajapati';

async function main() {
  const prisma = new PrismaClient();
  try {
    const normalized = email.toLowerCase().trim();
    let account = await prisma.foundationAccount.findUnique({
      where: { email: normalized },
      include: { customer: true },
    });

    if (!account) {
      let customer = await prisma.customer.findFirst({
        where: {
          isDeleted: false,
          OR: [
            { email: normalized },
            { email: { equals: email, mode: 'insensitive' } },
          ],
        },
      });

      if (!customer) {
        customer = await prisma.customer.create({
          data: {
            name,
            email: normalized,
            state: 'Gujarat',
            creditLimit: 0,
          },
        });
        console.log(`Created customer record for ${normalized}`);
      }

      const passwordHash = await bcrypt.hash(password, 10);
      account = await prisma.foundationAccount.create({
        data: {
          customerId: customer.id,
          email: normalized,
          passwordHash,
        },
        include: { customer: true },
      });
      console.log(`Created foundation account for ${normalized} (${customer.name})`);
    } else {
      const passwordHash = await bcrypt.hash(password, 10);
      await prisma.foundationAccount.update({
        where: { id: account.id },
        data: { passwordHash, isActive: true },
      });
      console.log(`Password reset for ${normalized} (${account.customer.name})`);
    }

    const verify = await prisma.foundationAccount.findUnique({ where: { email: normalized } });
    if (!verify) {
      console.error('Verification failed: account not found after update');
      process.exit(1);
    }
    const ok = await bcrypt.compare(password, verify.passwordHash);
    console.log(ok ? 'Verified: password is set correctly' : 'Verification failed: password mismatch');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
=======
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
>>>>>>> 21f639055a5d2dafd5ce9461fd916247f95309b9
