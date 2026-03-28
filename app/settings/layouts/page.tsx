import Link from "next/link";

export default function LayoutSettingsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Layout settings</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Manage saved dashboard layouts and default arrangement preferences.
      </p>
      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-4 text-sm">
          <span className="text-neutral-900">Default layout</span>
          <span className="text-neutral-400">Active</span>
        </div>
      </div>
      <div className="mt-6 flex gap-4 text-sm">
        <Link href="/saved" className="text-neutral-900 underline">
          View saved layouts
        </Link>
        <Link href="/settings" className="text-neutral-400 underline">
          Back to settings
        </Link>
      </div>
    </div>
  );
}
