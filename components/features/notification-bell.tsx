"use client";

import { Bell } from "lucide-react";

export function NotificationBell() {
  return (
    <button type="button" className="relative rounded-lg p-2 hover:bg-neutral-100" aria-label="Notifications">
      <Bell className="size-5 text-neutral-600" aria-hidden />
      <span className="absolute right-1 top-1 size-2 rounded-full bg-red-500" />
    </button>
  );
}
