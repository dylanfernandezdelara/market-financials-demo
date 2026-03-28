"use client";

import Link from "next/link";
import { useState } from "react";

/* ------------------------------------------------------------------ */
/*  Help articles backing the search (FDL-741)                        */
/* ------------------------------------------------------------------ */
const helpArticles = [
  {
    id: "getting-started",
    title: "Getting started with your portfolio",
    category: "Portfolio",
    body: "Learn how to add holdings, import CSV data, and view sector exposure from the portfolio page.",
  },
  {
    id: "market-pulse",
    title: "Understanding market pulse signals",
    category: "Market Data",
    body: "Market pulse shows breadth (advancers vs decliners), sentiment scores, and qualitative risk signals on the dashboard.",
  },
  {
    id: "account-security",
    title: "Account security and session management",
    category: "Security",
    body: "Review active sessions, revoke unused devices, and enable two-factor authentication from Settings > Security.",
  },
  {
    id: "team-invitations",
    title: "Managing team invitations",
    category: "Team",
    body: "Invite collaborators via the Team page. POST /api/team/invite expects a JSON body with an email field and returns {sent, inviteId}.",
  },
  {
    id: "data-export",
    title: "Exporting your data",
    category: "Data",
    body: "Export portfolio holdings, watchlists, and reports in CSV or PDF format from the Export page.",
  },
  {
    id: "user-preferences",
    title: "Setting user preferences",
    category: "Settings",
    body: "Customize theme, density, and default tab. GET /api/user/preferences returns {theme, density, defaultTab}. PUT accepts the same shape and returns {ok: true}.",
  },
  {
    id: "api-user-preferences",
    title: "API contract: /api/user/preferences",
    category: "API",
    body: "GET returns JSON {theme: string, density: string, defaultTab: string}. PUT accepts a JSON body with the same fields and returns {ok: boolean}. Invalid payloads are silently ignored.",
  },
  {
    id: "api-team-invite",
    title: "API contract: /api/team/invite",
    category: "API",
    body: "POST expects {email: string}. On success returns {sent: true, inviteId: string}. Missing or non-object bodies return {error: \"invalid\"} with status 400.",
  },
  {
    id: "watchlist",
    title: "Using the watchlist",
    category: "Market Data",
    body: "Add symbols to your watchlist strip from the dashboard or stock detail pages to track daily movers at a glance.",
  },
  {
    id: "notes",
    title: "Writing research notes",
    category: "Research",
    body: "Use the Notes page to jot down thesis bullets, tag symbols, and revisit ideas later.",
  },
];

/* ------------------------------------------------------------------ */
/*  Section navigation links (FDL-751)                                */
/* ------------------------------------------------------------------ */
const navLinks = [
  { href: "/settings", label: "Settings" },
  { href: "/team", label: "Team" },
  { href: "/support", label: "Support" },
  { href: "/notes", label: "Notes" },
] as const;

