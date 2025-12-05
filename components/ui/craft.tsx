import * as React from "react";
import { cn } from "@/lib/utils";

// Section component for semantic HTML sections
export const Section = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <section
    ref={ref}
    className={cn("py-12 md:py-16 lg:py-20", className)}
    {...props}
  />
));
Section.displayName = "Section";

// Container component for consistent content width
export const Container = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("container mx-auto px-4 md:px-8", className)}
    {...props}
  />
));
Container.displayName = "Container";
