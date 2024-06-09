import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import UserProfile from "@models/UserProfile";
import User from "@models/user";
import connectToDB from "@utils/database";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectToDB();

        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error("No user found with this email");
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValidPassword) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        const userProfile = await UserProfile.findOne({
          email: session.user.email,
        });
        if (userProfile) {
          session.user.image = userProfile.image;
        }
      }

      if (token.provider === "google") {
        await connectToDB();

        const user = await User.findOne({ email: session.user.email });
        if (user) {
          session.user.id = user._id;
          session.user.role = user.role;
        }
        const userProfile = await UserProfile.findOne({ email: session.user.email });
        if (userProfile) {
          session.user.image = userProfile.image;
        }
      }

      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      if (account && account.provider) {
        token.provider = account.provider;
      }

      return token;
    },
    async signIn({ account, profile }) {
      await connectToDB();

      if (account.provider === "google") {
        const userExists = await User.findOne({ email: profile.email });

        if (!userExists) {
          const newUser = await User.create({
            email: profile.email,
            name: profile.name,
            role: "attendee",
            password: "",
          });

          const newUserProfile = new UserProfile({
            user: newUser._id,
            name: profile.name,
            email: profile.email,
            phoneNumber: "",
            bio: "",
            image: profile.picture,
            profileVisibility: "Public",
          });

          await newUserProfile.save();
        } else {
          const userProfileExists = await UserProfile.findOne({
            email: profile.email,
          });

          if (!userProfileExists) {
            const newUserProfile = new UserProfile({
              user: userExists._id,
              name: profile.name,
              email: profile.email,
              phoneNumber: "",
              bio: "",
              image: profile.picture,
              profileVisibility: "Public",
            });

            await newUserProfile.save();
          }
        }
      }

      return true;
    },
    async redirect({ url, baseUrl }) {
      return `/`;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
});

export { handler as GET, handler as POST };
