import Link from "next/link";

export default function SavedLayoutsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Saved layouts</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Reuse dashboard arrangements across devices.
      </p>
      <div className="mt-6 rounded-lg border border-neutral-200 bg-white p-4 text-sm text-neutral-600">
        Default layout
      </div>
      <Link href="/settings/layouts" className="mt-6 inline-block text-sm text-neutral-400 underline">
        Manage in settings
      </Link>
    </div>
  );
}
