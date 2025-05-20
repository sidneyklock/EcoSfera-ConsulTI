
import { useState } from "react";

export function useSidebarCollapse(initialState: boolean = false) {
  const [collapsed, setCollapsed] = useState<boolean>(initialState);

  const toggleCollapsed = () => {
    setCollapsed(prev => !prev);
  };

  return {
    collapsed,
    setCollapsed,
    toggleCollapsed
  };
}
