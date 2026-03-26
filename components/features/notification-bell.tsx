"use client";

import { Bell } from "lucide-react";

export function NotificationBell() {
  return (
    <button
      type="button"
      aria-label="Notifications"
      className="relative rounded-lg p-2 hover:bg-neutral-100"
    >
      <Bell className="size-5 text-neutral-600" aria-hidden="true" />
      <span className="absolute right-1 top-1 size-2 rounded-full bg-red-500" />
      <span className="sr-only">Unread notifications</span>
    </button>
  );
}
