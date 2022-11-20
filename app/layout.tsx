import "../src/styles/globals.css";

export default function DefaultLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center justify-between border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">
            <span>test</span>
          </div>
        </div>
        <div className="container mx-auto my-2 p-4">{children}</div>
      </body>
    </html>
  );
}
