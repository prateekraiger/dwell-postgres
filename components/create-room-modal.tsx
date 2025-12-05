"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import { AVAILABLE_HIGHLIGHTS } from "@/lib/highlights";
import { roomApi } from "@/lib/api";

export function CreateRoomModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    location: string;
    pricePerNight: string;
    description: string;
    maxGuests: string;
    photos: string[];
    highlights: string[];
  }>({
    title: "",
    location: "",
    pricePerNight: "",
    description: "",
    maxGuests: "",
    photos: ["", ""], // Start with 2 empty slots
    highlights: [],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (index: number, value: string) => {
    setFormData((prev) => {
      const newPhotos = [...prev.photos];
      newPhotos[index] = value;
      return { ...prev, photos: newPhotos };
    });
  };

  const addPhotoField = () => {
    setFormData((prev) => ({ ...prev, photos: [...prev.photos, ""] }));
  };

  const removePhotoField = (index: number) => {
    if (formData.photos.length <= 2) return;
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleHighlightToggle = (highlightKey: string) => {
    setFormData((prev) => {
      const currentHighlights = prev.highlights;
      if (currentHighlights.includes(highlightKey)) {
        return {
          ...prev,
          highlights: currentHighlights.filter((h) => h !== highlightKey),
        };
      } else {
        if (currentHighlights.length >= 3) {
          return prev; // Prevent selecting more than 3
        }
        return {
          ...prev,
          highlights: [...currentHighlights, highlightKey],
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Filter out empty photo URLs
      const validPhotos = formData.photos
        .map((url) => url.trim())
        .filter((url) => url.length > 0);

      if (validPhotos.length < 2) {
        alert("Please provide at least 2 photos.");
        setLoading(false);
        return;
      }

      await roomApi.createRoom({
        title: formData.title,
        location: formData.location,
        pricePerNight: Number(formData.pricePerNight),
        description: formData.description,
        maxGuests: Number(formData.maxGuests),
        photos: validPhotos,
        highlights: formData.highlights,
      });

      // Refresh the page to show the new room
      window.location.reload();

      setOpen(false);
      setFormData({
        title: "",
        location: "",
        pricePerNight: "",
        description: "",
        maxGuests: "",
        photos: ["", ""],
        highlights: [],
      });
    } catch (error) {
      console.error("Failed to create room:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Room
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Room</DialogTitle>
          <DialogDescription>
            Add a new room to your hotel listings. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Name
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="col-span-3"
                required
                placeholder="Enter your hotel name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="col-span-3"
                required
                placeholder="Enter location"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pricePerNight" className="text-right">
                Price/Night
              </Label>
              <Input
                id="pricePerNight"
                name="pricePerNight"
                type="number"
                value={formData.pricePerNight}
                onChange={handleChange}
                className="col-span-3"
                required
                min="0"
                placeholder="e.g. 150"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="maxGuests" className="text-right">
                Max Guests
              </Label>
              <Input
                id="maxGuests"
                name="maxGuests"
                type="number"
                value={formData.maxGuests}
                onChange={handleChange}
                className="col-span-3"
                required
                min="1"
                placeholder="Enter capacity"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="col-span-3"
                required
                placeholder="Describe the room..."
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Highlights</Label>
              <div className="col-span-3 grid grid-cols-2 gap-2">
                {AVAILABLE_HIGHLIGHTS.map((highlight) => (
                  <div
                    key={highlight.key}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={highlight.key}
                      checked={formData.highlights.includes(highlight.key)}
                      onCheckedChange={() =>
                        handleHighlightToggle(highlight.key)
                      }
                      disabled={
                        !formData.highlights.includes(highlight.key) &&
                        formData.highlights.length >= 3
                      }
                    />
                    <Label
                      htmlFor={highlight.key}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {highlight.label}
                    </Label>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground col-span-2 mt-1">
                  Select exactly 3 highlights
                </p>
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Photos</Label>
              <div className="col-span-3 space-y-2">
                {formData.photos.map((photo, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={photo}
                      onChange={(e) => handlePhotoChange(index, e.target.value)}
                      placeholder={`Photo URL ${index + 1}`}
                      required={index < 2} // First 2 are required
                    />
                    {formData.photos.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removePhotoField(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  onClick={addPhotoField}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Photo
                </Button>
                <p className="text-xs text-muted-foreground">
                  Minimum 2 photos required
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
