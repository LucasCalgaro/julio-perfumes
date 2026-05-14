import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";

export async function Form() {
  async function uploadImage(formData: FormData) {
    'use server';
    const imageFile = formData.get('image') as File;
    const blob = await put(imageFile.name, imageFile, {
      access: 'public',
      addRandomSuffix: true,
    });
    revalidatePath('/');
    return blob;
  }
  
  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const result = await uploadImage(formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="image">Image</label>
      <input
        type="file"
        id="image"
        name="image"
        accept="image/jpeg, image/png, image/webp"
        required
      />
      <button type="submit">Upload</button>
    </form>
  );
}