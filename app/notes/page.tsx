import { cacheLife } from "next/cache";

export default async function NotesPage() {
  "use cache";
  cacheLife("max");
  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Notes</h1>
      <textarea
        className="mt-4 min-h-[200px] w-full rounded-lg border border-neutral-200 p-3 text-sm"
        placeholder="Jot thesis bullets…"
        readOnly
      />
    </div>
  );
}
