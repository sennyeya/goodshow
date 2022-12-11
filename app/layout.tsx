"use client";

import { SessionProvider } from "next-auth/react";
import "../src/styles/globals.css";
import { ClientProvider } from "../src/components/Providers/trpcClient";
import Header from "../src/components/Header/Header";

export default function DefaultLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientProvider>
          <SessionProvider>
            <div className="container mx-auto flex h-screen flex-col">
              <Header />
              <main className="mt-8 mb-8 flex-grow">{children}</main>
              <footer className="flex flex-row justify-evenly border-t py-4 px-24">
                <a className="underline" href="/tos">
                  Terms of Service
                </a>
                <a className="underline" href="/stripe">
                  Payments by Stripe
                </a>
                <a className="underline" href="/mission">
                  Who are we.
                </a>
              </footer>
            </div>
          </SessionProvider>
        </ClientProvider>
      </body>
    </html>
  );
}
