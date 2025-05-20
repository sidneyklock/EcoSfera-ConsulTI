
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { User } from "@/types";

interface SidebarFooterProps {
  user: User | null;
  collapsed: boolean;
  onSignOut: () => Promise<void>;
}

export const SidebarFooter = ({ user, collapsed, onSignOut }: SidebarFooterProps) => {
  // Obter iniciais do nome do usuário
  const getInitials = (name: string = "Usuário") => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="px-2 pb-4">
      {user && (
        <>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-md">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar_url} />
              <AvatarFallback>
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user.name || 'Usuário'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            className={cn("w-full mt-2 justify-start", collapsed && "justify-center")}
            onClick={onSignOut}
          >
            <LogOut className="h-5 w-5 mr-2" />
            {!collapsed && "Sair"}
          </Button>
        </>
      )}
    </div>
  );
};
