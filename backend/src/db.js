const { PrismaClient } = require('@prisma/client');

// Singleton : une seule instance partagée dans toute l'appli
const prisma = new PrismaClient();

module.exports = prisma;
