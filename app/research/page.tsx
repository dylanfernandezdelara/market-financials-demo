export default function ResearchHubPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Research hub</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Filings, transcripts, and third-party notes in one stream.
      </p>

      <section id="sec-filings" className="mt-10 scroll-mt-28">
        <h2 className="text-lg font-semibold text-neutral-900">SEC Filings</h2>
        <p className="mt-1 text-sm text-neutral-600">
          Analyze fundraising rounds and regulatory documents using SEC filings.
        </p>
        <div className="mt-4 h-48 animate-pulse rounded-xl bg-neutral-100" />
      </section>

      <section id="shareholder-letters" className="mt-10 scroll-mt-28">
        <h2 className="text-lg font-semibold text-neutral-900">Shareholder Letters</h2>
        <p className="mt-1 text-sm text-neutral-600">
          Browse and query shareholder letters from top investors and conglomerates.
        </p>
        <div className="mt-4 h-48 animate-pulse rounded-xl bg-neutral-100" />
      </section>

      <section id="transcripts" className="mt-10 scroll-mt-28">
        <h2 className="text-lg font-semibold text-neutral-900">Earnings Transcripts</h2>
        <p className="mt-1 text-sm text-neutral-600">
          Query any S&amp;P 500 company transcript over the last two years.
        </p>
        <div className="mt-4 h-48 animate-pulse rounded-xl bg-neutral-100" />
      </section>
    </div>
  );
}
