'use client';

import { useState, ClipboardEvent, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { uploadImage } from '@/server-functions/upload';

export default function ImageUploader({ folder, customFilename }: {folder?: string, customFilename?: string}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  
  // Referência para o input de arquivo oculto
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lida com o Ctrl+V (Desktop)
  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const pastedFile = items[i].getAsFile();
        processFile(pastedFile);
      }
    }
  };

  // Lida com a seleção de arquivo via Galeria/Câmera (Mobile + Desktop Click)
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    processFile(selectedFile || null);
  };

  // Função centralizada para processar o arquivo e gerar o preview
  const processFile = (selectedFile: File | null) => {
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setUploadedUrl(null);
    }
  };

  // Aciona o clique no input oculto
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await uploadImage({ formData, folder, customFilename });
      
      if (response.success && response.url) {
        setUploadedUrl(response.url);
        alert('Upload concluído com sucesso!');
      } else {
        alert(response.error);
      }
    } catch (error) {
      alert('Ocorreu um erro no upload.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto p-4">
      {/* Input de arquivo oculto */}
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileSelect}
      />

      {/* Área Híbrida de Captura (Click + Paste) */}
      <div 
        onClick={triggerFileInput}
        onPaste={handlePaste}
        tabIndex={0}
        className="w-full h-48 border-2 border-dashed border-[#5f487b] rounded-lg flex flex-col items-center justify-center bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#5f487b] hover:bg-gray-100 transition-all cursor-pointer text-center p-4"
      >
        <p className="text-[#5f487b] font-medium mb-2">
          Toque para selecionar da galeria
        </p>
        <p className="text-gray-500 text-sm">
          Ou cole uma imagem com <kbd className="bg-gray-200 px-2 py-1 rounded text-gray-800 text-xs">Ctrl + V</kbd> no PC
        </p>
      </div>

      {preview && (
        <div className="w-full flex flex-col items-center gap-4">
          <div className="relative w-full h-64 border rounded-lg overflow-hidden shadow-sm">
            <Image 
              src={preview} 
              alt="Preview" 
              fill
              className="object-contain"
            />
          </div>

          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full py-3 px-4 bg-[#5f487b] hover:bg-[#4a3860] text-white font-semibold rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isUploading ? 'Enviando...' : 'Fazer Upload'}
          </button>
        </div>
      )}

      {uploadedUrl && (
        <div className="w-full p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg text-sm break-all">
          <strong>Imagem salva em:</strong>
          <br/>
          <a href={uploadedUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-green-600">
            {uploadedUrl}
          </a>
        </div>
      )}
    </div>
  );
}