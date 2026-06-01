import { getCurrentUser } from "@/lib/current-user";
import { ProfileForm } from "./profile-form";

export default async function ProfilePage() {
  const { user } = await getCurrentUser();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
      <div className="mt-6">
        <ProfileForm
          firstName={user.firstName || ""}
          lastName={user.lastName || ""}
          email={user.email}
        />
      </div>
    </div>
  );
}
