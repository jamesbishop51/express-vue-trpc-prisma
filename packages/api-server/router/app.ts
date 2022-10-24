import * as trpc from '@trpc/server';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';

export interface ChatMessage {
  id: string;
  user: string;
  message: string;
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
  .query('getMessages', {
    input: z.number().default(10),
    resolve({ input }) {
      return messages.slice(-input);
    },
  })
  .mutation('addMessage', {
    input: z.object({
      user: z.string(),
      message: z.string(),
    }),
    resolve({ input }) {
      const newMessage: ChatMessage = {
        id: uuidv4(),
        ...input,
      };
      messages.push(newMessage);
      return input;
    },
  });

export type AppRouter = typeof appRouter;
