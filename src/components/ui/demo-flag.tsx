import { Badge } from "@/components/ui/badge";

/** Small "DEMO RECORD" marker for temporary records created in demo mode. */
export function DemoFlag({ show }: { show?: boolean }) {
  if (!show) return null;
  return <Badge tone="amber">Demo Record</Badge>;
}
