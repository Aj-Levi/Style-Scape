"use client";

import { useGetUserByIdQuery } from "@/app/services/UserData";
import React from "react";
import { RiEdit2Line } from "react-icons/ri";
import { useRouter } from "next/navigation";

const PersonalDetails = ({params}: {params: Promise<{id: string}>}) => {

  const router = useRouter();
  
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;

  const {data , isError , isLoading} = useGetUserByIdQuery(id);

  if(isError){
    return (
      <div className="col-span-1 md:col-span-3">
        <div className="card bg-error shadow-xl">
          <div className="card-body text-center">
            <h2 className="card-title text-2xl text-error-content justify-center">Error Loading Profile</h2>
            <p className="text-error-content">We couldn't load the user information. Please try again later.</p>
            <div className="card-actions justify-center mt-4">
              <button className="btn btn-outline btn-sm text-error-content" onClick={() => window.location.reload()}>
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if(isLoading){
    return (
      <div className="h-full grid place-content-center bg-base-300 col-span-1 md:col-span-3">
        <span className="loading loading-spinner text-accent loading-xl"></span>
      </div>
    );
  }

  return (
    <div className="col-span-1 md:col-span-3">
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between items-center">
            <h2 className="card-title text-2xl">Personal Information</h2>
            <button onClick={()=>router.push(`/profile/${id}/editdetails`)} className="btn btn-primary btn-sm font-extrabold">
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
              <h3 className="font-semibold text-base-content/70 mb-1">Email</h3>
              <p className="text-lg">{data?.email}</p>
            </div>
            <div>
              <h3 className={`font-semibold text-base-content/70 mb-1`}>Phone</h3>
              <p className={`text-lg ${data?.phone?"":"text-red-500 text-sm font-semibold"}`}>{data?.phone?data?.phone: "phone number not registered"}</p>
            </div>
          </div>

          <div className="divider"></div>
          <h2 className="card-title text-2xl">Shipping Address</h2>

        <div className={`p-4 bg-base-300 rounded-lg mt-2 ${data?.address?"":"text-red-500 font-semibold"}`}>
            <p>{data?.address?data?.address: "delivery address not set"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;
