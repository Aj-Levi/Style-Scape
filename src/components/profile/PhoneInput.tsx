import React from "react";

interface Props{
    Phone: string | undefined;
    phone: string | undefined;
    setPhone: (str:string) => void;
    PhoneError: boolean;
    setPhoneError: (val:boolean) => void;
}

const PhoneInput = ({Phone, phone, setPhone, PhoneError, setPhoneError}: Props) => {

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
    
  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text font-semibold">Phone</span>
      </label>
      <input
        type="text"
        name="phone"
        value={Phone ? Phone : phone ? phone : ""}
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
  );
};

export default PhoneInput;
