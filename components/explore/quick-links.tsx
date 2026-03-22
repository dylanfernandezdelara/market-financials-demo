import Link from "next/link";

const links = [
  { href: "/reports", label: "Tax reports" },
  { href: "/integrations", label: "Broker sync" },
  { href: "/team", label: "Workspace" },
  { href: "/billing", label: "Plan & billing" },
];

export function QuickLinksRow() {
  return (
    <div className="flex flex-wrap gap-2 border-t border-neutral-200 pt-4">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-[12px] font-medium text-neutral-700 hover:border-neutral-300"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
