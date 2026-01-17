import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        admin: "bg-red-500/15 text-red-500 border border-red-500/20",
        student: "bg-blue-500/15 text-blue-500 border border-blue-500/20",
        tutor: "bg-emerald-500/15 text-emerald-500 border border-emerald-500/20",
        active: "bg-emerald-500/15 text-emerald-500 border border-emerald-500/20",
        inactive: "bg-muted text-muted-foreground border border-border",
        pending: "bg-amber-500/15 text-amber-500 border border-amber-500/20",
        completed: "bg-emerald-500/15 text-emerald-500 border border-emerald-500/20",
        failed: "bg-red-500/15 text-red-500 border border-red-500/20",
        tech: "bg-blue-500/15 text-blue-500 border border-blue-500/20",
        marketing: "bg-purple-500/15 text-purple-500 border border-purple-500/20",
        design: "bg-pink-500/15 text-pink-500 border border-pink-500/20",
      },
    },
    defaultVariants: {
      variant: "student",
    },
  }
);

interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
  children: React.ReactNode;
  className?: string;
}

export function StatusBadge({ variant, children, className }: StatusBadgeProps) {
  return (
    <span className={cn(statusBadgeVariants({ variant }), className)}>
      {children}
    </span>
  );
}

// Helper to get variant from role/status strings
export function getRoleVariant(role: string): "admin" | "student" | "tutor" {
  switch (role?.toLowerCase()) {
    case "admin":
      return "admin";
    case "tutor":
      return "tutor";
    default:
      return "student";
  }
}

export function getStatusVariant(status: string): "active" | "inactive" | "pending" | "completed" | "failed" {
  switch (status?.toLowerCase()) {
    case "active":
    case "true":
      return "active";
    case "inactive":
    case "false":
      return "inactive";
    case "pending":
      return "pending";
    case "completed":
      return "completed";
    case "failed":
      return "failed";
    default:
      return "inactive";
  }
}

export function getCategoryVariant(category: string): "tech" | "marketing" | "design" {
  switch (category?.toLowerCase()) {
    case "tech":
      return "tech";
    case "marketing":
      return "marketing";
    case "design":
      return "design";
    default:
      return "tech";
  }
}
