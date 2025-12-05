"use client";

import { RoomCard } from "@/components/room-card";
import { roomApi } from "@/lib/api";
import { useEffect, useState } from "react";

export default function RoomsPage() {
  const [rooms, setRooms] = useState<any[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await roomApi.getRooms();
        // Map id to _id for compatibility with RoomCard
        const mappedRooms = response.data.rooms.map((room: any) => ({
          ...room,
          _id: room.id,
        }));
        setRooms(mappedRooms);
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className="container mx-auto py-12 px-4 md:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Rooms & Suites</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Choose from our collection of elegantly designed rooms, each offering a unique blend of comfort and style.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-[400px] rounded-xl border bg-muted/50 animate-pulse"
            />
          ))}
        </div>
      ) : !rooms || rooms.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold">No rooms found</h3>
          <p className="text-muted-foreground mt-2">
            Check back later for available rooms.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <RoomCard key={room._id} room={room} showBookingAction={true} />
          ))}
        </div>
      )}
    </div>
  );
}
