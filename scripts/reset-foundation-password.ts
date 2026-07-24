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
