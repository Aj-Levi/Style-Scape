"use client";

import React from "react";
import PasswordChange from "@/components/profile/PasswordChange";
import DeleteAccount from "@/components/profile/DeleteAccount";

const UserSettings = ({ params }: { params: Promise<{ id: string }> }) => {
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;

  return (
    <div className="col-span-1 md:col-span-3">
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold mb-8 pb-2 border-b border-base-300">
            Account Settings
          </h2>

          <div className="space-y-8">
            {/* Password Change Section */}
            <PasswordChange id={id} />

            {/* Delete Account Section */}
            <DeleteAccount id={id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
