
import { LogOut, Settings, User } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSecureContextStore } from '@/stores/secureContextStore';
import { Button } from '@/components/ui/button';

export const SidebarFooter = () => {
  const { user } = useSecureContextStore();
  const { signOut } = useAuthStore();
  
  if (!user) return null;
  
  const userInitials = user.name
    ? user.name.split(' ').map(part => part[0]).join('')
    : user.email.substring(0, 2).toUpperCase();

  return (
    <div className="p-4 border-t">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar_url || ''} alt={user.name || user.email} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <p className="text-sm font-medium">{user.name || user.email}</p>
            <p className="text-xs text-muted-foreground truncate max-w-[140px]">{user.email}</p>
          </div>
        </div>
        <div className="flex">
          <Button variant="ghost" size="icon" asChild className="h-8 w-8">
            <a href="/settings">
              <Settings className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </a>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => signOut()}>
            <LogOut className="h-4 w-4" />
            <span className="sr-only">Log out</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
