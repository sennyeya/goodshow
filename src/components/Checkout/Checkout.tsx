"use client";

import { useState } from "react";
import Counter from "../Counter/Counter";
import { trpc } from "../../utils/trpc";
import type { TicketOffering } from "@prisma/client";

type CheckoutProps = {
  perTicketCost: number;
  perTicketFee: number;
  ticketOffering: TicketOffering;
};

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function Checkout({
  perTicketCost,
  perTicketFee,
  ticketOffering,
}: CheckoutProps) {
  const [count, setCount] = useState(1);
  const {
    data: remainingTickets,
    isLoading,
    refetch,
  } = trpc.ticket.getRemainingTickets.useQuery({
    ticketOfferingId: ticketOffering.id,
  });
  const checkout = trpc.stripe.checkout.useMutation();
  const toCurrency = (value: number) => {
    return formatter.format(value);
  };
  const redirectToCheckoutUrl = () => {
    return checkout.mutate(
      {
        ticketOfferings: [{ id: ticketOffering.id, quantity: count }],
      },
      {
        onSuccess(data) {
          console.log(data);
          if (data && data.url) {
            document.location.href = data.url;
          } else {
            console.warn("Data response was not as expected.");
          }
        },
        onError(error) {
          if (error) {
            refetch();
          }
        },
      }
    );
  };
  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (!remainingTickets || remainingTickets <= 0) {
    return <i>Sold out.</i>;
  }
  return (
    <div>
      <div className="flex justify-between">
        <span>{count}x</span>
        <span>{toCurrency(count * perTicketCost)}</span>
      </div>
      <div className="mb-4 flex justify-between">
        <span>Fee</span>
        <span>{toCurrency(perTicketFee * count)}</span>
      </div>
      <div className="flex justify-between align-middle">
        <Counter
          onCountChanged={setCount}
          initialCount={count}
          maxCount={Math.min(remainingTickets, 6)}
        />
        <button
          className=" w-100 rounded border border-slate-500 py-3 px-5"
          onClick={redirectToCheckoutUrl}
        >
          Buy ({toCurrency((perTicketFee + perTicketCost) * count)})
        </button>
      </div>
      {remainingTickets < 10 && (
        <i>
          {remainingTickets} ticket{remainingTickets !== 1 && "s"} remaining.
        </i>
      )}
    </div>
  );
}
