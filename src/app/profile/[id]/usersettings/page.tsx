import React from "react";

const UserSettings = () => {
  return (
    <div className="col-span-1 md:col-span-3">
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-6">Account Settings</h2>

          <div className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email Notifications</span>
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  defaultChecked
                />
                <span>Receive email about new products and deals</span>
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <button className="btn btn-outline w-48">Change Password</button>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Delete Account</span>
              </label>
              <button className="btn btn-error w-48">Delete Account</button>
              <label className="label">
                <span className="label-text-alt text-error">
                  This action cannot be undone.
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