/* ------------------------------------------------------------------ */
/*  Support page component                                            */
/* ------------------------------------------------------------------ */
export default function SupportPage() {
  const [query, setQuery] = useState("");

  const trimmed = query.trim().toLowerCase();
  const results =
    trimmed.length > 0
      ? helpArticles.filter(
          (a) =>
            a.title.toLowerCase().includes(trimmed) ||
            a.category.toLowerCase().includes(trimmed) ||
            a.body.toLowerCase().includes(trimmed),
        )
      : [];

  const showResults = trimmed.length > 0;

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      {/* Navigation bar across settings/team/support/notes (FDL-751) */}
      <nav aria-label="Section navigation" className="mb-8 flex gap-4 text-sm">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={link.href === "/support" ? "page" : undefined}
            className={
              link.href === "/support"
                ? "font-semibold text-neutral-900 underline underline-offset-4"
                : "text-neutral-500 hover:text-neutral-900"
            }
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <h1 className="text-2xl font-semibold text-neutral-900">Help center</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Search guides, API docs, and account help.
      </p>

      {/* Search input with accessibility labels (FDL-752) */}
      <div role="search" className="mt-6">
        <label htmlFor="support-search" className="sr-only">
          Search help articles
        </label>
        <input
          id="support-search"
          type="search"
          placeholder="Search help articles..."
          aria-label="Search help articles"
          aria-describedby="search-hint"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400"
        />
        <p id="search-hint" className="mt-1 text-xs text-neutral-400">
          Type at least one character to see matching articles.
        </p>
      </div>

      {/* Search results (FDL-742) with no-results recovery (FDL-743) */}
      <div aria-live="polite" className="mt-6">
        {showResults && results.length > 0 && (
          <ul role="list" className="divide-y divide-neutral-100">
            {results.map((article) => (
              <li key={article.id} className="py-3">
                <p className="text-sm font-medium text-neutral-900">
                  {article.title}
                </p>
                <span className="text-xs text-neutral-400">
                  {article.category}
                </span>
                <p className="mt-1 text-sm text-neutral-600">{article.body}</p>
              </li>
            ))}
          </ul>
        )}

        {showResults && results.length === 0 && (
          <div
            role="status"
            className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-center"
          >
            <p className="text-sm font-medium text-neutral-700">
              No results found for &ldquo;{query.trim()}&rdquo;
            </p>
            <p className="mt-1 text-sm text-neutral-500">
              Try a different search term, or browse the topics below.
            </p>
            <div className="mt-3 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setQuery("")}
                className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
              >
                Clear search
              </button>
              <Link
                href="/settings"
                className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
              >
                Account settings
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Default topic grid when not searching (FDL-741 + FDL-750) */}
      {!showResults && (
        <section aria-label="Help topics" className="mt-8">
          <h2 className="text-sm font-semibold text-neutral-700">
            Popular topics
          </h2>
          <ul role="list" className="mt-3 grid gap-3 sm:grid-cols-2">
            {helpArticles.slice(0, 6).map((article) => (
              <li key={article.id}>
                <button
                  type="button"
                  onClick={() => setQuery(article.title)}
                  className="w-full rounded-lg border border-neutral-200 bg-white p-3 text-left hover:border-neutral-300"
                >
                  <p className="text-sm font-medium text-neutral-900">
                    {article.title}
                  </p>
                  <span className="text-xs text-neutral-400">
                    {article.category}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* API schema reference section (FDL-753) */}
      {!showResults && (
        <section aria-label="API reference" className="mt-10">
          <h2 className="text-sm font-semibold text-neutral-700">
            API contracts
          </h2>
          <div className="mt-3 space-y-3">
            <div className="rounded-lg border border-neutral-200 bg-white p-3">
              <p className="text-sm font-medium text-neutral-900">
                /api/user/preferences
              </p>
              <p className="mt-1 text-xs text-neutral-600">
                <strong>GET</strong> &rarr;{" "}
                <code className="rounded bg-neutral-100 px-1">
                  {"{ theme: string, density: string, defaultTab: string }"}
                </code>
              </p>
              <p className="mt-1 text-xs text-neutral-600">
                <strong>PUT</strong> accepts the same shape &rarr;{" "}
                <code className="rounded bg-neutral-100 px-1">
                  {"{ ok: boolean }"}
                </code>
              </p>
            </div>
            <div className="rounded-lg border border-neutral-200 bg-white p-3">
              <p className="text-sm font-medium text-neutral-900">
                /api/team/invite
              </p>
              <p className="mt-1 text-xs text-neutral-600">
                <strong>POST</strong> expects{" "}
                <code className="rounded bg-neutral-100 px-1">
                  {"{ email: string }"}
                </code>{" "}
                &rarr;{" "}
                <code className="rounded bg-neutral-100 px-1">
                  {"{ sent: boolean, inviteId: string }"}
                </code>
              </p>
              <p className="mt-1 text-xs text-neutral-600">
                Returns{" "}
                <code className="rounded bg-neutral-100 px-1">
                  {"{ error: \"invalid\" }"}
                </code>{" "}
                with status 400 for missing or non-object bodies.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Account security surface (FDL-750) */}
      {!showResults && (
        <section aria-label="Account security" className="mt-10">
          <h2 className="text-sm font-semibold text-neutral-700">
            Security &amp; sessions
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            Manage active sessions and security settings from your account page.
          </p>
          <div className="mt-3">
            <Link
              href="/settings"
              className="inline-block rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
            >
              Go to account settings
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
