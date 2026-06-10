'use server'

import { put } from '@vercel/blob';

export async function uploadImage({ formData, folder = '/', customFilename }: {formData: FormData, folder?: string, customFilename?: string}) {
  const file = formData.get('file') as File;
  
  if (!file) {
    throw new Error('Nenhum arquivo recebido.');
  }

  const baseFilename = customFilename || file.name || `pasted-image-${Date.now()}.png`;
  
  const cleanFolder = folder.replace(/^\/+|\/+$/g, '');
  
  const filename = cleanFolder ? `${cleanFolder}/${baseFilename}` : baseFilename;

  try {
    const blob = await put(filename, file, {
      access: 'public',
      allowOverwrite: true
    });

    return { success: true, url: blob.url };
  } catch (error) {
    console.error('Erro no upload para o Blob:', error);
    return { success: false, error: 'Falha ao realizar o upload' };
  }
}