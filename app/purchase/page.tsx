"use client";

import { useRouter } from "next/router";
import { trpc } from "../../src/utils/trpc";

export default function SuccessPage() {
  const router = useRouter();
  const { data, isLoading } = trpc.stripe.getSession.useQuery({
    sessionId: router.query.session_id as string,
  });
  if (isLoading) {
    return <>Loading...</>;
  }
  return <a>{data?.amount_total}</a>;
}
