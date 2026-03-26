import { NextResponse } from "next/server";
import {
  getNotificationItems,
  getUnreadNotificationCount,
} from "@/lib/report-scheduling";

export async function GET() {
  const items = await getNotificationItems();
  const unread = await getUnreadNotificationCount();

  return NextResponse.json({ unread, items });
}

export async function PATCH() {
  return NextResponse.json({ marked: 0 });
}
