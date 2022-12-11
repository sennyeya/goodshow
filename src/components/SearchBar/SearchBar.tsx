"use client";

import Header from "../DesignSystem/Header/Header";

export const SearchBar = () => {
  return (
    <>
      <Header size="lg">Search for Upcoming Events</Header>
      <p>You can find events from your favorite artists here.</p>
      <div className="h-100 mb-7 block w-full rounded-md border border-slate-500">
        <input className="h-100 w-full rounded-md p-1" />
      </div>
    </>
  );
};
