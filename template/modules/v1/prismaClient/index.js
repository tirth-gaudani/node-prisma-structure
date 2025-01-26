const { PrismaClient } = require('@prisma/client');

var globalForPrisma = global.globalForPrisma || {};

const prisma = globalForPrisma.prisma || new PrismaClient();

globalForPrisma.prisma = prisma;
global.globalForPrisma = globalForPrisma;

process.on('SIGINT', async () => {
    await prisma.$disconnect();
    console.log('process exit called');
    process.exit();
});

module.exports = { prisma };
