
import { NavLink } from 'react-router-dom';
import { useNavigation } from '@/features/layout/hooks/useNavigation';
import { useSecureContextStore } from '@/stores/secureContextStore';

export const SidebarNavigation = () => {
  const { mainNavigation } = useNavigation();
  const { role } = useSecureContextStore();

  return (
    <nav className="space-y-1 px-2 py-4">
      {mainNavigation.map((section) => (
        <div key={section.title || 'main'} className="mb-4">
          {section.title && (
            <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              {section.title}
            </h3>
          )}
          <ul className="space-y-1">
            {section.items
              .filter(item => !item.roles || item.roles.includes(role as any))
              .map((item) => (
                <li key={item.title}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) => 
                      `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive 
                          ? 'bg-primary text-primary-foreground' 
                          : 'text-foreground hover:bg-muted'
                      }`
                    }
                  >
                    {item.icon && <item.icon className="mr-3 h-5 w-5" />}
                    <span>{item.title}</span>
                    {item.badge && (
                      <span className={`ml-auto px-2 py-0.5 text-xs rounded-full ${
                        item.badge.variant === 'destructive' 
                          ? 'bg-destructive text-destructive-foreground' 
                          : item.badge.variant === 'secondary'
                            ? 'bg-secondary text-secondary-foreground'
                            : item.badge.variant === 'outline'
                              ? 'border border-input'
                              : 'bg-primary text-primary-foreground'
                      }`}>
                        {item.badge.text}
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </nav>
  );
};
