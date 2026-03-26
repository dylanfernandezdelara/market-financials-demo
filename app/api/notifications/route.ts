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
  const items = await getNotificationItems();
  const unreadCount = items.filter((item) => item.readAt === null).length;

  return NextResponse.json({ marked: unreadCount });
}
