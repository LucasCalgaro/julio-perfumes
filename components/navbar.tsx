import Link from "next/link";
import { Column } from "./layout/column";
import { ModeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { AlignLeft, ChevronLeft } from "lucide-react";

const Navbar = ({ isAdmin = false }: { isAdmin?: boolean }) => {
  return (
    <Column className="w-full">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-heading md:text-lg text-base font-semibold tracking-tight">
              Júlio <span className="text-primary">Perfumes</span>
            </span>
          </Link>
          <div className="flex items-center gap-1">
            {isAdmin && (
              <Button variant="link" asChild>
                <Link href="/">
                  <ChevronLeft className="w-4 h-4" /> Catálogo
                </Link>
              </Button>
            )}
            <ModeToggle />
          </div>
        </div>
      </header>
    </Column>
  );
};

export default Navbar;
