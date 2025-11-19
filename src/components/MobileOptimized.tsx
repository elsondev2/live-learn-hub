import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MobileOptimizedProps {
  children: ReactNode;
  className?: string;
}

export function MobileOptimized({ children, className }: MobileOptimizedProps) {
  return (
    <div className={cn('min-h-screen w-full overflow-x-hidden', className)}>
      {children}
    </div>
  );
}

export function MobileContainer({ children, className }: MobileOptimizedProps) {
  return (
    <div className={cn('container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl', className)}>
      {children}
    </div>
  );
}

export function MobileCard({ children, className }: MobileOptimizedProps) {
  return (
    <div className={cn('rounded-lg border bg-card text-card-foreground shadow-sm p-4 sm:p-6', className)}>
      {children}
    </div>
  );
}
