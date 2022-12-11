-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ticket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "ticketOfferingId" TEXT NOT NULL,
    "stripeSessionId" TEXT,
    "status" TEXT NOT NULL,
    CONSTRAINT "Ticket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Ticket_ticketOfferingId_fkey" FOREIGN KEY ("ticketOfferingId") REFERENCES "TicketOffering" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Ticket" ("id", "status", "stripeSessionId", "ticketOfferingId", "userId") SELECT "id", "status", "stripeSessionId", "ticketOfferingId", "userId" FROM "Ticket";
DROP TABLE "Ticket";
ALTER TABLE "new_Ticket" RENAME TO "Ticket";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
