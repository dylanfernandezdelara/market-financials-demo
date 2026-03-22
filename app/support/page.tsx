export default function SupportPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Help center</h1>
      <p className="mt-2 text-sm text-neutral-600">Search guides and contact support.</p>
      <input
        type="search"
        placeholder="Search help"
        className="mt-6 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
      />
    </div>
  );
}
