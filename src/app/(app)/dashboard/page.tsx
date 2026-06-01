import { getCurrentUser } from "@/lib/current-user";

export default async function DashboardPage() {
  const { user, workspace } = await getCurrentUser();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        Welcome, {user.name || user.email}. Workspace: {workspace.name}
      </p>
    </div>
  );
}
