"use client";

import { useUpdateUserMutation } from "@/app/services/UserData";
import ToastStyles from "@/styles/ToastStyles";
import React, { useState } from "react";
import { toast } from "react-toastify";

const PasswordChange = ({ id }: { id: string }) => {
  const [UpdatedPass, setUpdatedPass] = useState<string>("");
  const [PassError, setPassError] = useState<boolean>(true);
  const [ConfirmPass, setConfirmPass] = useState<string>("");
  const [PasswordsMatch, setPasswordsMatch] = useState<boolean>(true);
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
    <div className="bg-base-100 p-5 rounded-lg shadow-sm">
      <h3 className="font-medium text-lg mb-4 text-primary">Change Password</h3>

      <form action={handlePasswordChange} className="space-y-4">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">New Password</span>
          </label>
          <input
            type="text"
            name="updatedpassword"
            value={UpdatedPass}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
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
  );
};

export default PasswordChange;
