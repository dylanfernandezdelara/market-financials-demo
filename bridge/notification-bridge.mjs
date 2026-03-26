const CHANNELS = ["in_app", "email", "webhook"];

function nowIso() {
  return new Date().toISOString();
}

function buildNotificationId() {
  return `notif_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createNotificationPayload({ schedule, channel, overrides = {} }) {
  return {
    id: buildNotificationId(),
    channel,
    title: `Report ready: ${schedule.name}`,
    body: `Your scheduled ${schedule.frequency} report "${schedule.name}" has been generated in ${schedule.format.toUpperCase()} format.`,
    reportScheduleId: schedule.id,
    readAt: null,
    createdAt: nowIso(),
    ...overrides,
  };
}

export function fanOutNotifications({ schedule, channels }) {
  const selectedChannels = channels ?? CHANNELS.slice(0, 1);

  return selectedChannels.map((channel) =>
    createNotificationPayload({ schedule, channel }),
  );
}

export function shouldDispatch(schedule) {
  if (!schedule || !schedule.enabled) {
    return false;
  }

  if (!schedule.nextRunAt) {
    return false;
  }

  return new Date(schedule.nextRunAt).getTime() <= Date.now();
}

export function resolveChannelsForRecipients(recipients) {
  if (!Array.isArray(recipients) || recipients.length === 0) {
    return ["in_app"];
  }

  const channels = ["in_app"];
  const hasEmail = recipients.some((r) => typeof r === "string" && r.includes("@"));

  if (hasEmail) {
    channels.push("email");
  }

  return channels;
}

export function buildDispatchPlan(schedules) {
  return schedules
    .filter((schedule) => shouldDispatch(schedule))
    .map((schedule) => ({
      scheduleId: schedule.id,
      scheduleName: schedule.name,
      channels: resolveChannelsForRecipients(schedule.recipients),
      notifications: fanOutNotifications({
        schedule,
        channels: resolveChannelsForRecipients(schedule.recipients),
      }),
    }));
}
