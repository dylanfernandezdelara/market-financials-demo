import Link from "next/link";

export default function ResearchHubPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Research hub</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Filings, transcripts, and third-party notes in one stream.
      </p>
      <div className="mt-8 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center text-sm text-neutral-500">
        No research items yet. Browse symbols to start building your stream.
      </div>
      <Link href="/" className="mt-6 inline-block text-sm text-neutral-900 underline">
        Return home
      </Link>
    </div>
  );
}
