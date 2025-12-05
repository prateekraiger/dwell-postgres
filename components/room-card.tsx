"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, IndianRupee, Pencil, Trash2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getHighlightByKey } from "@/lib/highlights";
import { EditRoomModal } from "@/components/edit-room-modal";
import { roomApi } from "@/lib/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface RoomCardProps {
  room: {
    _id: string;
    title: string;
    location: string;
    pricePerNight: number;
    description: string;
    photos: string[];
    maxGuests: number;
    highlights: string[];
    isAvailable?: boolean;
  };
  showBookingAction?: boolean;
  showOwnerActions?: boolean;
}

export function RoomCard({ room, showBookingAction = false, showOwnerActions = false }: RoomCardProps) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await roomApi.deleteRoom(room._id);
      setDeleteDialogOpen(false);
      // Refresh the page to show the updated list
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete room:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const cardContent = (
    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      <div className="aspect-video w-full overflow-hidden bg-muted relative">
        {room.photos && room.photos.length > 0 ? (
          <img
            src={room.photos[0]}
            alt={room.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
            No Image
          </div>
        )}
        <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium">
            {room.maxGuests} Guests
        </div>
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="line-clamp-1 text-xl group-hover:text-primary transition-colors">{room.title}</CardTitle>
          <div className="flex items-center gap-1 text-sm text-muted-foreground shrink-0">
            <MapPin className="h-3 w-3" />
            {room.location}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pb-2 flex-1">
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {room.description}
        </p>
        {room.highlights && room.highlights.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {room.highlights.map((highlightKey, i) => {
              const highlight = getHighlightByKey(highlightKey);
              if (!highlight) return null;
              const Icon = highlight.icon;
              return (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground"
                >
                  <Icon className="h-3 w-3" />
                  {highlight.label}
                </span>
              );
            })}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t bg-muted/50 px-6 py-3 mt-auto">
        <div className="flex items-center gap-1 text-lg font-bold text-primary">
          <IndianRupee className="h-4 w-4" />
          {room.pricePerNight}
          <span className="text-sm font-normal text-muted-foreground">/night</span>
        </div>
        {showBookingAction && (
          <div className="flex items-center gap-1.5 bg-green-500/10 text-green-600 dark:text-green-500 px-3 py-1.5 rounded-full text-sm font-medium border border-green-500/20">
            <CheckCircle2 className="h-4 w-4" />
            Available
          </div>
        )}
        {showOwnerActions && (
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                setEditModalOpen(true);
              }}
              className="gap-1.5"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                setDeleteDialogOpen(true);
              }}
              className="text-destructive hover:text-destructive gap-1.5"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );

  return (
    <>
      {showOwnerActions ? (
        <div className="block h-full">{cardContent}</div>
      ) : (
        <Link href={`/rooms/${room._id}`} className="block h-full">
          {cardContent}
        </Link>
      )}

      {showOwnerActions && (
        <>
          <EditRoomModal
            room={{ ...room, isAvailable: room.isAvailable ?? true }}
            open={editModalOpen}
            onOpenChange={setEditModalOpen}
          />

          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete "{room.title}" from your listings. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </>
  );
}
