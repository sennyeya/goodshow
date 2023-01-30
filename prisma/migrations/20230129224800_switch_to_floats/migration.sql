/*
  Warnings:

  - You are about to alter the column `price` on the `TicketOffering` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Float`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TicketOffering" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "quantity_max" INTEGER NOT NULL,
    "quantity_remaining" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "eventId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TicketOffering_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_TicketOffering" ("createdAt", "eventId", "id", "price", "quantity_max", "quantity_remaining", "type", "updatedAt") SELECT "createdAt", "eventId", "id", "price", "quantity_max", "quantity_remaining", "type", "updatedAt" FROM "TicketOffering";
DROP TABLE "TicketOffering";
ALTER TABLE "new_TicketOffering" RENAME TO "TicketOffering";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
