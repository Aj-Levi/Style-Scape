"use client";

import React, { useState } from "react";
import Modal from "../Modal";
import { toast } from "react-toastify";
import ToastStyles from "@/styles/ToastStyles";
import { AddUserInterface } from "@/Interfaces";
import { useAddUserMutation } from "@/app/services/UserData";
import ValidateInput from "../auth/ValidateInput";
import ShowHidePassword from "../auth/ShowHidePassword";

const AddUser = () => {
  const [IsAdding, setIsAdding] = useState<boolean>(false);
  const [IsAddUserModalOpen, setIsAddUserModalOpen] = useState<boolean>(false);

  const [addUser] = useAddUserMutation();

  const handleAdd = async (formdata: FormData): Promise<void> => {
    setIsAdding(true);
    const firstname = formdata.get("firstname") as string;
    const lastname = formdata.get("lastname") as string;
    const email = formdata.get("email") as string;
    const password = formdata.get("password") as string;
    const role = formdata.get("role") as "user" | "admin";
    const user: AddUserInterface = {
      firstname,
      lastname,
      email,
      password,
      role,
    };

    try {
      const response = await addUser(user).unwrap();
      console.log(response);
      if (response.success) {
        toast.success("User Added successfully", ToastStyles);
      } else {
        toast.warn("This User Already Exists", ToastStyles);
      }
    } catch (err) {
      console.error("Could not add user", err);
      toast.error("Could not add user", ToastStyles);
    } finally {
      setIsAdding(false);
      setIsAddUserModalOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={(): void => setIsAddUserModalOpen(true)}
        className="btn btn-primary"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add User
      </button>
      <Modal
        IsOpen={IsAddUserModalOpen}
        setIsOpen={setIsAddUserModalOpen}
        size="xl"
        title="Add User"
      >
        <form action={handleAdd} className="space-y-4 mt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <label className="input input-bordered validator w-full">
              <svg
                className="h-[1em]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </g>
              </svg>
              <input
                type="text"
                placeholder="First Name"
                name="firstname"
                required
              />
            </label>

            <label className="input input-bordered validator w-full">
              <svg
                className="h-[1em]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </g>
              </svg>
              <input type="text" placeholder="Last Name" name="lastname" />
            </label>
          </div>

          <div className="form-control w-full">
            <select
              name="role"
              className="select select-bordered w-full"
              defaultValue="user"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <ValidateInput />
          <ShowHidePassword />

          <button
            type="submit"
            className="w-full btn btn-primary"
            disabled={IsAdding}
          >
            {IsAdding ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Adding User...
              </>
            ) : (
              "Add User"
            )}
          </button>
        </form>
      </Modal>
    </>
  );
};

export default AddUser;
