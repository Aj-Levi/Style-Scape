"use client";

import { useGetUserByIdQuery } from "@/app/services/UserData";
import React from "react";
import { RiEdit2Line } from "react-icons/ri";
import { useRouter } from "next/navigation";
import QueryStateHandler from "@/components/QueryStateHandler";

const PersonalDetails = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();

  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;

  const { data, isError, isLoading, error } = useGetUserByIdQuery(id);

  return (
    <>
      <QueryStateHandler
        isLoading={isLoading}
        isError={isError}
        error={error}
        LoadingFull={true}
      />
      {!isLoading && !isError && data && (
        <div className="col-span-1 md:col-span-3">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-center">
                <h2 className="card-title text-2xl">Personal Information</h2>
                <button
                  onClick={() => router.push(`/profile/${id}/editdetails`)}
                  className="btn btn-primary btn-sm font-extrabold"
                >
                  <RiEdit2Line className="mr-1 font-bold" /> Edit
                </button>
              </div>
              <div className="divider"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-base-content/70 mb-1">
                    First Name
                  </h3>
                  <p className="text-lg">{data?.firstname}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-base-content/70 mb-1">
                    Last Name
                  </h3>
                  <p className="text-lg">{data?.lastname}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-base-content/70 mb-1">
                    Email
                  </h3>
                  <p className="text-lg">{data?.email}</p>
                </div>
                <div>
                  <h3 className={`font-semibold text-base-content/70 mb-1`}>
                    Phone
                  </h3>
                  <p
                    className={`text-lg ${
                      data?.phone ? "" : "text-red-500 text-sm font-semibold"
                    }`}
                  >
                    {data?.phone ? data?.phone : "phone number not registered"}
                  </p>
                </div>
              </div>

              <div className="divider"></div>
              <h2 className="card-title text-2xl">Shipping Address</h2>

              <div
                className={`p-4 bg-base-300 rounded-lg mt-2 ${
                  data?.address ? "" : "text-red-500 font-semibold"
                }`}
              >
                <p>
                  {data?.address ? data?.address : "delivery address not set"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PersonalDetails;
