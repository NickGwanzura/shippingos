import Link from "next/link";
import { clsx } from "@/lib/format";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
type Size = "sm" | "md" | "lg" | "icon";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand text-white hover:bg-brand-dark shadow-sm focus-visible:ring-brand",
  secondary:
    "bg-brand-light text-brand hover:bg-[#dbe5f6] focus-visible:ring-brand",
  outline:
    "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus-visible:ring-slate-300",
  ghost: "text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-300",
  danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
  success: "bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-500",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
  icon: "h-9 w-9 p-0 justify-center",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  href?: string;
  icon?: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  href,
  icon,
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = clsx(
    "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap",
    variants[variant],
    sizes[size],
    className,
  );

  if (href) {
    const external = typeof href === "string" && href.startsWith("http");
    return (
      <Link
        href={href}
        className={classes}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {icon}
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...rest}>
      {icon}
      {children}
    </button>
  );
}
