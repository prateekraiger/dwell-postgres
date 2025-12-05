"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Users,
  IndianRupee,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Shield,
  Clock,
  Home,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getHighlightByKey } from "@/lib/highlights";
import { format, differenceInDays, addDays } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getFormattedErrorMessage } from "@/lib/error-utils";
import { useAuth } from "@/components/providers/AuthProvider";

import { roomApi, bookingApi } from "@/lib/api";

export default function RoomDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: isLoading } = useAuth();
  const roomId = params.roomId as string;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [room, setRoom] = useState<any | null>(null);
  const [owner, setOwner] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await roomApi.getRoom(roomId);
        const roomData = response.data.room;
        setRoom({ ...roomData, _id: roomData.id });
        setOwner(roomData.owner);
      } catch (error) {
        console.error("Failed to fetch room:", error);
      } finally {
        setLoading(false);
      }
    };

    if (roomId) {
      fetchRoom();
    }
  }, [roomId]);

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/signin");
    }
  }, [isLoading, user, router]);

  // Booking state
  const [checkInDate, setCheckInDate] = useState<string>("");
  const [checkOutDate, setCheckOutDate] = useState<string>("");
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);



  // Show loading state while checking authentication or fetching room
  if (isLoading || loading) {
    return (
      <div className="container mx-auto py-20 px-4">
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
          <div className="text-center space-y-4">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!room || !owner) {
    return (
      <div className="container mx-auto py-20 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Room not found</h2>
          <Link href="/rooms" className="text-primary hover:underline mt-4 inline-block">
            Back to Rooms
          </Link>
        </div>
      </div>
    );
  }

  const hasMultipleImages = room.photos && room.photos.length > 1;

  const nextImage = () => {
    if (room.photos && hasMultipleImages) {
      setCurrentImageIndex((prev) => (prev + 1) % room.photos.length);
    }
  };

  const prevImage = () => {
    if (room.photos && hasMultipleImages) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + room.photos.length) % room.photos.length
      );
    }
  };

  // Calculate booking details
  const checkIn = checkInDate ? new Date(checkInDate) : undefined;
  const checkOut = checkOutDate ? new Date(checkOutDate) : undefined;
  const numberOfNights =
    checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;
  const totalPrice = numberOfNights * room.pricePerNight;
  const serviceFee = Math.round(totalPrice * 0.12); // 12% service fee
  const grandTotal = totalPrice + serviceFee;

  const handleBookRoom = async () => {
    if (!checkIn || !checkOut) return;

    setIsBooking(true);
    setBookingError(null);

    try {
      // 1. Create Booking
      await bookingApi.createBooking({
        roomId,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
      });

      setIsSuccess(true);
      setTimeout(() => {
        router.push("/my-bookings");
      }, 1500);
    } catch (error) {
      setBookingError(getFormattedErrorMessage(error));
      setIsBooking(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-8 max-w-7xl">
      <Link
        href="/rooms"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Rooms
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Left Side - Images */}
        <div className="lg:col-span-3 space-y-6">
          {/* Main Image with Navigation */}
          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted border group">
            {room.photos && room.photos.length > 0 ? (
              <>
                <img
                  src={room.photos[currentImageIndex]}
                  alt={`${room.title} - Image ${currentImageIndex + 1}`}
                  className="h-full w-full object-cover"
                />
                {hasMultipleImages && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                    {/* Dots Indicator */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {room.photos.map((_: any, index: number) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`h-2 rounded-full transition-all ${
                            index === currentImageIndex
                              ? "w-8 bg-primary"
                              : "w-2 bg-background/60 hover:bg-background/80"
                          }`}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                No Image Available
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">About this place</h2>
            <p className="text-muted-foreground leading-relaxed">
              {room.description}
            </p>
          </div>

          {/* Amenities */}
          {room.highlights && room.highlights.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Amenities</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {room.highlights.map((highlightKey: string, i: number) => {
                  const highlight = getHighlightByKey(highlightKey);
                  if (!highlight) return null;
                  const Icon = highlight.icon;
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-4 rounded-lg border bg-card"
                    >
                      <Icon className="h-6 w-6 text-primary shrink-0" />
                      <span className="font-medium">{highlight.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Things to Know */}
          <div className="space-y-4 border-t pt-6">
            <h2 className="text-2xl font-bold">Things to know</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  House rules
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>Check-in: 10:00 AM - 6:00 PM</li>
                  <li>Checkout: Before 11:00 AM</li>
                  <li>Maximum: 4 guests per room</li>
                  <li>No parties or events without prior approval</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Safety & property
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>Carbon monoxide alarm</li>
                  <li>Smoke alarm</li>
                  <li>Security cameras on property</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Cancellation policy
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>Free cancellation for 24 hours</li>
                  <li>Cancel before check-in for partial refund</li>
                  <li>Review full policy for details</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Booking Card & Owner Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Owner Info */}
          <div className="rounded-xl border bg-card p-6 space-y-4 sticky top-6">
            <h3 className="font-semibold text-lg">
              Hosted by {owner?.name || "Unknown"}
            </h3>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage alt={owner?.name} />
                <AvatarFallback className="text-lg">
                  {owner?.name?.charAt(0) || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="text-sm text-muted-foreground">
                <p>{owner?.email}</p>
                <p className="text-xs mt-1">Owner on Dwell</p>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="rounded-xl border bg-card p-6 space-y-6 sticky top-[200px] shadow-lg">
            <div>
              <h1 className="text-3xl font-bold">{room.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground mt-2">
                <MapPin className="h-4 w-4" />
                <span>{room.location}</span>
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <div className="flex items-center gap-1 text-3xl font-bold text-primary">
                <IndianRupee className="h-6 w-6" />
                {room.pricePerNight}
              </div>
              <span className="text-muted-foreground">per night</span>
            </div>

            {/* Date Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="check-in">Check-in</Label>
                <Input
                  id="check-in"
                  type="date"
                  min={format(new Date(), "yyyy-MM-dd")}
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="check-out">Check-out</Label>
                <Input
                  id="check-out"
                  type="date"
                  min={
                    checkInDate || format(addDays(new Date(), 1), "yyyy-MM-dd")
                  }
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 w-full">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>Up to {room.maxGuests} guests</span>
              </div>
            </div>

            {/* Price Breakdown */}
            {numberOfNights > 0 && (
              <div className="space-y-3 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    ₹{room.pricePerNight} x {numberOfNights} nights
                  </span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Service fee</span>
                  <span>₹{serviceFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>
            )}

            {isSuccess ? (
              <div className="rounded-lg bg-green-500/15 p-4 flex items-center gap-3 text-green-600">
                <CheckCircle2 className="h-5 w-5" />
                <div className="text-sm font-medium">
                  Booking confirmed! Redirecting...
                </div>
              </div>
            ) : (
              <Button
                size="lg"
                className="w-full text-base"
                onClick={handleBookRoom}
                disabled={
                  !checkIn || !checkOut || isBooking || numberOfNights <= 0
                }
              >
                {isBooking ? "Redirecting to Payment..." : "Book This Room"}
              </Button>
            )}

            {bookingError && (
              <div className="rounded-lg bg-destructive/15 p-3 flex items-center gap-2 text-destructive text-sm">
                <XCircle className="h-4 w-4" />
                <span>{bookingError}</span>
              </div>
            )}

            <p className="text-xs text-center text-muted-foreground">
              You won&apos;t be charged yet
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
