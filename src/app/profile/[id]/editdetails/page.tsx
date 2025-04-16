"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { IoMdArrowBack } from "react-icons/io";
import { FaSave } from "react-icons/fa";
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "@/app/services/UserData";
import { toast } from "react-toastify";
import ToastStyles from "@/styles/ToastStyles";
import AddressInput from "@/components/profile/AddressInput";
import PhoneInput from "@/components/profile/PhoneInput";
import FirstLastName from "@/components/profile/FirstLastName";
import QueryStateHandler from "@/components/QueryStateHandler";
import MutationStateHandler from "@/components/MutationStateHandler";

const EditDetails = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;

  const [Phone, setPhone] = useState<string | undefined>();
  const [PhoneError, setPhoneError] = useState<boolean>(false);

  const { data, isError, isLoading, error } = useGetUserByIdQuery(id);
  const [
    updateUser,
    {
      isLoading: isLoadingUpdate,
      isError: isErrorUpdate,
      isSuccess: isSuccessUpdate,
      error: errorUpdate,
    },
  ] = useUpdateUserMutation();

  const handleSubmit = async (formdata: FormData): Promise<void> => {

    const firstname = formdata.get("firstname") as string | undefined;
    const lastname = formdata.get("lastname") as string | undefined;
    const phone = formdata.get("phone") as string | undefined;
    const address = formdata.get("address") as string | undefined;

    try {
      const updatedUser = {
        firstname,
        lastname,
        phone,
        address,
      };
      await updateUser({ id, updatedUser });
      setTimeout(() => {
        router.replace(`/profile/${id}/personaldetails`);
      }, 1500);
    } catch (err) {
      toast.error("couldn't update the user info", ToastStyles);
      console.error("couldn't update the user info ", err);
    }
  };

  return (
    <>
      <QueryStateHandler
        isLoading={isLoading}
        isError={isError}
        error={error}
        LoadingFull={true}
      />
      <MutationStateHandler
        isError={isErrorUpdate}
        isSuccess={isSuccessUpdate}
        error={errorUpdate}
        SuccessMessage="User Info Updated Successfully"
      />
      {!isLoading && !isError && data && (
        <div className="col-span-1 md:col-span-3">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-center">
                <h2 className="card-title text-2xl">
                  Edit Personal Information
                </h2>
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
                  <FirstLastName
                    firstname={data?.firstname}
                    lastname={data?.lastname}
                  />
                  {/* Phone */}
                  <PhoneInput
                    phone={data?.phone}
                    Phone={Phone}
                    setPhone={setPhone}
                    PhoneError={PhoneError}
                    setPhoneError={setPhoneError}
                  />
                </div>

                {/* Address Section */}
                <AddressInput address={data?.address} />

                {/* Form Actions */}
                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    disabled={
                      (PhoneError && Phone && Phone?.length > 0) || isLoadingUpdate
                    }
                    className="btn btn-primary"
                  >
                    {isLoadingUpdate ? (
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
      )}
    </>
  );
};

export default EditDetails;
