"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Calendar, IndianRupee, Users } from "lucide-react";
import { BookingsCard } from "@/components/dashboard/bookings-card";
import { useEffect, useState } from "react";
import { roomApi, bookingApi } from "@/lib/api";
import { differenceInDays } from "date-fns";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalHotels: 0,
    totalBookings: 0,
    totalGuests: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsRes, bookingsRes] = await Promise.all([
          roomApi.getMyRooms(),
          bookingApi.getOwnerBookings(),
        ]);

        const rooms = roomsRes.data.rooms;
        const bookings = bookingsRes.data.bookings;

        const totalHotels = rooms.length;
        const totalBookings = bookings.length;

        let totalGuests = 0;
        let totalRevenue = 0;

        bookings.forEach((booking: any) => {
          if (booking.status === "confirmed") {
            // Estimate guests based on room capacity or default to 2
            totalGuests += booking.room?.maxGuests || 2;

            const nights = differenceInDays(
              new Date(booking.checkOut),
              new Date(booking.checkIn)
            );
            const price = booking.room?.pricePerNight || 0;
            totalRevenue += price * nights;
          }
        });

        setStats({
          totalHotels,
          totalBookings,
          totalGuests,
          totalRevenue,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    {
      title: "Total Hotels",
      value: loading ? "..." : stats.totalHotels,
      icon: Building2,
      description: "Active properties listed",
    },
    {
      title: "Total Bookings",
      value: loading ? "..." : stats.totalBookings,
      icon: Calendar,
      description: "All bookings received",
    },
    {
      title: "Total Guests",
      value: loading ? "..." : stats.totalGuests,
      icon: Users,
      description: "Estimated guests hosted",
    },
    {
      title: "Total Revenue",
      value: loading ? "..." : `₹${stats.totalRevenue.toLocaleString()}`,
      icon: IndianRupee,
      description: "Revenue from confirmed bookings",
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground">
          Welcome to your dashboard. Here you can manage your hotels and bookings.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <BookingsCard />
    </div>
  );
}
