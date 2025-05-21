
import { useSecureContextStore } from '@/stores/secureContextStore';
import { SolutionSelector } from '../SolutionSelector';

export const SidebarHeader = () => {
  const { user } = useSecureContextStore();
  
  return (
    <div className="flex flex-col gap-2 p-4 border-b">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Dashboard</h2>
      </div>
      {user && <SolutionSelector />}
    </div>
  );
};
