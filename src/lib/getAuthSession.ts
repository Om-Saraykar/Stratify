// lib/getAuthSession.ts
import { authOptions } from "@/lib/authOptions"
import { getServerSession } from "next-auth"

export async function getAuthSession() {
  return await getServerSession(authOptions)
}
