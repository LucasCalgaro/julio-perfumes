import { cn } from "@/lib/utils";

export const Row = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn("flex gap-2", className)}>{children}</div>;
};
