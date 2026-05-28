import React from 'react';

const PageSkeleton = () => {
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1440px] mx-auto animate-pulse">
      {/* Page header skeleton */}
      <div className="mb-6">
        <div className="h-8 w-48 bg-slate-200 rounded mb-2"></div>
        <div className="h-4 w-32 bg-slate-200 rounded"></div>
      </div>

      {/* Filter bar skeleton */}
      <div className="flex gap-3 mb-6">
        <div className="h-10 w-64 bg-slate-200 rounded"></div>
        <div className="h-10 w-32 bg-slate-200 rounded"></div>
        <div className="h-10 w-32 bg-slate-200 rounded ml-auto"></div>
      </div>

      {/* Content skeleton */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex gap-4 p-4 border-b border-slate-100 last:border-0">
            <div className="h-4 w-24 bg-slate-200 rounded"></div>
            <div className="h-4 w-32 bg-slate-200 rounded"></div>
            <div className="h-4 w-24 bg-slate-200 rounded"></div>
            <div className="h-8 w-8 bg-slate-200 rounded-full ml-auto"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageSkeleton;
