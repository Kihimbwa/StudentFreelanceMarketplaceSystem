import { Link } from "react-router-dom";
import { getInitials } from "../../utils/helpers";

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  to?: string;
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-lg",
  xl: "w-20 h-20 text-2xl",
};

export default function Avatar({ name, size = "md", to, className = "" }: AvatarProps) {
  const base = `inline-flex items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-white font-semibold flex-shrink-0 ${sizeClasses[size]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={base}>
        {getInitials(name)}
      </Link>
    );
  }
  return <span className={base}>{getInitials(name)}</span>;
}
