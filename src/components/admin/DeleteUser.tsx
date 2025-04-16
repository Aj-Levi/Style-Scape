"use client";

import { useDeleteUserMutation } from "@/app/services/UserData";
import { UserInterface } from "@/Interfaces";
import ToastStyles from "@/styles/ToastStyles";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Modal from "../Modal";
import MutationStateHandler from "../MutationStateHandler";

const DeleteUser = ({filteredUsers, userid}: {filteredUsers: UserInterface[], userid: string}) => {

    const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);

    const [deleteUser,
        {
          isLoading: isLoadingDelete,
          isError: isErrorDelete,
          isSuccess: isSuccessDelete,
          error: errorDelete,
        },] = useDeleteUserMutation();

    const handleDeletion = async (id: string) => {
        try {
          await deleteUser(id);
        } catch (err) {
          toast.error("Could not delete the Account", ToastStyles);
          console.error("Could not delete the Account", err);
        } finally {
            setUserIdToDelete(null);
        }
      };
    
  return (
    <>
    <MutationStateHandler isError={isErrorDelete} isSuccess={isSuccessDelete} error={errorDelete} SuccessMessage="Account deleted successfully" />
      <button
        onClick={(): void => setUserIdToDelete(userid)}
        className="btn btn-md btn-error"
      >
        Delete
      </button>
      {/* Delete confirmation modal mapped for each user */}
      {filteredUsers?.map((user: UserInterface) => (
        <Modal
          key={`delete-modal-${user._id}`}
          IsOpen={userIdToDelete === String(user._id)}
          setIsOpen={() => setUserIdToDelete(null)}
          title="Delete User"
        >
          <div className="py-4">
            <div className="flex items-center justify-center mb-4 text-error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
            <p className="text-lg text-center mb-2">
              Are you sure you want to delete user:{" "}
              <span className="font-bold">
                {user.firstname} {user.lastname}
              </span>
              ?
            </p>
            <p className="text-center text-gray-500 mb-6">
              This action cannot be undone.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setUserIdToDelete(null)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await handleDeletion(String(user._id));
                  setUserIdToDelete(null);
                }}
                className="btn btn-error"
                disabled={isLoadingDelete}
              >
                {isLoadingDelete ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </Modal>
      ))}
    </>
  );
};

export default DeleteUser;
