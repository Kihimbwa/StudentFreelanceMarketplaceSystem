import { Star } from "lucide-react";

interface RatingProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
}

const sizes = { sm: "w-3.5 h-3.5", md: "w-4 h-4", lg: "w-5 h-5" };

export default function Rating({ value, max = 5, size = "md", showValue = false }: RatingProps) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }).map((_, i) => (
          <Star
            key={i}
            className={`${sizes[size]} ${i < Math.round(value) ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
          />
        ))}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-slate-600">{value.toFixed(1)}</span>
      )}
    </div>
  );
}
