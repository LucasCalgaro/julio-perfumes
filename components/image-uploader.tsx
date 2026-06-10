'use client';

import { useState, ClipboardEvent } from 'react';

import Image from 'next/image';
import { uploadImage } from '@/server-functions/upload';

export default function PasteImageUploader({ customFilename, folder }: { customFilename?: string, folder?: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  // Captura o evento Ctrl+V
  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData?.items;
    
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const pastedFile = items[i].getAsFile();
        
        if (pastedFile) {
          setFile(pastedFile);
          setPreview(URL.createObjectURL(pastedFile));
          setUploadedUrl(null); // Reseta a URL se colar uma nova imagem
        }
      }
    }
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
      <div 
        onPaste={handlePaste}
        tabIndex={0}
        className="w-full h-48 border-2 border-dashed border-[#5f487b] rounded-lg flex flex-col items-center justify-center bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#5f487b] focus:bg-white transition-all cursor-text text-center p-4"
      >
        <p className="text-[#5f487b] font-medium">
          Clique aqui e pressione <kbd className="bg-gray-200 px-2 py-1 rounded text-gray-800 text-sm">Ctrl + V</kbd> para colar uma imagem
        </p>
      </div>

      {preview && (
        <div className="w-full flex flex-col items-center gap-4">
          <div className="relative w-full h-64 border rounded-lg overflow-hidden shadow-sm">
            <Image 
              src={preview} 
              alt="Preview da imagem colada" 
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
          <strong>Imagem disponível em:</strong>
          <br/>
          <a href={uploadedUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-green-600">
            {uploadedUrl}
          </a>
        </div>
      )}
    </div>
  );
}