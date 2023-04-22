import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  getPosts: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.post.findMany({
      take: 20,
      orderBy:{
        createdAt:"desc"
      },
      include: {
        author: {
          select: {
            image: true,
            name: true,
          },
        },
      },
    });
  }),
  getPostbyId: publicProcedure
    .input(
      z.object({
        id: z.string().cuid()
      })
    )
    .query(async ({ ctx,input }) => {
      return await ctx.prisma.post.findUnique({
        where:{
          id:input.id
        },
        include: {
          author: {
            select: {
              image: true,
              name: true,
            },
          },
        },
      });
    }),
  postTweet: protectedProcedure
    .input(
      z.object({
        content: z.string().emoji({ message:"Only emojis are allowed" }).min(1).max(280),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.post.create({
        data: {
          content: input.content,
          authorId: ctx.session.user.id,
        },
      });
    }),
});
