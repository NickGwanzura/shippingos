import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WhatsAppButtonProps {
  number: string;
  message?: string;
  label?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "success";
  size?: "sm" | "md" | "lg";
  className?: string;
}

/** Normalize any international phone to a wa.me-compatible digits string. */
export function normalizeWa(number: string): string {
  return number.replace(/[^\d]/g, "");
}

/**
 * Reusable WhatsApp action component. The target number is passed in from the
 * server-side CompanySettings config — never hardcoded in components.
 */
export function WhatsAppButton({
  number,
  message = "",
  label = "WhatsApp",
  variant = "primary",
  size = "md",
  className,
}: WhatsAppButtonProps) {
  const digits = number.replace(/[^\d]/g, "");
  const text = encodeURIComponent(message);
  const href = `https://wa.me/${digits}${text ? `?text=${text}` : ""}`;
  return (
    <Button
      href={href}
      variant={variant}
      size={size}
      className={className}
      icon={<Phone className="h-4 w-4" />}
    >
      {label}
    </Button>
  );
}
