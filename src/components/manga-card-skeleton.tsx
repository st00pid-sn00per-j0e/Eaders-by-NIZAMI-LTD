
"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

const MangaCardSkeleton = () => {
  return (
    <Card className="h-full flex flex-col overflow-hidden rounded-lg shadow-sm">
      <CardHeader className="p-0 relative aspect-[2/3]">
        <Skeleton className="h-full w-full rounded-t-lg" />
      </CardHeader>
      <CardContent className="p-4 flex-grow space-y-3">
        <Skeleton className="h-5 w-3/4 rounded" /> {/* Title */}
        <Skeleton className="h-3 w-1/2 rounded" /> {/* Author / Sub-info */}
        <div className="space-y-1.5 pt-1">
          <Skeleton className="h-3 w-full rounded" /> {/* Description line 1 */}
          <Skeleton className="h-3 w-5/6 rounded" /> {/* Description line 2 */}
          <Skeleton className="h-3 w-2/3 rounded" /> {/* Description line 3 */}
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <Skeleton className="h-4 w-1/3 rounded" /> {/* Chapters/Status */}
      </CardFooter>
    </Card>
  );
};

export default MangaCardSkeleton;
