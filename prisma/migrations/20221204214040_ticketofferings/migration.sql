/*
  Warnings:

  - Added the required column `eventId` to the `TicketOffering` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TicketOffering" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "quantity_max" INTEGER NOT NULL,
    "quantity_remaining" INTEGER NOT NULL,
    "eventId" TEXT NOT NULL,
    CONSTRAINT "TicketOffering_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_TicketOffering" ("id", "quantity_max", "quantity_remaining", "type") SELECT "id", "quantity_max", "quantity_remaining", "type" FROM "TicketOffering";
DROP TABLE "TicketOffering";
ALTER TABLE "new_TicketOffering" RENAME TO "TicketOffering";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
