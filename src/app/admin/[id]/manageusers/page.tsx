"use client";

import {
  useAddUserMutation,
  useDeleteUserMutation,
  useGetAllUsersQuery,
} from "@/app/services/UserData";
import ShowHidePassword from "@/components/auth/ShowHidePassword";
import ValidateInput from "@/components/auth/ValidateInput";
import Modal from "@/components/Modal";
import { UpdatedUserInterface, UserInterface } from "@/Interfaces";
import ToastStyles from "@/styles/ToastStyles";
import { signOut } from "next-auth/react";
import React, { ReactNode, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

interface AddUserInterface extends UpdatedUserInterface {
  email: string;
}

const ManageUsers = ({ params }: { params: Promise<{ id: string }> }) => {
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;

  const [SearchQuery, setSearchQuery] = useState<string>("");
  const [OnlyUser, setOnlyUser] = useState<boolean>(false);
  const [OnlyAdmin, setOnlyAdmin] = useState<boolean>(false);
  const [IsAddUserModalOpen, setIsAddUserModalOpen] = useState<boolean>(false);
  const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);

  const { data, isLoading, isError } = useGetAllUsersQuery();
  const [
    addUser,
    { data: AddUserData, isLoading: AddUserisLoading, isError: AddUserisError },
  ] = useAddUserMutation();
  const [
    deleteUser,
    {
      data: DeleteUserData,
      isLoading: DeleteUserisLoading,
      isError: DeleteUserisError,
    },
  ] = useDeleteUserMutation();

  if (isLoading || AddUserisLoading || DeleteUserisLoading) {
    return (
      <div className="h-full grid place-content-center bg-base-300 col-span-1 md:col-span-3">
        <span className="loading loading-spinner text-accent loading-xl"></span>
      </div>
    );
  }

  const handleDeletion = async (id: string) => {
    try {
      await deleteUser(id);
      toast.success("User deleted successfully", ToastStyles);
    } catch (err) {
      toast.error("Could not delete the user", ToastStyles);
      console.error("Could not delete the user", err);
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
    <div className="min-h-screen bg-base-100">
      <ToastContainer />
      <div>
        <input
          type="text"
          name="search"
          id="search"
          placeholder="search user"
          value={SearchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
            setSearchQuery(e.target.value)
          }
        />
        <button
          onClick={(): void => setIsAddUserModalOpen((prev) => !prev)}
          className="btn btn-primary"
        >
          Add user
        </button>
        <Modal
          IsOpen={IsAddUserModalOpen}
          setIsOpen={setIsAddUserModalOpen}
          size="xl"
          title="Add User"
        >
          <form
            action={async (formdata: FormData): Promise<void> => {
              const firstname = formdata.get("firstname") as string;
              const lastname = formdata.get("lastname") as string;
              const email = formdata.get("email") as string;
              const password = formdata.get("password") as string;
              const user: AddUserInterface = {
                firstname,
                lastname,
                email,
                password,
              };
              await addUser(user);

              // if (AddUserData!.success) {
              //   toast.success(AddUserData!.message, ToastStyles);
              // } else {
              //   toast.warn(AddUserData!.message, ToastStyles);
              // }

              setIsAddUserModalOpen(false);
            }}
            className="space-y-4 mt-6"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <label className="input validator w-full">
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

              <label className="input validator w-full">
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

            <ValidateInput />
            <ShowHidePassword />

            <button type="submit" className="w-full btn btn-primary">
              Sign Up
            </button>
          </form>
        </Modal>
      </div>
      <div>
        <input
          type="checkbox"
          name="onlyuser"
          id="onlyuser"
          onClick={(): void => setOnlyUser((prev) => !prev)}
        />
        <label htmlFor="onlyuser">Only User</label>
        <input
          type="checkbox"
          name="onlyadmin"
          id="onlyadmin"
          onClick={(): void => setOnlyAdmin((prev) => !prev)}
        />
        <label htmlFor="onlyadmin">Only Admin</label>
      </div>
      <div>
        {filteredUsers ? (
          filteredUsers.map(
            (user: UserInterface, index: number): ReactNode => (
              <div key={user._id}>
                <p> {user._id} </p>
                <p>
                  {" "}
                  {user.firstname} {user.lastname}{" "}
                </p>
                <p> {user.email} </p>
                <p> {user.role} </p>
                <button
                  onClick={(): void => setUserIdToDelete(user._id)}
                  className="btn btn-error"
                >
                  Delete user
                </button>
                <Modal
                  IsOpen={userIdToDelete === user._id}
                  setIsOpen={() => setUserIdToDelete(null)}
                  title="Delete User"
                >
                  <div>
                    Are you sure you want to delete user: {user.firstname}
                  </div>
                  <div>this action can&apos;t be undone</div>

                  <button
                    onClick={async () => {
                      await handleDeletion(user._id);
                      setUserIdToDelete(null);
                    }}
                    className="btn btn-error"
                  >
                    Delete
                  </button>
                </Modal>
              </div>
            )
          )
        ) : (
          <div>No users found</div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
