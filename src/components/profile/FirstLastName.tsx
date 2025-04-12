"use client";

import React, { useState } from "react";

const FirstLastName = ({
  firstname,
  lastname,
}: {
  firstname: string | undefined;
  lastname: string | undefined;
}) => {
  const [FirstName, setFirstName] = useState<string | undefined>();
  const [LastName, setLastName] = useState<string | undefined>();

  return (
    <>
      {/* First Name */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-semibold">First Name</span>
        </label>
        <input
          type="text"
          name="firstname"
          value={FirstName ? FirstName : firstname ? firstname : ""}
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
          value={LastName ? LastName : lastname ? lastname : ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
            setLastName(e.target.value)
          }
          placeholder="Enter your last name"
          className={`input input-bordered w-full`}
        />
      </div>
    </>
  );
};

export default FirstLastName;
