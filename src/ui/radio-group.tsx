"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  onValueChange?: (value: string) => void;
}

export function RadioGroup({ className, onValueChange, ...props }: RadioGroupProps) {
  return (
    <div
      className={cn("space-y-2", className)}
      onChange={(e: React.ChangeEvent<HTMLDivElement>) => {
        const target = e.target as HTMLInputElement;
        if (target?.type === "radio" && onValueChange) {
          onValueChange(target.value);
        }
      }}
      {...props}
    />
  );
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface RadioGroupItemProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function RadioGroupItem({ className, ...props }: RadioGroupItemProps) {
  return (
    <input
      type="radio"
      className={cn("form-radio text-yellow-600", className)}
      {...props}
    />
  );
}