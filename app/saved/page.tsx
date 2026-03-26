import { SavedLayoutsManager } from "@/components/dashboard/saved-layouts-manager";

export default function SavedLayoutsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Saved layouts</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Reuse dashboard arrangements across devices.
      </p>
      <SavedLayoutsManager />
    </div>
  );
}
