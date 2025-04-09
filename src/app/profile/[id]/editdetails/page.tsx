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
import dummyimage from "@/public/images/LoginBG.png";

const EditDetails = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;

  const [FirstName, setFirstName] = useState<string | undefined>();
  const [LastName, setLastName] = useState<string | undefined>();
  const [Phone, setPhone] = useState<string | undefined>();
  const [Address, setAddress] = useState<string | undefined>();
  const [Image, setImage] = useState<string | undefined>();
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

  const reset = (): void => {
    setFirstName(data?.firstname || "");
    setLastName(data?.lastname || "");
    setPhone(data?.phone || "");
    setAddress(data?.address || "");
    setImage(data?.image || "");
  };

  const validatePhone = (value: string | undefined): boolean => {
    if (!value || value.trim() === "") {
      setPhoneError(true);
      return false;
    }

    const digitsOnly = value.replace(/\D/g, "");

    const isValid =
      digitsOnly.length === 10 ||
      (value.startsWith("+") && digitsOnly.length >= 11);

    setPhoneError(!isValid);
    return isValid;
  };

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setImage(event.target.value);
  };

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
              {/* First Name */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold">First Name</span>
                </label>
                <input
                  type="text"
                  name="firstname"
                  value={
                    FirstName
                      ? FirstName
                      : data?.firstname
                      ? data.firstname
                      : ""
                  }
                  onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                    setFirstName(e.target.value)
                  }
                  placeholder="Enter your first name"
                  className={`input input-bordered w-full`}
                />
              </div>

              {/* Last Name */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold">Last Name</span>
                </label>
                <input
                  type="text"
                  name="lastname"
                  value={
                    LastName ? LastName : data?.lastname ? data.lastname : ""
                  }
                  onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                    setLastName(e.target.value)
                  }
                  placeholder="Enter your last name"
                  className={`input input-bordered w-full`}
                />
              </div>

              {/* Phone */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold">Phone</span>
                </label>
                <input
                  type="text"
                  name="phone"
                  value={Phone ? Phone : data?.phone ? data.phone : ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                    const newValue = e.target.value;
                    setPhone(newValue);
                    validatePhone(newValue);
                  }}
                  placeholder="Enter your phone number"
                  className={`input input-bordered w-full`}
                />
                {PhoneError && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      Please enter a valid phone number format
                    </span>
                  </label>
                )}
              </div>
            </div>

            {/* Address Section */}
            <div>
              <div className="divider"></div>
              <h2 className="card-title text-xl mb-4">Shipping Address</h2>

              <div className="form-control w-full flex flex-col space-y-4">
                <label className="label">
                  <span className="label-text font-semibold">Full Address</span>
                </label>
                <textarea
                  name="address"
                  placeholder="Enter your full address"
                  value={Address ? Address : data?.address ? data.address : ""}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>): void =>
                    setAddress(e.target.value)
                  }
                  className="textarea textarea-bordered h-24"
                  rows={3}
                ></textarea>
              </div>
            </div>

            {/* Image Section */}
            <div>
              <div className="divider"></div>
              <h2 className="card-title text-xl mb-4">Profile Image</h2>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold">Image URL</span>
                </label>
                <input
                  type="text"
                  name="image"
                  value={Image ? Image : data?.image ? data.image : ""}
                  onChange={handleImageChange}
                  placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                  className="input input-bordered w-full"
                />
                <label className="label">
                  <span className="label-text-alt">
                    Enter a direct link to an image
                  </span>
                </label>

                {Image && (
                  <div className="mt-4">
                    <p className="text-sm mb-2">Preview:</p>
                    <img
                      src={Image}
                      alt="Profile Preview"
                      className="w-32 h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = dummyimage.src;
                        e.currentTarget.onerror = null;
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 mt-6">
              <button onClick={reset} type="button" className="btn btn-ghost">
                Reset
              </button>
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
