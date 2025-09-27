// components/ui/loading-skeleton.tsx
import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface LoadingSkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'card' | 'table-row';
  width?: string;
  height?: string;
}

export function LoadingSkeleton({
  variant = 'default',
  width,
  height,
  className,
  ...props
}: LoadingSkeletonProps) {
  const baseClasses = 'animate-pulse rounded-md bg-muted';
  
  const variantClasses = {
    default: 'h-4 w-full',
    card: 'rounded-xl',
    'table-row': 'h-12 w-full'
  };

  const style = {
    width: width || undefined,
    height: height || undefined
  };

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
      style={style}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center space-x-4">
        <LoadingSkeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <LoadingSkeleton className="h-4 w-[250px]" />
          <LoadingSkeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <LoadingSkeleton className="h-16 w-full" />
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="space-y-2 p-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <LoadingSkeleton className="h-4 w-1/4" />
          <LoadingSkeleton className="h-4 w-1/4" />
          <LoadingSkeleton className="h-4 w-1/4" />
          <LoadingSkeleton className="h-4 w-1/4" />
        </div>
      ))}
    </div>
  );
}