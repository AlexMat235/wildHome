export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl2 overflow-hidden shadow-card animate-pulse">
      {/* Photo placeholder */}
      <div className="skeleton h-48 w-full" />
      <div className="p-4 space-y-3">
        {/* Badge */}
        <div className="skeleton h-4 w-24 rounded-full" />
        {/* Title */}
        <div className="skeleton h-5 w-3/4 rounded" />
        <div className="skeleton h-4 w-1/2 rounded" />
        {/* Description */}
        <div className="space-y-2 pt-1">
          <div className="skeleton h-3 w-full rounded" />
          <div className="skeleton h-3 w-5/6 rounded" />
        </div>
        {/* Chips */}
        <div className="flex gap-2 pt-1">
          <div className="skeleton h-5 w-16 rounded-full" />
          <div className="skeleton h-5 w-20 rounded-full" />
          <div className="skeleton h-5 w-14 rounded-full" />
        </div>
      </div>
    </div>
  );
}
