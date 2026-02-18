import { Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export type VesselStatusFilter = "all" | "0" | "1" | "2" | "unknown";

type Props = {
  value: VesselStatusFilter;
  onChange: (value: VesselStatusFilter) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const OPTIONS: Array<{ value: VesselStatusFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "0", label: "Operational" },
  { value: "1", label: "Docking" },
  { value: "2", label: "Damaged" },
  { value: "unknown", label: "Unknown" },
];

export default function FilterVessel({
  value,
  onChange,
  open,
  onOpenChange,
}: Props) {
  return (
    <div className="relative">
      <Button
        onClick={() => onOpenChange(!open)}
        className={`w-10 h-10 rounded-full bg-[var(--navbar)] text-[var(--text-primary)] shadow-lg
          flex items-center justify-center transition-all duration-200
          hover:bg-primary hover:text-white
          ${open ? "bg-primary text-white shadow-none" : ""}`}
      >
        <Settings2 size={20} />
      </Button>

      {open && (
        <div className="absolute left-12 top-0 w-64 bg-[var(--background)] shadow-xl rounded-md z-[1001] p-3">
          <div className="text-sm font-semibold mb-2">Status</div>
          <RadioGroup
            value={value}
            onValueChange={(v) => onChange(v as VesselStatusFilter)}
            className="gap-2"
          >
            {OPTIONS.map((opt) => {
              const id = `vessel-status-${opt.value}`;
              return (
                <div key={opt.value} className="flex items-center gap-2">
                  <RadioGroupItem value={opt.value} id={id} />
                  <Label htmlFor={id}>{opt.label}</Label>
                </div>
              );
            })}
          </RadioGroup>
        </div>
      )}
    </div>
  );
}
