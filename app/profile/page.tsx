"use client";

import { useState } from "react";
import { RedirectToAccountUrl } from "../../src/components/Stripe/RedirectToAccountLink";
import { trpc } from "../../src/utils/trpc";

export default function ProfileHomepage() {
  const { data, isLoading } = trpc.user.getUser.useQuery();
  const registerStripeAccount = trpc.stripe.register.useMutation();
  const [redirectToAccountLink, setRedirectToAccountLink] = useState(false);

  const registerAccount = () => {
    registerStripeAccount.mutate(undefined, {
      onSettled(_, error) {
        if (error) {
          console.error(error);
        } else {
          setRedirectToAccountLink(true);
        }
      },
    });
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (redirectToAccountLink) {
    return <RedirectToAccountUrl />;
  }
  return (
    <div>
      {data?.stripeAccountId ? (
        <a onClick={() => setRedirectToAccountLink(true)}>Edit Account</a>
      ) : (
        <a onClick={() => registerAccount()}>Register with Stripe</a>
      )}
    </div>
  );
}
