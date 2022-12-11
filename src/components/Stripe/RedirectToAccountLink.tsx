"use client";

import { trpc } from "../../../src/utils/trpc";

export function RedirectToAccountUrl() {
  const { data, isLoading } = trpc.stripe.getAccountLink.useQuery(undefined, {
    onSettled(data, error) {
      if (data) {
        document.location.href = data.url;
      }
    },
  });
  if (isLoading) {
    return <p>Loading...</p>;
  }
  return <>Error.</>;
}
