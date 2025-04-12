"use client";

import React, { useState } from "react";

const AddressInput = ({ address }: { address: string | undefined }) => {
  const [Address, setAddress] = useState<string | undefined>();

  return (
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
          value={Address ? Address : address ? address : ""}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>): void =>
            setAddress(e.target.value)
          }
          className="textarea textarea-bordered h-24"
          rows={3}
        ></textarea>
      </div>
    </div>
  );
};

export default AddressInput;
