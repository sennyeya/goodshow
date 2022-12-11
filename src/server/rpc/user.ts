import { db } from "../db/client";

export async function getUser(id: string) {
  return await db.user.findUniqueOrThrow({ where: { id } });
}

export async function updateUser(id: string, data: object) {
  return await db.user.update({ where: { id }, data });
}
