import { useUpdateUserMutation } from "@/app/services/UserData";
import { UpdatedUserInterface, UserInterface } from "@/Interfaces";
import ToastStyles from "@/styles/ToastStyles";
import React from "react";
import { toast } from "react-toastify";
import MutationStateHandler from "../MutationStateHandler";

const UpdateUserRole = ({user}: {user: UserInterface}) => {
  const [
    updateUser,
    {
      isLoading: isLoadingUpdate,
      isError: isErrorUpdate,
      isSuccess: isSuccessUpdate,
      error: errorUpdate,
    },
  ] = useUpdateUserMutation();

  const handleUpdate = async (user: UserInterface) => {
    const updatedUser: UpdatedUserInterface =
      user.role === "admin"
        ? {
            role: "user",
          }
        : {
            role: "admin",
          };
    try {
      await updateUser({ id: String(user._id), updatedUser });
    } catch (err) {
      console.error("Could not update user", err);
      toast.error("Could not update user", ToastStyles);
    }
  };

  return (
    <>
    <MutationStateHandler isError={isErrorUpdate} isSuccess={isSuccessUpdate} error={errorUpdate} SuccessMessage="User info Updated Successfully" />
      <button
        onClick={async () => {
          await handleUpdate(user);
        }}
        className="btn btn-md btn-secondary"
        disabled={isLoadingUpdate}
      >
        {isLoadingUpdate ? (
          <>
            <span className="loading loading-spinner loading-xs"></span>
            Updating...
          </>
        ) : user.role === "admin" ? (
          "Make User"
        ) : (
          "Make Admin"
        )}
      </button>
    </>
  );
};

export default UpdateUserRole;
