import { ResponsiveTable } from "@/components/ui/responsive-table";

type Member = {
  email: string;
  name: string;
  role: string;
  joined: string;
};

const columns = [
  { key: "name" as const, label: "Name" },
  { key: "email" as const, label: "Email" },
  {
    key: "role" as const,
    label: "Role",
    render: (value: unknown) => (
      <span className="inline-flex rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
        {String(value)}
      </span>
    ),
  },
  { key: "joined" as const, label: "Joined" },
];

const members: Member[] = [
  { email: "demo@example.com", name: "Demo user", role: "Owner", joined: "Jan 2025" },
];

export default function TeamPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Team</h1>
      <p className="mt-2 text-sm text-neutral-600">Invite collaborators to shared workspaces.</p>
      <div className="mt-6">
        <ResponsiveTable<Member>
          columns={columns}
          rows={members}
          rowKey="email"
          emptyMessage="No team members yet."
        />
      </div>
      <button
        type="button"
        className="mt-6 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
      >
        Invite member
      </button>
    </div>
  );
}
