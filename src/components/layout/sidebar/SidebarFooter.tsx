
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { User } from "@/types";
import { 
  iconClasses, 
  layoutClasses, 
  textClasses,
  avatarSizeClasses,
  buttonStateClasses,
  transitions,
  a11yClasses
} from "@/lib/utils";

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
          <div className={cn(layoutClasses.flexCenterGap, "px-3 py-2.5 rounded-md", "hover:bg-accent/50", transitions.colors)}>
            <Avatar className={avatarSizeClasses}>
              <AvatarImage src={user.avatar_url} alt={user.name || 'Avatar do usuário'} />
              <AvatarFallback>
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className={cn(textClasses.base, "truncate")}>
                  {user.name || 'Usuário'}
                </p>
                <p className={cn(textClasses.secondary, "truncate")}>
                  {user.email}
                </p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            className={cn(
              "w-full mt-2 justify-start",
              collapsed && "justify-center",
              transitions.colors,
              buttonStateClasses.active,
              buttonStateClasses.hover,
              a11yClasses.focusVisible
            )}
            onClick={onSignOut}
            aria-label="Sair da aplicação"
          >
            <LogOut className={cn(iconClasses.base, "mr-2")} />
            {!collapsed && "Sair"}
          </Button>
        </>
      )}
    </div>
  );
};
