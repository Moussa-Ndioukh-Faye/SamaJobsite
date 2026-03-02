const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('Admin1234', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@samajob.sn' },
    update: {},
    create: {
      nom:       'Administrateur SamaJob',
      email:     'admin@samajob.sn',
      motDePasse: hashedPassword,
      role:      'ADMIN',
      statut:    'VALIDE',
    },
  });

  console.log('✅ Compte admin créé :');
  console.log('   Email    :', admin.email);
  console.log('   Mot de passe : Admin1234');
  console.log('   Rôle     :', admin.role);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
