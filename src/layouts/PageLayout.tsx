
import React, { ReactNode } from 'react';

interface PageLayoutProps {
  title: string;
  children: ReactNode;
  description?: string;
  className?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  children,
  description,
  className = '',
}) => {
  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-2">{description}</p>
        )}
      </div>
      
      <div className={`w-full ${className}`}>
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
