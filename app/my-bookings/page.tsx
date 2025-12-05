"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MapPin, Users, Loader2, CreditCard } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { bookingApi, paymentApi } from "@/lib/api";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

export default function MyBookingsPage() {
  const { loading: isLoading } = useAuth();

  const [bookings, setBookings] = useState<any[] | undefined>(undefined);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await bookingApi.getMyBookings();
        const mappedBookings = response.data.bookings.map((booking: any) => ({
          ...booking,
          _id: booking.id,
        }));
        setBookings(mappedBookings);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
        setBookings([]);
      }
    };

    if (!isLoading) {
      fetchBookings();
    }
  }, [isLoading]);

  const searchParams = useSearchParams();
  const router = useRouter();

  const confirmBooking = async ({ bookingId }: { bookingId: string }) => {
    await bookingApi.updateBooking(bookingId, "CONFIRMED");
    return true;
  };

  const createCheckoutSession = async ({ bookingId }: { bookingId: string }) => {
    const response = await paymentApi.createCheckoutSession(bookingId);
    return response.data;
  };
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const success = searchParams.get("success");
    const bookingId = searchParams.get("bookingId");

    if (success === "true" && bookingId) {
      const confirm = async () => {
        try {
          await confirmBooking({ bookingId: bookingId as string });
          toast.success("Payment successful! Booking confirmed.");
          // Remove query params
          router.replace("/my-bookings");
        } catch (error) {
          console.error("Failed to confirm booking:", error);
          toast.error("Failed to confirm booking. Please contact support.");
        }
      };
      confirm();
    } else if (searchParams.get("canceled") === "true") {
      toast.error("Payment cancelled.");
      router.replace("/my-bookings");
    }
  }, [searchParams, confirmBooking, router]);

  const handlePayNow = async (bookingId: string) => {
    setProcessingId(bookingId);
    try {
      const { sessionUrl } = await createCheckoutSession({ bookingId });
      if (sessionUrl) {
        window.location.href = sessionUrl;
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Failed to initiate payment.");
      setProcessingId(null);
    }
  };

  if (isLoading || bookings === undefined) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-8 max-w-6xl">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
        <p className="text-muted-foreground">
          View and manage your upcoming and past stays.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-xl bg-muted/30">
          <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold">No bookings yet</h3>
          <p className="text-muted-foreground mb-6">
            You haven't made any bookings yet. Start exploring our rooms!
          </p>
          <Link href="/rooms">
            <Button>Explore Rooms</Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[400px]">Hotel</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Payment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => {
                const nights = differenceInDays(
                  new Date(booking.checkOut),
                  new Date(booking.checkIn)
                );
                const totalAmount = booking.room ? booking.room.pricePerNight * nights : 0;
                const serviceFee = Math.round(totalAmount * 0.12);
                const grandTotal = totalAmount + serviceFee;

                return (
                  <TableRow key={booking._id}>
                    <TableCell>
                      <div className="flex items-start gap-4">
                        <div className="h-16 w-24 rounded-md overflow-hidden bg-muted shrink-0">
                          {booking.room?.photos?.[0] ? (
                            <img
                              src={booking.room.photos[0]}
                              alt={booking.room.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="font-medium line-clamp-1">
                            {booking.room?.title || "Unknown Room"}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {booking.room?.location || "Unknown Location"}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Users className="h-3 w-3" />
                            {booking.room?.maxGuests || 2} Guests
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium">Check-in</span>
                          <span className="text-muted-foreground">
                            {format(new Date(booking.checkIn), "EEE MMM dd, yyyy")}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1 mt-2">
                          <span className="font-medium">Check-out</span>
                          <span className="text-muted-foreground">
                            {format(new Date(booking.checkOut), "EEE MMM dd, yyyy")}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          booking.status === "CONFIRMED"
                            ? "bg-green-600 hover:bg-green-700"
                            : booking.status === "PENDING"
                            ? "bg-neutral-900 hover:bg-neutral-800"
                            : "bg-gray-500 hover:bg-gray-600"
                        }
                      >
                        {booking.status === "CONFIRMED" ? "Confirmed" : booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ₹{grandTotal.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {booking.status === "PENDING" && (
                        <Button
                          size="sm"
                          className="gap-2"
                          onClick={() => handlePayNow(booking._id)}
                          disabled={processingId === booking._id}
                        >
                          {processingId === booking._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <CreditCard className="h-4 w-4" />
                          )}
                          Pay Now
                        </Button>
                      )}
                      {booking.status === "CONFIRMED" && (
                         <span className="text-green-600 font-medium text-sm flex items-center justify-end gap-1">
                           Paid
                         </span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
