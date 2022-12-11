import { stripe } from ".";

export async function getSession(id: string) {
  return await stripe.checkout.sessions.retrieve(id);
}
