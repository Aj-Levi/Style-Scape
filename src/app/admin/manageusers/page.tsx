"use client";

import {
  useAddUserMutation,
  useDeleteUserMutation,
  useGetAllUsersQuery,
  useUpdateUserMutation,
} from "@/app/services/UserData";
import ShowHidePassword from "@/components/auth/ShowHidePassword";
import ThemeToggleLogin from "@/components/auth/ThemeToggleLogin";
import ValidateInput from "@/components/auth/ValidateInput";
import Modal from "@/components/Modal";
import {
  AddUserInterface,
  UpdatedUserInterface,
  UserInterface,
} from "@/Interfaces";
import ToastStyles from "@/styles/ToastStyles";
import { useRouter } from "next/navigation";
import React, { ReactNode, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const ManageUsers = () => {
  const [SearchQuery, setSearchQuery] = useState<string>("");
  const [OnlyUser, setOnlyUser] = useState<boolean>(false);
  const [OnlyAdmin, setOnlyAdmin] = useState<boolean>(false);
  const [IsAddUserModalOpen, setIsAddUserModalOpen] = useState<boolean>(false);
  const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [IsAdding, setIsAdding] = useState<boolean>(false);
  const [IsUpdating, setIsUpdating] = useState<boolean>(false);

  const { data, isLoading } = useGetAllUsersQuery();
  const [addUser] = useAddUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const router = useRouter();

  if (isLoading) {
    return (
      <div className="h-screen grid place-content-center bg-base-300">
        <span className="loading loading-spinner text-accent loading-xl"></span>
      </div>
    );
  }

  const handleDeletion = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteUser(id);
      toast.success("Account deleted successfully", ToastStyles);
    } catch (err) {
      toast.error("Could not delete the Account", ToastStyles);
      console.error("Could not delete the Account", err);
    } finally {
      setIsDeleting(false);
    }
  };

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
      if(response.success) {
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

  const handleUpdate = async (user: UserInterface) => {
    setIsUpdating(true);
    let updatedUser: UpdatedUserInterface =
      user.role === "admin"
        ? {
            role: "user",
          }
        : {
            role: "admin",
          };
    try {
      await updateUser({ id: String(user._id), updatedUser });
      toast.success("User info Updated Successfully", ToastStyles);
    } catch (err) {
      console.error("Could not update user", err);
      toast.error("Could not update user", ToastStyles);
    } finally {
      setIsUpdating(false);
    }
  };

  let filteredUsers: UserInterface[] | undefined = SearchQuery
    ? data?.filter(
        (user: UserInterface) =>
          user.firstname.toLowerCase().includes(SearchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(SearchQuery.toLowerCase())
      )
    : data;

  if (OnlyUser) {
    filteredUsers = filteredUsers?.filter(
      (user: UserInterface) => user.role === "user"
    );
  }

  if (OnlyAdmin) {
    filteredUsers = filteredUsers?.filter(
      (user: UserInterface) => user.role === "admin"
    );
  }

  return (
    <div className="min-h-screen bg-base-100 p-6">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <button onClick={():void => router.back()} className="btn btn-outline">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </button>
        <ThemeToggleLogin />
      </div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6 underline decoration-3">Manage Users</h1>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                name="search"
                id="search"
                placeholder="Search user by name or email"
                value={SearchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                  setSearchQuery(e.target.value)
                }
                className="input input-bordered w-full pl-10 pr-4"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
          <button
            onClick={(): void => setIsAddUserModalOpen((prev) => !prev)}
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
        </div>

        <div className="flex flex-wrap gap-4 mb-4">
          <div className="form-control">
            <label className="cursor-pointer label gap-2">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                name="onlyuser"
                id="onlyuser"
                onClick={(): void => setOnlyUser((prev) => !prev)}
              />
              <span className="label-text">Only Users</span>
            </label>
          </div>
          <div className="form-control">
            <label className="cursor-pointer label gap-2">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                name="onlyadmin"
                id="onlyadmin"
                onClick={(): void => setOnlyAdmin((prev) => !prev)}
              />
              <span className="label-text">Only Admins</span>
            </label>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-base-300 text-base-content">
              <th className="text-center">Name</th>
              <th className="text-center">Email</th>
              <th className="text-center">Role</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers && filteredUsers.length > 0 ? (
              filteredUsers.map(
                (user: UserInterface): ReactNode => (
                  <tr key={String(user._id)} className="hover">
                    <td className="text-center">
                      {user.firstname} {user.lastname}
                    </td>
                    <td className="text-center">{user.email}</td>
                    <td className="text-center">
                      <span
                        className={`badge ${
                          user.role === "admin"
                            ? "badge-secondary"
                            : "badge-primary"
                        } px-3 py-2`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={async () => {
                            await handleUpdate(user);
                          }}
                          className="btn btn-sm btn-secondary"
                          disabled={IsUpdating}
                        >
                          {IsUpdating ? (
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
                        <button
                          onClick={(): void =>
                            setUserIdToDelete(String(user._id))
                          }
                          className="btn btn-sm btn-error"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-6">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add user modal */}
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
                disabled={isDeleting}
              >
                {isDeleting ? (
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
    </div>
  );
};

export default ManageUsers;
