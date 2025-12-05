"use client";
import { BookingsCard } from "@/components/dashboard/bookings-card";

export default function BookingsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Bookings</h2>
        <p className="text-muted-foreground">
          View and manage all your hotel bookings.
        </p>
      </div>

      {/* Bookings List */}
      <BookingsCard />
    </div>
  );
}
