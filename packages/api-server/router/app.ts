import * as trpc from '@trpc/server';
import { number, z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';

export interface ChatMessage {
  id: string
  user: string
  message: string
}

const prisma = new PrismaClient()

const messages: ChatMessage[] = [
  { id: uuidv4(), user: 'User1', message: 'This is my the first message!' },
  { id: uuidv4(), user: 'User2', message: 'Hello there 🎉' },
];

export const appRouter = trpc
  .router()
  .query('greetings', {
    resolve() {
      return {
        message: 'Greetings from /trpc/greetings :)',
      };
    },
  })
  .query('getDesigns', {
    async resolve() {
      const designs = await prisma.design.findMany()
      return designs
    }
  })
  .mutation('addDesign', {
    input: z.object({
      name: z.string(),
      systemId: z.number(),
      defaultItemId: z.number(),

    }),
    async resolve({ input }) {
      const data = {
        ...input,
      };
      const push = await prisma.design.create({data})
      return push;
    },
  });

export type AppRouter = typeof appRouter;
