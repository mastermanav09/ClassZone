import User from "../../../../models/User";
import NextAuth from "next-auth/next";
import db from "../../../../utils/db";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";

export const authOptions = {
  session: {
    strategy: "jwt",
  },

  secret: process.env.SECRET,
  site: process.env.NEXTAUTH_URL,

  callbacks: {
    async jwt({ token, user }) {
      if (user?._id) {
        token._id = user._id;
      }

      if (user?.isAdmin) {
        token.isAdmin = user.isAdmin;
      }

      return token;
    },

    async session({ session, token }) {
      if (token?._id) {
        session.user._id = token._id;
      }

      if (token?.isAdmin) {
        session.user.isAdmin = token.isAdmin;
      }

      if (token?.picture) {
        session.user.image = token?.picture;
      }

      return session;
    },

    async signIn({ account, profile, ...rest }) {
      if (account.provider === "google") {
        const { name, email, picture } = profile;

        try {
          await db.connect();

          const user = await User.findOne({
            "credentials.email": email,
          });

          if (user) {
            return profile.email_verified;
          }

          const newUser = new User({
            credentials: {
              name: name,
              email: email,
              userImage: picture,
              password: "xxxxxxxx",
            },

            provider: "google",
            enrolled: [],
            teaching: [],
          });

          await newUser.save();

          await db.disconnect();

          return profile.email_verified && profile.email.endsWith("@gmail.com");
        } catch (error) {
          console.log(error);
        }
      } else if (account.provider === "credentials") {
        return true;
      }

      return false;
    },
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),

    CredentialsProvider({
      type: "credentials",
      async authorize(credentials, req) {
        await db.connect();

        const user = await User.findOne({
          "credentials.email": credentials.email,
        }).lean();

        if (!user) {
          throw new Error("Account with this email doesn't exist.");
        }

        const validatedToken = bcrypt.compareSync(
          credentials.password,
          user.credentials.password
        );

        if (!validatedToken) {
          return null;
        }

        await db.disconnect();

        return {
          _id: user._id,
          name: user.credentials.name,
          email: user.credentials.email,
          image: user.credentials.userImage,
          isAdmin: user.credentials.isAdmin,
        };
      },
    }),
  ],
};

export default NextAuth(authOptions);
