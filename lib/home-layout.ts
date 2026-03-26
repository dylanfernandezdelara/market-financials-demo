export type HomeSectionId =
  | "top-futures"
  | "market-summary"
  | "recent-developments"
  | "popular-spaces"
  | "standouts"
  | "watchlist"
  | "movers"
  | "equity-sectors"
  | "crypto"
  | "fixed-income"
  | "quick-links";

export type HomeSectionEntry = {
  id: HomeSectionId;
  label: string;
  visible: boolean;
};

export type HomeLayout = {
  name: string;
  sections: HomeSectionEntry[];
};

export const SECTION_LABELS: Record<HomeSectionId, string> = {
  "top-futures": "Top Assets",
  "market-summary": "Market Summary",
  "recent-developments": "Recent Developments",
  "popular-spaces": "Popular Spaces",
  standouts: "Standouts",
  watchlist: "Watchlist",
  movers: "Movers",
  "equity-sectors": "Equity Sectors",
  crypto: "Cryptocurrencies",
  "fixed-income": "Fixed Income",
  "quick-links": "Quick Links",
};

export const DEFAULT_SECTIONS: HomeSectionEntry[] = [
  { id: "top-futures", label: "Top Assets", visible: true },
  { id: "market-summary", label: "Market Summary", visible: true },
  { id: "recent-developments", label: "Recent Developments", visible: true },
  { id: "popular-spaces", label: "Popular Spaces", visible: true },
  { id: "standouts", label: "Standouts", visible: true },
  { id: "watchlist", label: "Watchlist", visible: true },
  { id: "movers", label: "Movers", visible: true },
  { id: "equity-sectors", label: "Equity Sectors", visible: true },
  { id: "crypto", label: "Cryptocurrencies", visible: true },
  { id: "fixed-income", label: "Fixed Income", visible: true },
  { id: "quick-links", label: "Quick Links", visible: true },
];

const STORAGE_KEY = "home-layout";
const SAVED_LAYOUTS_KEY = "saved-home-layouts";

let cachedLayoutRaw: string | null = null;
let cachedLayout: HomeSectionEntry[] = DEFAULT_SECTIONS;

let cachedSavedRaw: string | null = null;
let cachedSaved: HomeLayout[] = [];

export function loadLayout(): HomeSectionEntry[] {
  if (typeof window === "undefined") return DEFAULT_SECTIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === cachedLayoutRaw) return cachedLayout;
    cachedLayoutRaw = raw;
    if (!raw) {
      cachedLayout = DEFAULT_SECTIONS;
      return cachedLayout;
    }
    const parsed: HomeSectionEntry[] = JSON.parse(raw);
    const knownIds = new Set(parsed.map((s) => s.id));
    cachedLayout = [
      ...parsed.filter((s) => s.id in SECTION_LABELS),
      ...DEFAULT_SECTIONS.filter((s) => !knownIds.has(s.id)),
    ];
    return cachedLayout;
  } catch {
    cachedLayout = DEFAULT_SECTIONS;
    return cachedLayout;
  }
}

export function saveLayout(sections: HomeSectionEntry[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sections));
}

export function loadSavedLayouts(): HomeLayout[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SAVED_LAYOUTS_KEY);
    if (raw === cachedSavedRaw) return cachedSaved;
    cachedSavedRaw = raw;
    if (!raw) {
      cachedSaved = [];
      return cachedSaved;
    }
    cachedSaved = JSON.parse(raw);
    return cachedSaved;
  } catch {
    cachedSaved = [];
    return cachedSaved;
  }
}

export function persistSavedLayouts(layouts: HomeLayout[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SAVED_LAYOUTS_KEY, JSON.stringify(layouts));
}
