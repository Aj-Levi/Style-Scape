"use client";

import ToastStyles from "@/styles/ToastStyles";
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import Modal from "@/components/Modal";
import { FaImage, FaTrash } from "react-icons/fa";
import { useUpdateProductMutation } from "@/app/services/ProductData";
import { UpdatedProductInterface } from "@/Interfaces";
import { Image } from "@imagekit/next";
import MutationStateHandler from "../MutationStateHandler";

interface ProductImgUploadProps {
  categoryId: string;
  productId: string;
  currentImages: string[];
}

const ProductImgUpload = ({
  categoryId,
  productId,
  currentImages,
}: ProductImgUploadProps) => {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isManageImagesModalOpen, setIsManageImagesModalOpen] =
    useState<boolean>(false);
  const [images, setImages] = useState<string[]>(currentImages);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const abortController = new AbortController();

  const [
    updateProduct,
    {
      isLoading: isLoadingUpdate,
      isError: isErrorUpdate,
      error: errorUpdate,
      isSuccess: isSuccessUpdate,
    },
  ] = useUpdateProductMutation();

  const authenticator = async () => {
    try {
      const response = await fetch("/api/upload-auth");
      if (!response.ok) {
        throw new Error("Failed to get authentication parameters");
      }

      return await response.json();
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
  };

  const handleUpload = async () => {
    if (!fileInputRef.current?.files?.length) {
      toast.warn("Please select a file to upload", ToastStyles);
      return;
    }

    const file = fileInputRef.current.files[0];
    setIsUploading(true);
    setProgress(0);

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setIsUploading(false);
      toast.warn("Only images allowed", ToastStyles);
      return;
    }

    let authParams;
    try {
      authParams = await authenticator();
    } catch (authError) {
      console.error("Authentication error:", authError);
      toast.error("Error while uploading", ToastStyles);
      return;
    }
    const { signature, expire, token, publicKey } = authParams;

    try {
      const uploadResponse = await upload({
        expire,
        token,
        signature,
        publicKey,
        file,
        useUniqueFileName: true,
        fileName: file.name,
        folder: `/Products-images/${categoryId}`,
        onProgress: (event) => {
          setProgress((event.loaded / event.total) * 100);
        },
        abortSignal: abortController.signal,
      });

      const newImageUrl = uploadResponse.filePath as string;
      const updatedImages = [...images, newImageUrl];
      setImages(updatedImages);

      const updatedProduct: UpdatedProductInterface = {
        images: updatedImages,
      };

      try {
        await updateProduct({
          categoryId,
          productId,
          updatedProduct,
        });
      } catch (err) {
        console.error("Error updating product images:", err);
        toast.error("Couldn't update the product images", ToastStyles);
      }
    } catch (error) {
      if (error instanceof ImageKitAbortError) {
        console.error("Upload aborted:", error.reason);
      } else if (error instanceof ImageKitInvalidRequestError) {
        console.error("Invalid request:", error.message);
      } else if (error instanceof ImageKitUploadNetworkError) {
        console.error("Network error:", error.message);
      } else if (error instanceof ImageKitServerError) {
        console.error("Server error:", error.message);
      } else {
        console.error("Upload error:", error);
      }

      toast.error("Failed to upload image", ToastStyles);
    } finally {
      setIsUploading(false);
      setIsUploadModalOpen(false);
    }
  };

  const handleDeleteImage = async (imageUrl: string) => {
    try {
      const updatedImages = images.filter((img) => img !== imageUrl);
      setImages(updatedImages);

      const updatedProduct: UpdatedProductInterface = {
        images: updatedImages,
      };

      await updateProduct({
        categoryId,
        productId,
        updatedProduct,
      });
    } catch (err) {
      console.error("Error removing image:", err);
      toast.error("Couldn't remove the image", ToastStyles);
    }
  };

  return (
    <>
      <MutationStateHandler
        isError={isErrorUpdate}
        isSuccess={isSuccessUpdate}
        error={errorUpdate}
        SuccessMessage="Product Images Updated Successfully"
      />
      <FaImage
        onClick={() => {
          if (images.length > 0) {
            setIsManageImagesModalOpen(true);
          } else {
            setIsUploadModalOpen(true);
          }
        }}
        className="cursor-pointer text-primary"
        size={20}
        title="Manage product images"
      />

      {/* Upload Modal */}
      <Modal
        title="Upload Product Image"
        IsOpen={isUploadModalOpen}
        setIsOpen={setIsUploadModalOpen}
      >
        <div className="w-full space-y-2">
          <div className="w-full flex gap-x-4 p-2">
            <input
              type="file"
              ref={fileInputRef}
              className="file-input file-input-primary"
            />
            <button
              onClick={handleUpload}
              disabled={isUploading || isLoadingUpdate}
              className="btn btn-secondary"
            >
              Upload file
            </button>
          </div>
          {(isUploading || isLoadingUpdate) && (
            <div className="w-full flex gap-x-4 items-center">
              <span className="font-semibold">Upload progress:</span>
              <progress
                className="progress progress-primary w-full"
                value={progress}
                max={100}
              ></progress>
              <span className="text-sm">{Math.round(progress)}%</span>
            </div>
          )}
        </div>
      </Modal>

      {/* Manage Images Modal */}
      <Modal
        title="Manage Product Images"
        IsOpen={isManageImagesModalOpen}
        setIsOpen={setIsManageImagesModalOpen}
        size="lg"
      >
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {images.length > 0 ? (
              images.map((image, index) => (
                <div
                  key={index}
                  className="relative group border rounded-lg overflow-hidden"
                >
                  <Image
                    src={image}
                    alt={`Product image ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button
                      onClick={() => handleDeleteImage(image)}
                      className="btn btn-error btn-sm"
                    >
                      <FaTrash className="mr-1" /> Remove
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p>No images uploaded yet</p>
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => {
                setIsManageImagesModalOpen(false);
                setIsUploadModalOpen(true);
              }}
              className="btn btn-primary"
            >
              Add New Image
            </button>
            <button
              onClick={() => setIsManageImagesModalOpen(false)}
              className="btn btn-outline"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProductImgUpload;
