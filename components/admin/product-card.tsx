import { Badge } from "@/components/ui/badge";
import { formatPrice, slugify } from "@/lib/formatters";
import {
  GetAdminProductsResponse,
  UpsertProductRequest,
  upsertProduct,
} from "@/server-functions/products";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Select, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

import { getBrands } from "@/server-functions/brands";
import { getCategories } from "@/server-functions/categories";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Column } from "../layout/column";
import { Row } from "../layout/row";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { SelectContent } from "../ui/select";
import BrandForm from "./create-brand-form";
import CurrencyInput from "react-currency-input-field";

interface GenderLabel {
  [key: string]: string;
}

const GENDERS = ["Masculino", "Feminino", "Unisex"];

const genderLabel: GenderLabel = {
  Masculino: "Masc.",
  Feminino: "Fem.",
  Unisex: "Unisex",
};

export default function ProductAdminCard({
  product,
}: {
  product: GetAdminProductsResponse;
}) {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
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

  useEffect(() => {
    if (product) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        name: product.name,
        description: product.description,
        slug: product.slug,
        gender: product.gender,
        categoryId: product.categoryId,
        brandId: product.brandId,
        priceInCents: product.priceInCents,
        promoPriceInCents: product.promoPriceInCents,
        imageUrl: product.imageUrl,
        fragranticaUrl: product.fragranticaUrl,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        isPublished: product.isPublished,
      });
    }
  }, [product]);

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
    mutationFn: ({
      product,
      id,
    }: {
      product: UpsertProductRequest;
      id: number;
    }) => upsertProduct({ product, id }),
    mutationKey: ["upsertProduct"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsFormOpen(false);
    },
  });

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate({ product: form, id: product.id });
  };

  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <DialogTrigger asChild>
        <div className="group block border-accent border rounded-xl shadow-md">
          <div className="relative aspect-square rounded-t-xl overflow-hidden bg-secondary/50 mb-3">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-75"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground/40">
                <svg
                  className="w-12 h-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
            <Badge className="absolute top-2 left-2 text-[10px] font-medium bg-background/80 text-foreground backdrop-blur-sm py-1 px-4 rounded-full">
              {genderLabel[product.gender] || product.gender}
            </Badge>
          </div>
          <div className="space-y-1 px-4 pb-4">
            <p className="text-[11px] uppercase tracking-wider text-primary font-medium">
              {product.brand}
            </p>
            <h3 className="text-sm font-medium leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-[11px] text-muted-foreground">
              {product.category}
            </p>
            <p className="text-sm font-semibold text-foreground">
              {formatPrice(product.priceInCents)}
            </p>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="md:min-w-7xl ">
        <div>
          <DialogTitle>Editar Produto</DialogTitle>
          <DialogDescription>Campos obrigatórios com *</DialogDescription>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Column className="md:flex-row">
            <div className="space-y-1.5 flex-1">
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
            <div className="space-y-1.5 flex-1">
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
            <div className="space-y-1.5 md:w-48 w-full">
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
          </Column>
          <div className="space-y-1.5">
            <Label>Marca *</Label>
            <Row>
              <Select
                value={form.brandId ? form.brandId.toString() : ""}
                onValueChange={(v) => setForm({ ...form, brandId: Number(v) })}
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
              onValueChange={(v) => setForm({ ...form, categoryId: Number(v) })}
            >
              <SelectTrigger className="w-full">
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
              {product ? "Salvar" : "Criar produto"}
            </Button>
          </Row>
        </form>
      </DialogContent>
    </Dialog>
  );
}
