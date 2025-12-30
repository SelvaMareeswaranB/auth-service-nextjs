import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/drizzle/db";
import { nextCookies } from "better-auth/next-js";
import { sendPasswordResetEmail } from "../email/password-reset-email";
import { sendMailVerificationEmail } from "../email/mail-verification-email";
import { createAuthMiddleware } from "better-auth/api";
import { sendWelcomeEmail } from "../email/welcome-email";
import { sendDeleteAccountVerificationEmail } from "../email/delete-account-verificationt";
import { twoFactor, admin as adminPlugin } from "better-auth/plugins";
import { passkey } from "@better-auth/passkey";
import { admin, user, ac } from "./permisson";

export const auth = betterAuth({
  trustedOrigins: [
    "http://localhost:3000",
    "https://auth-service-nextjs.vercel.app"
  ],
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ user, url, newEmail }) => {
        await sendMailVerificationEmail({
          user: { ...user, email: newEmail },
          url,
        });
      },
    },
    additionalFields: {
      nickName: {
        type: "string",
        required: true,
      },
    },
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user, url }) => {
        await sendDeleteAccountVerificationEmail({ user, url });
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail({ user, url });
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendMailVerificationEmail({ user, url });
    },
  },

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      mapProfileToUser: (profile) => {
        return {
          nickName: profile.name,
        };
      },
    },
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      mapProfileToUser: (profile) => {
        return {
          nickName: profile.username,
        };
      },
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60,
    },
  },
  plugins: [
    nextCookies(),
    twoFactor(),
    passkey(),
    adminPlugin({
      defaultRole: "user",
      ac,
      roles: {
        admin,
        user,
      },
    }),
  ],
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (!ctx.path?.startsWith("/sign-up")) return;

      const user = ctx.context?.newSession?.user;
      if (!user || !user.email) return;

      await sendWelcomeEmail({
        name: user.name ?? "",
        email: user.email,
      });
    }),
  },
});
