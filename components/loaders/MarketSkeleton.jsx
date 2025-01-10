import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "../ui/skeleton";

const MarketSkeleton = () => {
  return (
    <div className="flex flex-wrap justify-start gap-8">
      {Array(9)
        .fill(null)
        .map((_, index) => (
          <Card
            key={index}
            className="shadow-lg rounded-lg p-4 w-[380px] animate-pulse"
          >
            <CardHeader className="flex flex-row items-center p-0 mb-3 gap-4">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="flex flex-col items-start gap-1">
                <Skeleton className="w-[200px] h-[35px]" />
                <Skeleton className="w-[80px] h-[25px]" />
              </div>
            </CardHeader>
            <CardContent className="flex flex-row items-center justify-between gap-8 p-0 px-1 pb-2 border-b">
              <Skeleton className="w-[100px] h-[40px]" />
              <Skeleton className="w-[150px] h-[60px]" />
            </CardContent>
            <CardFooter className="flex flex-col items-start p-0 pt-3 text-sm gap-2">
              <Skeleton className="w-[200px] h-[20px]" />
              <Skeleton className="w-[200px] h-[20px]" />
            </CardFooter>
          </Card>
        ))}
    </div>
  );
};

export default MarketSkeleton;
