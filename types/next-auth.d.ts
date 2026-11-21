import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      username: string; // Add the username field to the session user
    };
  }
  interface User {
    id: string;
    email: string;
    name?: string;
    username: string;  // Add 'username' here to User
  }

  interface JWT {
    id: string;
    email: string;
    name?: string;
    username: string; // Add the username field to the JWT token
  }
}
