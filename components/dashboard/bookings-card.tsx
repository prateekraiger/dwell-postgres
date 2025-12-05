"use client";

import { useState, useEffect } from "react";
import { bookingApi } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Loader2 } from "lucide-react";
import { differenceInDays } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


export function BookingsCard() {
  const [filterStatus, setFilterStatus] = useState<"all" | "confirmed" | "cancelled" | "pending">("all");

  const [bookings, setBookings] = useState<any[] | undefined>(undefined);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await bookingApi.getOwnerBookings();
        const mappedBookings = response.data.bookings.map((booking: any) => ({
          ...booking,
          _id: booking.id,
          guest: booking.user, // Map user to guest for display
        }));
        setBookings(mappedBookings);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
        setBookings([]);
      }
    };

    fetchBookings();
  }, []);

  if (bookings === undefined) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>Loading your bookings...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[200px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Filter bookings based on status
  const filteredBookings = bookings.filter((booking) => {
    if (filterStatus === "all") return true;
    return booking.status.toLowerCase() === filterStatus.toLowerCase();
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>A list of all bookings for your properties</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("all")}
            >
              All
            </Button>
            <Button
              variant={filterStatus === "confirmed" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("confirmed")}
            >
              Confirmed
            </Button>
            <Button
              variant={filterStatus === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("pending")}
            >
              Pending
            </Button>
            <Button
              variant={filterStatus === "cancelled" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("cancelled")}
            >
              Cancelled
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
              <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
              <h3 className="text-lg font-semibold">No bookings found</h3>
              <p>There are no bookings matching your filter.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hotel Name</TableHead>
                    <TableHead>Guest Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => {
                    const nights = differenceInDays(
                      new Date(booking.checkOut),
                      new Date(booking.checkIn)
                    );
                    const totalAmount = booking.room ? booking.room.pricePerNight * nights : 0;

                    return (
                      <TableRow key={booking._id}>
                        <TableCell className="font-medium">
                          {booking.room?.title || "Unknown Room"}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{booking.guest?.name || "Unknown Guest"}</span>
                            <span className="text-xs text-muted-foreground">{booking.guest?.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              booking.status === "CONFIRMED" || booking.status === "confirmed"
                                ? "bg-green-600 hover:bg-green-700"
                                : booking.status === "PENDING" || booking.status === "pending"
                                ? "bg-neutral-900 hover:bg-neutral-800"
                                : "bg-red-600 hover:bg-red-700"
                            }
                          >
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          ₹{totalAmount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
