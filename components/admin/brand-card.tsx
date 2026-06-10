import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import { slugify } from "@/lib/formatters";
import {
  GetBrandResponse,
  UpsertBrandRequest,
  deleteBrand,
  upsertBrand,
} from "@/server-functions/brands";
import { uploadImage } from "@/server-functions/upload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { useState } from "react";
import { Column } from "../layout/column";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import ImageUploader from "../image-uploader";

export default function BrandAdminCard({ brand }: { brand: GetBrandResponse }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    name: brand.name,
    imageUrl: brand.imageUrl,
  });

  const { mutate } = useMutation({
    mutationFn: (form: UpsertBrandRequest) => upsertBrand(form, brand.id),
    mutationKey: ["newBrand", brand.id],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      setIsFormOpen(false);
    },
  });

  const { mutate: deleteB } = useMutation({
    mutationFn: (id: number) => deleteBrand(id),
    mutationKey: ["deleteBrand"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      setIsDeleteOpen(false);
      setIsFormOpen(false);
    },
  });

  const onSubmitLocal = async () => {
    let finalUrl = form.imageUrl;
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const response = await uploadImage({
        formData,
        folder: "marca",
        customFilename: slugify(form.name),
      });
      if (response.success && response.url) {
        finalUrl = response.url;
        setFile(null);
      }
    }
    mutate({
      name: form.name,
      imageUrl: finalUrl,
      slug: slugify(form.name),
    });
  };

  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <DialogTrigger asChild>
        <div className="group block border-accent border rounded-xl shadow-md">
          <div className="relative aspect-square rounded-t-xl overflow-hidden bg-secondary/50 mb-3">
            {brand.imageUrl ? (
              <img
                src={brand.imageUrl}
                alt={brand.name}
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
          </div>
          <div className="space-y-1 px-4 pb-4">
            <h3 className="text-sm font-medium leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {brand.name}
            </h3>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="md:min-w-3xl">
        <Column>
          <DialogTitle>Editar Marca</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para criar uma nova marca.
          </DialogDescription>
        </Column>
        <Column className="gap-4">
          <div className="w-full">
            <Label>Nome da Marca*</Label>
            <Input
              type="text"
              placeholder="Digite o nome da marca"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              value={form.name}
            />
          </div>
          <div className="w-full">
            <Label>Imagem da Marca</Label>
            <ImageUploader
              setFile={setFile}
              preview={form?.imageUrl || ""}
              setPreview={(preview) => setForm({ ...form, imageUrl: preview })}
            />
          </div>

          <Column className="md:flex-row border-t py-4 mt-4">
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="flex-1 py-3">
                  <Trash className="mr-2 h-4 w-4" /> Excluir Marca
                </Button>
              </DialogTrigger>
              <DialogContent className="md:min-w-3xl">
                <DialogTitle className="text-center">Excluir Marca</DialogTitle>
                <DialogTitle className="">
                  Tem certeza que deseja excluir essa marca?
                </DialogTitle>
                <DialogDescription>
                  Ao excluir essa marca, todos os perfumes vinculados a ela
                  também serão excluídos.
                </DialogDescription>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDeleteOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => deleteB(brand.id)}
                  >
                    Excluir
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="outline" className="flex-1  py-3">
              Cancelar
            </Button>
            <Button
              variant="default"
              className="flex-1  py-3"
              onClick={onSubmitLocal}
              disabled={!form.name}
            >
              Salvar
            </Button>
          </Column>
        </Column>
      </DialogContent>
    </Dialog>
  );
}
