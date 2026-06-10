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
import { Column } from "../layout/column";
import PasteImageUploader from "../image-uploader";
import ImageUploader from "../image-uploader";
import { uploadImage } from "@/server-functions/upload";

const GENDERS = ["Masculino", "Feminino", "Unisex"];

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const ProductCreateModal = ({ extended = false }: { extended?: boolean }) => {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [form, setForm] = useState<UpsertProductRequest>({
    name: "",
    priceInCents: 0,
    slug: "",
    gender: "Masculino",
    imageUrl: "",
    categoryId: 0,
    brandId: 0,
    stock: 1,
    fragranticaUrl: "",
  });

  const [{ data: brands }, { data: categories }] = useQueries({
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
      queryClient.invalidateQueries({ queryKey: ["admin_products"] });
      setForm({
        name: "",
        priceInCents: 0,
        slug: "",
        gender: "Masculino",
        imageUrl: "",
        categoryId: 0,
        brandId: 0,
        stock: 1,
        fragranticaUrl: "",
      });
      setIsFormOpen(false);
    },
  });

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    let finalUrl = form.imageUrl;

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const response = await uploadImage({
        formData,
        folder: "produto",
        customFilename: form.slug,
      });
      if (response.success && response.url) {
        finalUrl = response.url;
        setFile(null);
      }
    }
    mutate({ ...form, imageUrl: finalUrl });
  };

  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <DialogTrigger asChild>
        <Button className="md:w-auto w-10">
          <Plus className="h-3.5 w-3.5" />{" "}
          <span className="hidden md:inline">Novo Produto</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="md:min-w-7xl max-h-screen overflow-auto">
        <div>
          <DialogTitle>Novo Produto</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para criar um novo produto.
          </DialogDescription>
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
            <div className="space-y-1.5 md:w-32 w-full">
              <Label>Estoque*</Label>
              <Input
                type="number"
                min={0}
                value={form.stock}
                onChange={(e) =>
                  setForm({
                    ...form,
                    stock: Number(e.target.value),
                  })
                }
                required
              />
            </div>
            <div className="space-y-1.5 md:w-32 w-full">
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
            <div className="space-y-1.5 md:w-32 w-full">
              <Label>Promoção (R$)</Label>
              <CurrencyInput
                className="h-10 w-full min-w-0 border border-transparent border-b-input bg-transparent px-0 py-1 text-base transition-[color,border-color] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-b-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-b-destructive md:text-sm dark:aria-invalid:border-b-destructive/50"
                prefix="R$ "
                defaultValue={(form?.promoPriceInCents || 0) / 100}
                decimalScale={2}
                decimalSeparator=","
                decimalsLimit={2}
                onValueChange={(_, __, values) =>
                  setForm({
                    ...form,
                    promoPriceInCents: Number((values?.float || 0) * 100),
                  })
                }
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

            <div className="space-y-1.5 md:w-48 w-full">
              <Label>Categoria *</Label>
              <Select
                value={form.categoryId ? form.categoryId.toString() : ""}
                onValueChange={(v) =>
                  setForm({ ...form, categoryId: Number(v) })
                }
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
          </Column>

          <div className="space-y-1.5 flex-1">
            <Label>Marca *</Label>
            <Row>
              <Select
                value={form.brandId ? form.brandId.toString() : ""}
                onValueChange={(v) => setForm({ ...form, brandId: Number(v) })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecionar marca" />
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
          <div className="space-y-1.5 sm:col-span-2">
            <Label>URL da Imagem</Label>
            <ImageUploader
              setFile={setFile}
              preview={form?.imageUrl || ""}
              setPreview={(preview) => setForm({ ...form, imageUrl: preview })}
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
