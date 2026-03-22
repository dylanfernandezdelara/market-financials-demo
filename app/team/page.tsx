export default function TeamPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Team</h1>
      <p className="mt-2 text-sm text-neutral-600">Invite collaborators to shared workspaces.</p>
      <button
        type="button"
        className="mt-6 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
      >
        Invite member
      </button>
    </div>
  );
}
