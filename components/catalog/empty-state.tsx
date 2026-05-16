import React from "react";
import { SearchX } from "lucide-react";

export default function EmptyState({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
        <SearchX className="h-7 w-7 text-muted-foreground" />
      </div>
      <p className="text-muted-foreground text-sm">{message || "Nenhum produto encontrado."}</p>
    </div>
  );
}