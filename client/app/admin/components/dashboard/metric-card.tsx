"use client";

import {
  HiOutlineArrowTrendingDown,
  HiOutlineArrowTrendingUp,
} from "react-icons/hi2";
import { IoMdTrendingUp , IoMdTrendingDown} from "react-icons/io";

import { cn } from "@/app/lib/utils";
import { Card } from "../../../shared/ui/Card";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  className?: string;
}

export function MetricCard({
  title,
  value,
  change,
  positive,
  className,
}: MetricCardProps) {
  return (
    <Card
      className={cn(
        "p-6 bg-gradient-to-br relative overflow-hidden",
        className
      )}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm opacity-80 mb-1">{title}</p>
          <h3 className="text-3xl font-bold">{value}</h3>
        </div>
        <div>
          <div className="w-full flex flex-col justify-center items-center">
            <div className="text-white rounded-xl ">
              {positive ? <IoMdTrendingUp
                className="h-8 w-10 shadow-chart-icon rounded-xl text-white "
              /> : <IoMdTrendingDown className="h-8 w-10 shadow-chart-icon rounded-xl text-white "/>}
            </div>
            <div
              className={cn(
                "flex items-center text-sm",
                positive ? "text-green-400" : "text-red-400"
              )}
            >
              {change}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
