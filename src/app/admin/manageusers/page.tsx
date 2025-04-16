"use client";

import {
  useGetAllUsersQuery,
} from "@/app/services/UserData";
import AddUser from "@/components/admin/AddUser";
import SearchBar from "@/components/SearchBar";
import ThemeToggleFixed from "@/components/auth/ThemeToggleFixed";
import { UserInterface } from "@/Interfaces";
import { useRouter } from "next/navigation";
import React, { ReactNode, useState } from "react";
import { Image } from "@imagekit/next";
import ProfileImgUpload from "@/components/profile/ProfileImgUpload";
import UpdateUserRole from "@/components/admin/UpdateUserRole";
import DeleteUser from "@/components/admin/DeleteUser";
import QueryStateHandler from "@/components/QueryStateHandler";

const ManageUsers = () => {
  const [SearchQuery, setSearchQuery] = useState<string>("");
  const [OnlyUser, setOnlyUser] = useState<boolean>(false);
  const [OnlyAdmin, setOnlyAdmin] = useState<boolean>(false);

  const { data, isLoading, isError, error } = useGetAllUsersQuery();

  const router = useRouter();

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
    <>
    <QueryStateHandler isError={isError} isLoading={isLoading} error={error} />
    <div className="min-h-screen bg-base-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <button onClick={(): void => router.back()} className="btn btn-outline">
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Dashboard
        </button>
        <ThemeToggleFixed />
      </div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6 underline decoration-3">
          Manage Users
        </h1>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          {/* search user */}
          <SearchBar
            SearchQuery={SearchQuery}
            setSearchQuery={setSearchQuery}
          />
          {/* add User */}
          <AddUser />
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
              <th className="text-center">Profile Pic</th>
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
                      <div className="avatar">
                        <div className="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                          {user.image ? (
                            <Image
                              src={user.image}
                              alt={`${user.firstname}'s profile`}
                              height={48}
                              width={48}
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full bg-base-300 text-base-content">
                              {user.firstname.charAt(0)}
                              {user.lastname?.charAt(0)}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

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
                        <UpdateUserRole user={user} />
                        <DeleteUser filteredUsers={filteredUsers} userid={String(user._id)} />
                        <div className="bg-accent p-[0.41rem] rounded-lg">
                          <ProfileImgUpload id={String(user._id)} isAbsolute={false} />
                        </div>
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
    </div>
    </>
  );
};

export default ManageUsers;
