import PasteImageUploader from "@/components/image-uploader";

const ImageUploadPage = () => {
    return ( <PasteImageUploader folder="products" customFilename={'pasted-image'} /> );
}
 
export default ImageUploadPage;