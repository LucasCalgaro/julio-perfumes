import Link from "next/link";
import { Column } from "./layout/column";
import ThemeToggle from "./theme-toggle";

const Navbar = () => {
  return (
    <Column className="w-full">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-heading text-lg font-semibold tracking-tight">
              Júlio <span className="text-primary">Perfumes</span>
            </span>
          </Link>
          <div className="flex items-center gap-1">
            <ThemeToggle />
          </div>
        </div>
      </header>
    </Column>
  );
};

export default Navbar;
