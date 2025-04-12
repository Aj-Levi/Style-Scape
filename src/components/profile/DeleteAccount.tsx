import { useDeleteUserMutation } from "@/app/services/UserData";
import ToastStyles from "@/styles/ToastStyles";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Modal from "../Modal";

const DeleteAccount = ({ id }: { id: string }) => {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const [deleteUser, { isLoading: isLoadingDelete }] = useDeleteUserMutation();

  const handleDeletion = async () => {
    setIsDeleting(true);
    try {
      await deleteUser(id);
      toast.success("Account deleted successfully", ToastStyles);
      toast.info("Redirecting please wait", ToastStyles);
      setIsDeleteModalOpen(false);

      setTimeout(async () => {
        await signOut({ redirect: false });
        router.replace("/home");
      }, 2000);
    } catch (err) {
      toast.error("Could not delete the Account", ToastStyles);
      console.error("Could not delete the Account", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-base-100 p-5 rounded-lg shadow-sm border-l-4 border-error">
      <h3 className="font-medium text-lg mb-4 text-error">Danger Zone</h3>

      <div className="form-control">
        <p className="mb-3 text-sm opacity-75">
          Permanently delete your account and all associated data. This action
          cannot be undone.
        </p>
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          disabled={isDeleting || isLoadingDelete}
          className="btn btn-error btn-outline hover:btn-error w-full sm:w-48"
        >
          {isDeleting || isLoadingDelete ? (
            <>
              <span className="loading loading-spinner loading-xs"></span>
              Deleting...
            </>
          ) : (
            "Delete Account"
          )}
        </button>
        <Modal
          IsOpen={isDeleteModalOpen}
          setIsOpen={setIsDeleteModalOpen}
          title="Confirm Account Deletion"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-sm">
              Are you sure you want to delete your account? This action cannot
              be undone and all your data will be permanently lost.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-end mt-4">
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>

              <button
                className="btn btn-error btn-sm"
                onClick={handleDeletion}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Deleting...
                  </>
                ) : (
                  "Delete Account"
                )}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default DeleteAccount;
