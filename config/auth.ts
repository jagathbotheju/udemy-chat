import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import authConfig from "./auth.config";
import prisma from "@/lib/prisma";
import { getUserById } from "@/app/actions/authActions";

export const { auth, handlers, signIn, signOut } = NextAuth({
  callbacks: {
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        // const res = await getUserById(token.sub);
        // if (res.success) {
        //   const userDB = res.data;
        //   session.user = userDB;
        // } else {
        //   session.user.id = token.sub;
        // }
        // const userDB = await prisma.user.findUnique({
        //   where: {
        //     id: token.sub,
        //   },
        // });
        // if (userDB) {
        //   session.user = userDB;
        // } else {
        //   session.user.id = token.sub;
        // }
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      // console.log("jwt", token);
      if (user) {
        token.user = user;
      }
      if (trigger === "update" && session) {
        token = { ...token, user: session };
        return token;
      }
      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
});
