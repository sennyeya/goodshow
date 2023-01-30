"use client";

import { signIn, useSession } from "next-auth/react";

export default function UserProfile() {
  const { data: sessionData, status } = useSession();
  if (status === "loading") return <></>;
  if (sessionData) {
    return (
      <div className="text-right">
        <a>{sessionData.user?.name}</a>
      </div>
    );
  }

  return <button onClick={() => signIn()}>Login</button>;
}
