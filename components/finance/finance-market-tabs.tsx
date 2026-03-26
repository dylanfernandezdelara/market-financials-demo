"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const tabs = [
  { href: "/", label: "US Markets", flag: true },
  { href: "/#crypto", label: "Crypto" },
  { href: "/#earnings", label: "Earnings" },
  { href: "/#predictions", label: "Predictions" },
  { href: "/#screener", label: "Screener" },
  { href: "/#politicians", label: "Politicians" },
  { href: "/#watchlist", label: "Watchlist" },
] as const;

/** Extract the hash portion from a tab href (e.g. "/#crypto" → "crypto"). */
function hashFromHref(href: string): string {
  const idx = href.indexOf("#");
  return idx === -1 ? "" : href.slice(idx + 1);
}

/** All section ids referenced by the tabs (excluding the root "/" tab). */
const sectionIds = tabs
  .map((t) => hashFromHref(t.href))
  .filter(Boolean);

export function FinanceMarketTabs() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Current active hash — empty string means the root "US Markets" tab.
  const [activeHash, setActiveHash] = useState("");

  // Whether the latest activation came from an IntersectionObserver callback
  // (scroll) rather than an explicit hash click. We use this so that a click
  // on a tab immediately wins over scroll-based detection.
  const scrollLock = useRef(false);
  const scrollLockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Sync with URL hash (initial load + hashchange) ──────────────────
  useEffect(() => {
    if (!isHome) return;

    const sync = () => {
      const h = window.location.hash.replace(/^#/, "");
      setActiveHash(h);
      // When the user clicks a tab the hash changes; briefly lock out scroll
      // detection so the clicked tab stays highlighted while the browser
      // smooth-scrolls to the section.
      scrollLock.current = true;
      if (scrollLockTimer.current !== null) clearTimeout(scrollLockTimer.current);
      scrollLockTimer.current = window.setTimeout(() => {
        scrollLock.current = false;
        scrollLockTimer.current = null;
      }, 400);
    };

    // Set the initial hash on mount.
    sync();
    // Immediately unlock — the lock is only needed after user clicks.
    scrollLock.current = false;

    const onHashChange = () => {
      sync();
    };

    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      if (scrollLockTimer.current !== null) clearTimeout(scrollLockTimer.current);
    };
  }, [isHome]);

  // ── IntersectionObserver – update active tab on scroll ──────────────
  const visibleSections = useRef(new Set<string>());
  // Section ids sorted by their position in the DOM (computed once on mount).
  const domOrderIds = useRef<string[]>([]);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      // Always keep the visible-sections set in sync, even while the scroll
      // lock is active, so the set is accurate when the lock expires.
      for (const entry of entries) {
        if (entry.isIntersecting) {
          visibleSections.current.add(entry.target.id);
        } else {
          visibleSections.current.delete(entry.target.id);
        }
      }

      if (scrollLock.current) return;

      if (visibleSections.current.size === 0) {
        // No tracked section is in view — fall back to "US Markets".
        setActiveHash("");
      } else {
        // Activate the first visible section in document order.
        for (const id of domOrderIds.current) {
          if (visibleSections.current.has(id)) {
            setActiveHash(id);
            break;
          }
        }
      }
    },
    [],
  );

  useEffect(() => {
    if (!isHome) return;

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    // Sort by DOM position so the topmost visible section wins.
    elements.sort((a, b) =>
      a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
    );
    domOrderIds.current = elements.map((el) => el.id);

    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: "-30% 0px -60% 0px",
      threshold: 0,
    });

    for (const el of elements) observer.observe(el);

    const sections = visibleSections.current;
    return () => {
      observer.disconnect();
      sections.clear();
    };
  }, [isHome, handleIntersect]);

  // ── Determine which tab is active ───────────────────────────────────
  function isActive(href: string): boolean {
    if (!isHome) return false;
    const tabHash = hashFromHref(href);
    // Both empty → root tab
    return tabHash === activeHash;
  }

  return (
    <div className="border-b border-[#ebebeb] bg-white px-6">
      <nav
        className="mx-auto flex max-w-[960px] flex-wrap gap-1 pb-0 pt-1"
        aria-label="Markets"
      >
        {tabs.map((tab) => {
          const active = isActive(tab.href);
          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={`relative inline-flex items-center gap-1.5 px-3 pb-2.5 pt-2 text-[13px] font-medium transition-colors ${
                active
                  ? "text-[#1a1a1a]"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              {"flag" in tab && tab.flag ? (
                <span className="text-[13px]" aria-hidden>
                  🇺🇸
                </span>
              ) : null}
              {tab.label}
              {active ? (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-[#1a1a1a]" />
              ) : null}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
