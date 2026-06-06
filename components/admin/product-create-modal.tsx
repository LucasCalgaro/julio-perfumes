"use client";
import { getBrands } from "@/server-functions/brands";
import { getCategories } from "@/server-functions/categories";
import {
  upsertProduct,
  UpsertProductRequest,
} from "@/server-functions/products";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { Row } from "../layout/row";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import BrandForm from "./create-brand-form";
import CurrencyInput from "react-currency-input-field";

const GENDERS = ["Masculino", "Feminino", "Unisex"];

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const ProductCreateModal = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<UpsertProductRequest>({
    name: "",
    priceInCents: 0,
    slug: "",
    gender: "Masculino",
    imageUrl: "",
    categoryId: 0,
    brandId: 0,
    fragranticaUrl: "",
  });

  const [
    { data: brands, isLoading: isBrandsLoading },
    { data: categories, isLoading: isCategoriesLoading },
  ] = useQueries({
    queries: [
      {
        queryKey: ["brands"],
        queryFn: () => getBrands(),
      },
      {
        queryKey: ["categories"],
        queryFn: () => getCategories(),
      },
    ],
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (product: UpsertProductRequest) => upsertProduct({ product }),
    mutationKey: ["upsertProduct"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(form);
  };

  const frameworks = [
    "Next.js",
    "SvelteKit",
    "Nuxt.js",
    "Remix",
    "Astro",
  ] as const;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-3.5 w-3.5" /> Novo Produto
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-7xl">
        <div>
          <DialogTitle className="text-2xl ml-0">Novo Produto</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para criar um novo produto.
          </DialogDescription>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Nome *</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                    slug: slugify(e.target.value),
                  })
                }
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Preço (R$) *</Label>
              <CurrencyInput
                className="h-10 w-full min-w-0 border border-transparent border-b-input bg-transparent px-0 py-1 text-base transition-[color,border-color] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-b-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-b-destructive md:text-sm dark:aria-invalid:border-b-destructive/50"
                prefix="R$ "
                defaultValue={(form?.priceInCents || 0) / 100}
                decimalScale={2}
                decimalSeparator=","
                decimalsLimit={2}
                onValueChange={(_, __, values) =>
                  setForm({
                    ...form,
                    priceInCents: Number((values?.float || 0) * 100),
                  })
                }
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Gênero *</Label>
              <Select
                value={form.gender}
                onValueChange={(v) => setForm({ ...form, gender: v })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GENDERS.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Marca *</Label>
              <Row>
                <Select
                  value={form.brandId ? form.brandId.toString() : ""}
                  onValueChange={(v) =>
                    setForm({ ...form, brandId: Number(v) })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent popover="auto" position="popper">
                    {brands?.map((b) => (
                      <SelectItem key={b.id} value={b.id.toString()}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <BrandForm />
              </Row>
            </div>
            <div className="space-y-1.5">
              <Label>Categoria *</Label>
              <Select
                value={form.categoryId ? form.categoryId.toString() : ""}
                onValueChange={(v) =>
                  setForm({ ...form, categoryId: Number(v) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>URL da Imagem</Label>
              <Input
                value={form?.imageUrl || ""}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>URL Fragrantica</Label>
              <Input
                value={form?.fragranticaUrl || ""}
                onChange={(e) =>
                  setForm({ ...form, fragranticaUrl: e.target.value })
                }
                placeholder="https://fragrantica.com.br/..."
              />
            </div>
          </div>

          {/* Image preview */}
          {form?.imageUrl && (
            <div className="w-24 h-24 rounded-lg overflow-hidden border border-border">
              <img
                src={form.imageUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <Row>
            <DialogClose asChild>
              <Button className="flex-1" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button className="flex-1" type="submit" disabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Criar produto
            </Button>
          </Row>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductCreateModal;
