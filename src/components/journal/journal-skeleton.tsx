import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <div className="w-[352px] h-[278px] p-4 border rounded-xl flex flex-col justify-between">
      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4 rounded-md" />
        <Skeleton className="h-4 w-1/2 rounded-md" />
      </div>
      <Skeleton className="h-6 w-10 self-end rounded-md" />
    </div>
  );
}
