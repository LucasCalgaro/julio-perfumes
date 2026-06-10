"use client";

import Image from "next/image";
import { ChangeEvent, ClipboardEvent } from "react";
import { Input } from "./ui/input";

interface ImageUploaderProps {
  setFile: (file: File | null) => void;
  preview: string;
  setPreview: (preview: string) => void;
}

export default function ImageUploader({
  setFile,
  preview,
  setPreview,
}: ImageUploaderProps) {
  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPreview(e.target.value);
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        e.preventDefault();

        const pastedFile = items[i].getAsFile();
        if (pastedFile) {
          setFile(pastedFile);
          setPreview(URL.createObjectURL(pastedFile));
        }
        break;
      }
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setPreview("");
  };

  return (
    <>
      {preview && (
        <div className="relative w-32 h-32 border rounded-lg overflow-hidden shadow-sm group">
          <Image src={preview} alt="Preview" fill className="object-cover" />
          <button
            onClick={handleRemoveImage}
            className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            title="Remover imagem"
          >
            ✕
          </button>
        </div>
      )}

      <Input
        type="text"
        placeholder="Digite ou cole uma imagem..."
        value={preview}
        onChange={handleTextChange}
        onPaste={handlePaste}
      />
    </>
  );
}
