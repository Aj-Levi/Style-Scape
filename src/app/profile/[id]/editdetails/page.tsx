"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { IoMdArrowBack } from "react-icons/io";
import { FaSave } from "react-icons/fa";
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "@/app/services/UserData";
import { toast, ToastContainer } from "react-toastify";
import ToastStyles from "@/styles/ToastStyles";
import AddressInput from "@/components/profile/AddressInput";
import PhoneInput from "@/components/profile/PhoneInput";
import FirstLastName from "@/components/profile/FirstLastName";

const EditDetails = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;

  const [Phone, setPhone] = useState<string | undefined>();
      const [PhoneError, setPhoneError] = useState<boolean>(false);
  const [IsUpdating, setIsUpdating] = useState<boolean>(false);

  const { data, isError, isLoading } = useGetUserByIdQuery(id);
  const [
    updateUser,
    { isLoading: isLoadingUpdate },
  ] = useUpdateUserMutation();

  if (isLoading) {
    return (
      <div className="h-full grid place-content-center bg-base-300 col-span-1 md:col-span-3">
        <span className="loading loading-spinner text-accent loading-xl"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="col-span-1 md:col-span-3">
        <div className="card bg-error shadow-xl">
          <div className="card-body text-center">
            <h2 className="card-title text-2xl text-error-content justify-center">
              Error Loading Profile
            </h2>
            <p className="text-error-content">
              We couldn't load the user information. Please try again later.
            </p>
            <div className="card-actions justify-center mt-4">
              <button
                className="btn btn-outline btn-sm text-error-content"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (formdata: FormData): Promise<void> => {

    setIsUpdating(true);
    
    const firstname = formdata.get("firstname") as string | undefined;
    const lastname = formdata.get("lastname") as string | undefined;
    const phone = formdata.get("phone") as string | undefined;
    const address = formdata.get("address") as string | undefined;
    const image = formdata.get("image") as string | undefined;

    try {
      const updatedUser = {
        firstname,
        lastname,
        phone,
        address,
        image,
      };
      await updateUser({ id, updatedUser });
      toast.success("updated info successfully", ToastStyles);
      setTimeout(() => {
        router.replace(`/profile/${id}/personaldetails`);
      }, 1500);
    } catch (err) {
      toast.error("couldn't update the user info", ToastStyles);
      console.error("couldn't update the user info", err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="col-span-1 md:col-span-3">
      <ToastContainer />
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between items-center">
            <h2 className="card-title text-2xl">Edit Personal Information</h2>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => router.back()}
            >
              <IoMdArrowBack className="mr-1" /> Back
            </button>
          </div>
          <div className="divider"></div>

          <form action={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* First and Last name */}
              <FirstLastName firstname={data?.firstname} lastname={data?.lastname} />
              {/* Phone */}
              <PhoneInput phone={data?.phone} Phone={Phone} setPhone={setPhone} PhoneError={PhoneError} setPhoneError={setPhoneError} />
            </div>

            {/* Address Section */}
            <AddressInput address={data?.address} />

            {/* Form Actions */}
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                disabled={(PhoneError && Phone && Phone?.length > 0) || IsUpdating || isLoadingUpdate}
                className="btn btn-primary"
              >
                {IsUpdating || isLoadingUpdate ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Updating...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" /> Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditDetails;
