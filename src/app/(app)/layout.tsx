import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar1 } from "@/components/sidebar1";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <Sidebar1>{children}</Sidebar1>
    </TooltipProvider>
  );
}
