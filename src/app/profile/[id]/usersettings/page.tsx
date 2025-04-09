"use client";

import {
  useDeleteUserMutation,
  useUpdateUserMutation,
} from "@/app/services/UserData";
import { signOut } from "next-auth/react";
import ToastStyles from "@/styles/ToastStyles";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Modal from "@/components/Modal";

const UserSettings = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();

  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;

  const [UpdatedPass, setUpdatedPass] = useState<string>("");
  const [PassError, setPassError] = useState<boolean>(true);
  const [ConfirmPass, setConfirmPass] = useState<string>("");
  const [PasswordsMatch, setPasswordsMatch] = useState<boolean>(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const [deleteUser, { isLoading: isLoadingDelete }] = useDeleteUserMutation();
  const [updateUser, { isLoading: isLoadingUpdate }] = useUpdateUserMutation();

  const ValidatePassword = (update: string, confirm: string): void => {
    if (update && update.length >= 1 && update.length < 6) {
      setPassError(true);
    } else {
      setPassError(false);
    }

    if (update && confirm && update !== confirm) {
      setPasswordsMatch(false);
    } else {
      setPasswordsMatch(true);
    }
  };

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

  const handlePasswordChange = async (formdata: FormData): Promise<void> => {
    const updatedpassword = formdata.get("updatedpassword") as string;
    const confirmpassword = formdata.get("confirmpassword") as string;

    if (updatedpassword !== confirmpassword) {
      toast.warn("Passwords do not match", ToastStyles);
      return;
    }

    try {
      const updatedUser = { password: updatedpassword };
      await updateUser({ id, updatedUser });
      toast.success("Password updated successfully", ToastStyles);
      setUpdatedPass("");
      setConfirmPass("");
    } catch (err) {
      toast.error("Could not update the password", ToastStyles);
      console.error("Could not update the password", err);
    }
  };

  return (
    <div className="col-span-1 md:col-span-3">
      <ToastContainer />
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold mb-8 pb-2 border-b border-base-300">
            Account Settings
          </h2>

          <div className="space-y-8">
            {/* Password Change Section */}
            <div className="bg-base-100 p-5 rounded-lg shadow-sm">
              <h3 className="font-medium text-lg mb-4 text-primary">
                Change Password
              </h3>

              <form action={handlePasswordChange} className="space-y-4">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">New Password</span>
                  </label>
                  <input
                    type="text"
                    name="updatedpassword"
                    value={UpdatedPass}
                    onChange={(
                      e: React.ChangeEvent<HTMLInputElement>
                    ): void => {
                      const value = e.target.value;
                      setUpdatedPass(value);
                      ValidatePassword(value, ConfirmPass);
                    }}
                    placeholder="Enter updated password"
                    className={`input input-bordered w-full ${
                      PassError ? "input-error" : ""
                    }`}
                  />
                  {PassError && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        Password must be at least 6 characters long
                      </span>
                    </label>
                  )}
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Confirm Password</span>
                  </label>
                  <input
                    type="password"
                    name="confirmpassword"
                    value={ConfirmPass}
                    onChange={(
                      e: React.ChangeEvent<HTMLInputElement>
                    ): void => {
                      const value = e.target.value;
                      setConfirmPass(value);
                      ValidatePassword(UpdatedPass, value);
                    }}
                    placeholder="Confirm your password"
                    className={`input input-bordered w-full ${
                      !PasswordsMatch ? "input-error" : ""
                    }`}
                  />
                  {!PasswordsMatch && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        Passwords do not match
                      </span>
                    </label>
                  )}
                </div>

                <div className="form-control mt-4">
                  <button
                    type="submit"
                    disabled={
                      (PassError && UpdatedPass.length > 0) ||
                      !PasswordsMatch ||
                      isLoadingUpdate
                    }
                    className="btn btn-primary w-full sm:w-auto"
                  >
                    {isLoadingUpdate ? (
                      <>
                        <span className="loading loading-spinner loading-xs"></span>
                        Updating...
                      </>
                    ) : (
                      "Change Password"
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Delete Account Section */}
            <div className="bg-base-100 p-5 rounded-lg shadow-sm border-l-4 border-error">
              <h3 className="font-medium text-lg mb-4 text-error">
                Danger Zone
              </h3>

              <div className="form-control">
                <p className="mb-3 text-sm opacity-75">
                  Permanently delete your account and all associated data. This
                  action cannot be undone.
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
                      Are you sure you want to delete your account? This action
                      cannot be undone and all your data will be permanently
                      lost.
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
