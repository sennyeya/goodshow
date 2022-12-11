"use client";

import { useSession } from "next-auth/react";
import Nav from "./Nav/Nav";
import UserProfile from "./UserProfile/UserProfile";

export default function Header() {
  const { status } = useSession();
  if (status === "authenticated") {
    return (
      <div className="flex w-full items-center justify-between border-b-2 border-gray-100 py-6 md:space-x-10">
        <Nav />
        <UserProfile />
      </div>
    );
  } else if (status === "unauthenticated") {
    return (
      <div className="flex w-full items-center justify-between border-b-2 border-gray-100 py-6 md:space-x-10">
        <a className="text-lg uppercase">Goodshow</a>
      </div>
    );
  }
  return <></>;
}
