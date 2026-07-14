import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    username: string;
    avatarUrl: string | null;
    isAdmin: boolean;
    groupId: string | null;
    groupName: string | null;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      username: string;
      avatarUrl: string | null;
      isAdmin: boolean;
      groupId: string | null;
      groupName: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    avatarUrl: string | null;
    isAdmin: boolean;
    groupId: string | null;
    groupName: string | null;
  }
}
