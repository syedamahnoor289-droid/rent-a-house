import {
  Building2,
  Car,
  Coffee,
  CookingPot,
  Dumbbell,
  KeyRound,
  Laptop,
  PawPrint,
  Snowflake,
  Sparkles,
  TreePine,
  WashingMachine,
  Waves,
  Wifi,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  wifi: Wifi,
  kitchen: CookingPot,
  "shared-kitchen": CookingPot,
  dishwasher: CookingPot,
  elevator: Building2,
  garage: Car,
  parking: Car,
  backyard: TreePine,
  garden: TreePine,
  "pet-friendly": PawPrint,
  pool: Waves,
  "ocean-view": Waves,
  "air-conditioning": Snowflake,
  gym: Dumbbell,
  doorman: KeyRound,
  laundry: WashingMachine,
  desk: Laptop,
  "coffee-machine": Coffee,
};

function formatLabel(value: string): string {
  return value
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function AmenityBadge({ amenity }: { amenity: string }) {
  const Icon = iconMap[amenity.toLowerCase()] ?? Sparkles;

  return (
    <li className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-sm text-zinc-700 shadow-sm">
      <Icon className="h-4 w-4 text-brand-600" aria-hidden="true" />
      {formatLabel(amenity)}
    </li>
  );
}