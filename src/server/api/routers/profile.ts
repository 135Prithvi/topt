import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import type { User } from "@prisma/client";
const userSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  emailVerified: z.date().nullable(),
  image: z.string().nullable(),
});
export const profileRouter = createTRPCRouter({
  getUserbyId: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.user.findFirst({
        where: {
          name: input.slug,
        },
      });
    }),
  getPostsForUser: publicProcedure
    .input(
      z.object({
        user: userSchema,
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.post.findMany({
        where: {
          author: input.user,
        },
        orderBy:{
          createdAt:"desc"
        },
        
      });
    }),
});
