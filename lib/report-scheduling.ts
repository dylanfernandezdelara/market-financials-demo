import type { NotificationItem, ReportSchedule } from "@/types/finance";

const mockSchedules: ReportSchedule[] = [
  {
    id: "sched_01",
    name: "Weekly portfolio summary",
    frequency: "weekly",
    format: "pdf",
    recipients: ["user@example.com"],
    enabled: true,
    nextRunAt: "2026-03-30T09:00:00Z",
    lastRunAt: "2026-03-23T09:00:00Z",
    createdAt: "2026-01-15T12:00:00Z",
  },
  {
    id: "sched_02",
    name: "Monthly tax lot report",
    frequency: "monthly",
    format: "csv",
    recipients: ["user@example.com", "advisor@example.com"],
    enabled: true,
    nextRunAt: "2026-04-01T06:00:00Z",
    lastRunAt: "2026-03-01T06:00:00Z",
    createdAt: "2026-02-10T08:30:00Z",
  },
  {
    id: "sched_03",
    name: "Daily P&L snapshot",
    frequency: "daily",
    format: "html",
    recipients: ["user@example.com"],
    enabled: false,
    nextRunAt: "2026-03-27T16:30:00Z",
    lastRunAt: null,
    createdAt: "2026-03-20T14:00:00Z",
  },
];

const mockNotifications: NotificationItem[] = [
  {
    id: "notif_01",
    channel: "in_app",
    title: "Weekly portfolio summary delivered",
    body: "Your weekly portfolio summary for Mar 23 is ready.",
    reportScheduleId: "sched_01",
    readAt: null,
    createdAt: "2026-03-23T09:01:00Z",
  },
  {
    id: "notif_02",
    channel: "email",
    title: "Monthly tax lot report sent",
    body: "The March tax lot report was emailed to 2 recipients.",
    reportScheduleId: "sched_02",
    readAt: "2026-03-01T10:00:00Z",
    createdAt: "2026-03-01T06:01:00Z",
  },
  {
    id: "notif_03",
    channel: "in_app",
    title: "Schedule paused",
    body: "Daily P&L snapshot was disabled by the owner.",
    reportScheduleId: "sched_03",
    readAt: null,
    createdAt: "2026-03-20T14:01:00Z",
  },
];

export async function getReportSchedules(): Promise<ReportSchedule[]> {
  return mockSchedules;
}

export async function getReportSchedule(
  id: string,
): Promise<ReportSchedule | undefined> {
  return mockSchedules.find((schedule) => schedule.id === id);
}

export async function getNotificationItems(): Promise<NotificationItem[]> {
  return mockNotifications;
}

export async function getUnreadNotificationCount(): Promise<number> {
  return mockNotifications.filter((item) => item.readAt === null).length;
}
