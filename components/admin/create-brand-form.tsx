"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Column } from "../layout/column";
import { Row } from "../layout/row";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";
import {
  UpsertBrandRequest,
  getBrands,
  upsertBrand,
} from "@/server-functions/brands";
import { slugify } from "@/lib/formatters";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Plus } from "lucide-react";

const BrandForm = ({ isExtended = false }: { isExtended?: boolean }) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    imageUrl: "",
  });

  const { mutate } = useMutation({
    mutationFn: (form: UpsertBrandRequest) => upsertBrand(form),
    mutationKey: ["newBrand"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      setIsOpen(false);
    },
  });

  const onSubmitLocal = () => {
    mutate({
      name: form.name,
      imageUrl: form.imageUrl,
      slug: slugify(form.name),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {isExtended ? (
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nova Marca
          </Button>
        ) : (
          <Button variant="outline" size="icon">
            <Plus className="h-3.5 w-3.5" />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="md:min-w-3xl">
        <Column>
          <DialogTitle>Criar Marca</DialogTitle>
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
            <Input
              type="text"
              placeholder="Digite o link da imagem"
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              value={form.imageUrl}
            />
            {form?.imageUrl && (
              <div className="w-24 h-24 rounded-lg overflow-hidden border border-border mt-2">
                <img
                  src={form.imageUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          <Row className="border-t py-4 mt-4">
            <Button variant="outline" className="flex-1">
              Cancelar
            </Button>
            <Button
              variant="default"
              className="flex-1"
              onClick={onSubmitLocal}
              disabled={!form.name}
            >
              Salvar
            </Button>
          </Row>
        </Column>
      </DialogContent>
    </Dialog>
  );
};

export default BrandForm;
