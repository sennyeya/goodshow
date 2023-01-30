"use client";

import { signIn, useSession } from "next-auth/react";
import Nav from "./Nav/Nav";
import UserProfile from "./UserProfile/UserProfile";

export default function Header() {
  const { status } = useSession();
  return (
    <div className="flex w-full items-center justify-between border-b-2 border-gray-100 py-6 md:space-x-10">
      <a className="text-lg uppercase">Goodshow</a>

      {status === "authenticated" ? (
        <UserProfile />
      ) : (
        <button onClick={() => signIn()}>Login</button>
      )}
    </div>
  );
}
