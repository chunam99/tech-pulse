type BadgeProps = {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "muted";
  className?: string;
};

const variants = {
  default:
    "bg-violet-500/15 text-violet-700 border-violet-500/30 dark:text-violet-300",
  success:
    "bg-emerald-500/15 text-emerald-700 border-emerald-500/30 dark:text-emerald-300",
  warning:
    "bg-amber-500/15 text-amber-700 border-amber-500/30 dark:text-amber-300",
  muted:
    "bg-zinc-500/15 text-zinc-600 border-zinc-500/30 dark:text-zinc-400",
};

export function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
