"use client";
import { getBrands } from "@/server-functions/brands";
import { getCategories } from "@/server-functions/categories";
import {
  GetAdminProductRequest,
  GetProductRequest,
} from "@/server-functions/products";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { Input } from "../ui/input";
import { Row } from "../layout/row";

interface FilterBarProps {
  filter: GetAdminProductRequest;
  setFilter: (filter: GetAdminProductRequest) => void;
  total: number;
}
const AdminFilterBar = ({ filter, setFilter, total }: FilterBarProps) => {
  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: () => getBrands(),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  const activeCount = [filter.gender, filter.category, filter.brand].filter(
    Boolean,
  ).length;

  const clearAll = () => {
    setFilter({ gender: "", category: undefined, brand: undefined });
  };

  return (
    <div className="flex gap-2 flex-1">
      <Row className="gap-2 flex-1 items-center">
        <Search className="w-4 h-4" />
        <Input
          value={filter.name}
          onChange={(e) => setFilter({ ...filter, name: e.target.value })}
          placeholder="Buscar por nome do produto"
          className="w-full"
        />
      </Row>
      <Sheet>
        <SheetTrigger asChild>
          <Button className="rounded-full text-xs" variant="secondary">
            <SlidersHorizontal className="h-4 w-4" />
            Filtros
            {activeCount > 0 && (
              <Badge className="h-4 w-4 p-0 flex items-center justify-center text-[9px] bg-primary text-primary-foreground rounded-full">
                {activeCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="rounded-t-2xl max-h-[80vh] min-h-[40vh] p-10"
        >
          <SheetHeader className="p-0">
            <SheetTitle className="font-heading text-lg">
              Filtros avançados
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-5 mt-5 pb-6">
            <ToggleGroup
              type="single"
              className="gap-4"
              value={filter.gender}
              onValueChange={(value) => setFilter({ ...filter, gender: value })}
            >
              <ToggleGroupItem value="Masculino" size="sm">
                Masculino
              </ToggleGroupItem>
              <ToggleGroupItem value="Feminino" size="sm">
                Feminino
              </ToggleGroupItem>
              <ToggleGroupItem value="Unisex" size="sm">
                Unisex
              </ToggleGroupItem>
            </ToggleGroup>
            <div className="flex items-center gap-5">
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Categoria
                </p>
                <Select
                  value={filter?.category ? String(filter.category) : "all"}
                  onValueChange={(v) =>
                    setFilter({
                      ...filter,
                      category: v === "all" ? undefined : Number(v),
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Todas as categorias" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    {categories?.map((c) => (
                      <SelectItem key={c.id} value={c.id.toString()}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Marca
                </p>
                <Select
                  value={filter?.brand ? String(filter.brand) : "all"}
                  onValueChange={(v) =>
                    setFilter({
                      ...filter,
                      brand: v === "all" ? undefined : Number(v),
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Todas as marcas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as marcas</SelectItem>
                    {brands?.map((b) => (
                      <SelectItem key={b.id} value={b.id.toString()}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={clearAll}>
                Limpar tudo
              </Button>
              <SheetClose asChild>
                <Button className="flex-1">Ver resultados ({total})</Button>
              </SheetClose>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminFilterBar;
