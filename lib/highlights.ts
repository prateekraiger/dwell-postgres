import {
  Wifi,
  Coffee,
  Dumbbell,
  Waves,
  Sparkles,
  type LucideIcon
} from "lucide-react";

export interface Highlight {
  key: string;
  label: string;
  icon: LucideIcon;
}

export const AVAILABLE_HIGHLIGHTS: Highlight[] = [
  { key: "wifi", label: "Free WiFi", icon: Wifi },
  { key: "breakfast", label: "Breakfast", icon: Coffee },
  { key: "gym", label: "Gym", icon: Dumbbell },
  { key: "pool", label: "Swimming Pool", icon: Waves },
  { key: "spa", label: "Spa", icon: Sparkles },
  { key: "room_service", label: "Room Service", icon: Sparkles },
];

export function getHighlightByKey(key: string): Highlight | undefined {
  return AVAILABLE_HIGHLIGHTS.find(h => h.key === key);
}
