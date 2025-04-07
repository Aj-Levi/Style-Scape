"use client";

import {
  useDeleteUserMutation,
  useUpdateUserMutation,
} from "@/app/services/UserData";
import { signOut } from "next-auth/react";
import ToastStyles from "@/styles/ToastStyles";
import bcrypt from "bcryptjs";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

const UserSettings = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();

  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;

  const [UpdatedPass, setUpdatedPass] = useState<string>("");
  const [PassError, setPassError] = useState<boolean>(false);

  const [
    deleteUser,
    { isLoading: isLoadingDelete },
  ] = useDeleteUserMutation();
  const [
    updateUser,
    { isLoading: isLoadingUpdate },
  ] = useUpdateUserMutation();

  if (isLoadingDelete || isLoadingUpdate) {
    return (
      <div className="h-full grid place-content-center bg-base-300 col-span-1 md:col-span-3">
        <span className="loading loading-spinner text-accent loading-xl"></span>
      </div>
    );
  }

  const ValidatePassword = (value: string): void => {
    console.log(value.length);
    if (value && value.length >= 1 && value.length < 6) {
      setPassError(true);
    } else {
      setPassError(false);
    }
  };

  const handleDeletion = async () => {
    try {
      await deleteUser(id);
      toast.success("User deleted successfully", ToastStyles);
      toast.info("Redirecting please wait", ToastStyles);

      setTimeout(async () => {
        await signOut({ redirect: false });
        router.replace("/home");
      }, 2000);
    } catch (err) {
      toast.error("Could not delete the user", ToastStyles);
      console.error("Could not delete the user", err);
    }
  };

  const handlePasswordChange = async (formdata: FormData): Promise<void> => {
    const updatedpassword = formdata.get("updatedpassword") as string;

    const salt = await bcrypt.genSalt(12);
    const hashedpassword = await bcrypt.hash(updatedpassword, salt);

    try {
      const updatedUser = { password: hashedpassword };
      await updateUser({ id, updatedUser });
      toast.success("password updated successfully", ToastStyles);
      setUpdatedPass("");
    } catch (err) {
      toast.error("Could not update the password", ToastStyles);
      console.error("Could not delete the user", err);
    }
  };

  return (
    <div className="col-span-1 md:col-span-3">
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
                      ValidatePassword(value);
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
                <div className="form-control mt-4">
                  <button
                    type="submit"
                    disabled={PassError}
                    className="btn btn-primary w-full sm:w-auto"
                  >
                    Change Password
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
                  onClick={handleDeletion}
                  className="btn btn-error btn-outline hover:btn-error w-full sm:w-48"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
