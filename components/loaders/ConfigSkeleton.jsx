import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "../ui/skeleton";

const ConfigSkeleton = () => {
  return (
    <div className="flex flex-wrap justify-start gap-8">
      {Array(9)
        .fill(null)
        .map((_, index) => (
          <Card
            key={index}
            className="shadow-lg rounded-lg w-[380px] animate-pulse"
          >
            <CardHeader className="flex flex-row items-center gap-4 justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div>
                  <Skeleton className="w-[120px] h-[24px]" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="w-[20px] h-[20px] rounded-full" />
                <Skeleton className="w-[40px] h-[24px] rounded-md" />
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 pb-4">
              <div className="flex items-center justify-between">
                <Skeleton className="w-[80px] h-[20px]" />
                <Skeleton className="w-[100px] h-[20px]" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="w-[80px] h-[20px]" />
                <Skeleton className="w-[100px] h-[20px]" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="w-[80px] h-[20px]" />
                <Skeleton className="w-[100px] h-[20px]" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="w-[80px] h-[20px]" />
                <Skeleton className="w-[100px] h-[20px]" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="w-[120px] h-[20px]" />
                <Skeleton className="w-[100px] h-[20px]" />
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
};

export default ConfigSkeleton;
