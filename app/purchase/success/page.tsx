"use client";

import { toCurrency } from "../../../src/utils/currency";
import { trpc } from "../../../src/utils/trpc";

export default function SuccessPage() {
  const sessionId = new URL(window.location.href).searchParams.get(
    "session_id"
  );
  const { data, isLoading } = trpc.stripe.getSession.useQuery({
    sessionId: sessionId!,
  });

  if (isLoading) {
    return <>Loading...</>;
  }
  console.log(data.session);
  if (!data.session) {
    return (
      <div className="text-center">
        <h1 className="mb-4 text-xl">error</h1>
        <p>
          something went wrong. please contact support with this id,{" "}
          <i>{sessionId}</i>
        </p>
      </div>
    );
  }
  return (
    <div className="text-center">
      <h1 className="mb-4 text-xl">thank you!</h1>
      <p className="mb-2">
        your order of{" "}
        <b>
          {data?.session.amount_total &&
            toCurrency(data.session.amount_total / 100)}
        </b>{" "}
        for <b>{data?.event?.title}</b> was successfully submitted.
      </p>
      <p>
        please check <b>{data?.session.customer_details?.email}</b> for tickets.
      </p>
    </div>
  );
}
