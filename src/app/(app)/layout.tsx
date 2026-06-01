import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar16 } from "@/components/sidebar16";
import { getCurrentUser } from "@/lib/current-user";
import { currentUser } from "@clerk/nextjs/server";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getCurrentUser();
  const clerkUser = await currentUser();

  return (
    <TooltipProvider>
      <Sidebar16
        user={{
          name: user.name || "",
          email: user.email,
          avatarUrl: clerkUser?.imageUrl,
        }}
      >
        {children}
      </Sidebar16>
    </TooltipProvider>
  );
}
