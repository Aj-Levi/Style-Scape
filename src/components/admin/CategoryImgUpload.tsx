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
import { FaImage } from "react-icons/fa";
import { useUpdateCategoryMutation } from "@/app/services/CategoryData";
import MutationStateHandler from "../MutationStateHandler";

const CategoryImgUpload = ({ id }: { id: string }) => {
  const [isUploading, setisUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState(0);
  const [IsUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const abortController = new AbortController();

  const [
    updateCategory,
    {
      isLoading: isLoadingUpdate,
      isError: isErrorUpdate,
      error: errorUpdate,
      isSuccess: isSuccessUpdate,
    },
  ] = useUpdateCategoryMutation();

  const authenticator = async () => {
    try {
      const response = await fetch("/api/upload-auth");
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`
        );
      }

      const data = await response.json();
      const { signature, expire, token, publicKey } = data;
      return { signature, expire, token, publicKey };
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error("error while uploading", ToastStyles);
      throw new Error("Authentication request failed");
    }
  };

  const handleUpload = async () => {
    setisUploading(true);
    const fileInput = fileInputRef.current;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      toast.warn("please select at least one file", ToastStyles);
      return;
    }

    const file = fileInput.files[0] as File;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
      "image/jpg",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.warn("only images allowed", ToastStyles);
      return;
    }

    let authParams;

    try {
      authParams = await authenticator();
    } catch (authError) {
      console.error("Failed to authenticate for upload:", authError);
      toast.error("error while uploading", ToastStyles);
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
        folder: `/Categories-banner-images`,
        onProgress: (event) => {
          setProgress((event.loaded / event.total) * 100);
        },
        abortSignal: abortController.signal,
      });
      const updatedCategory = { image: uploadResponse.filePath as string };
      try {
        await updateCategory({ id, updatedCategory });
      } catch (err) {
        console.error("Failed to update category:", err);
        toast.error("couldn't update the category info", ToastStyles);
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
    } finally {
      setisUploading(false);
      setIsUploadModalOpen(false);
    }
  };

  return (
    <>
      <MutationStateHandler
        isError={isErrorUpdate}
        isSuccess={isSuccessUpdate}
        error={errorUpdate}
        SuccessMessage="Image Uploaded Successfully"
      />
      <FaImage
        onClick={(): void => {
          setIsUploadModalOpen(true);
        }}
        className="cursor-pointer text-primary"
        size={20}
      />
      <Modal
        title="Upload Image"
        IsOpen={IsUploadModalOpen}
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
    </>
  );
};

export default CategoryImgUpload;
