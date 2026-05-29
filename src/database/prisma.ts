import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query'] : [], // NODE.ENV é uma variável de ambiente que indica o ambiente de execução da aplicação (desenvolvimento, produção, etc.). Se estiver em desenvolvimento, o Prisma irá logar as queries SQL no console.
});