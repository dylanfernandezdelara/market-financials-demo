import { getReportSchedules } from "@/lib/report-scheduling";
import { ReportScheduleForm } from "@/components/features/report-schedule-form";

export default async function ReportsPage() {
  const schedules = await getReportSchedules();

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Reports</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Scheduled reports and delivery history.
      </p>

      <div className="mt-6">
        <ReportScheduleForm />
      </div>

      <ul className="mt-8 space-y-3 text-sm">
        {schedules.map((schedule) => (
          <li
            key={schedule.id}
            className="flex items-center justify-between rounded-lg border border-neutral-200 px-4 py-3"
          >
            <div>
              <span className="font-medium text-neutral-900">{schedule.name}</span>
              <span className="ml-2 text-neutral-400">
                {schedule.frequency} · {schedule.format.toUpperCase()}
              </span>
            </div>
            <span
              className={
                schedule.enabled ? "text-emerald-600" : "text-neutral-400"
              }
            >
              {schedule.enabled ? "Active" : "Paused"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
