import React from 'react';

export const Skeleton = ({
  className = '',
  ...props
}) => (
  <div
    className={`skeleton ${className}`}
    {...props}
  />
);

export const CardSkeleton = () => (
  <div className="border border-border rounded-2xl p-5 space-y-4 bg-card overflow-hidden">
    <Skeleton className="h-6 w-1/3 rounded-lg" />
    <Skeleton className="h-5 w-2/3 rounded-lg" />
    <Skeleton className="h-4 w-full rounded-lg" />
    <Skeleton className="h-4 w-4/5 rounded-lg" />
    <div className="flex justify-between items-center pt-3">
      <Skeleton className="h-7 w-16 rounded-lg" />
      <Skeleton className="h-9 w-20 rounded-xl" />
    </div>
  </div>
);

export const ProviderCardSkeleton = () => (
  <div className="border border-border rounded-2xl p-5 flex gap-4 bg-card">
    <Skeleton className="h-14 w-14 rounded-xl shrink-0" />
    <div className="flex-1 space-y-2.5">
      <Skeleton className="h-5 w-1/2 rounded-lg" />
      <Skeleton className="h-4 w-1/3 rounded-lg" />
      <Skeleton className="h-4 w-full rounded-lg" />
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-9 flex-1 rounded-xl" />
        <Skeleton className="h-9 flex-1 rounded-xl" />
      </div>
    </div>
  </div>
);

export default Skeleton;
