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
import { useUpdateUserMutation } from "@/app/services/UserData";

const ProfileImgUpload = ({ id, isAbsolute = true }: { id: string, isAbsolute: boolean }) => {
  const [progress, setProgress] = useState(0);
  const [IsUploading, setIsUploading] = useState<boolean>(false);
  const [IsUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const abortController = new AbortController();

  const [updateUser] = useUpdateUserMutation();

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
    setIsUploading(true);

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
      setIsUploading(false);
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
        folder: `/ProfileImages`,
        onProgress: (event) => {
          setProgress((event.loaded / event.total) * 100);
        },
        abortSignal: abortController.signal,
      });
      console.log("Upload response:", uploadResponse);
      const updatedUser = { image: uploadResponse.filePath as string };
      try {
        await updateUser({ id, updatedUser });
        toast.success("updated info successfully", ToastStyles);
      } catch (err) {
        toast.error("couldn't update the user info", ToastStyles);
        console.error("couldn't update the user info", err);
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
      setIsUploading(false);
      setIsUploadModalOpen(false);
    }
  };

  return (
    <>
      <FaImage
        onClick={(): void => {
          setIsUploadModalOpen(prev => !prev);
        }}
        className={`${isAbsolute?"absolute right-[42%] bottom-0":""} cursor-pointer text-primary`}
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
              disabled={IsUploading}
              className="btn btn-secondary"
            >
              Upload file
            </button>
          </div>
          {IsUploading && (
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

export default ProfileImgUpload;
