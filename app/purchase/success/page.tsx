"use client";

import { trpc } from "../../../src/utils/trpc";

export default function SuccessPage() {
  const { data, isLoading } = trpc.stripe.getSession.useQuery({
    sessionId: new URL(window.location.href).searchParams.get("session_id")!,
  });
  if (isLoading) {
    return <>Loading...</>;
  }
  console.log(data);
  return (
    <div>
      <p>{data?.amount_total}</p>
      <p>{data?.status}</p>
    </div>
  );
}
