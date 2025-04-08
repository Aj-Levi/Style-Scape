"use client";

import { TabInterface } from "@/Interfaces";
import { useRouter } from "next/navigation";
import React, { ReactNode, useState } from "react";

const SidebarTabs = ({ tabs , userid }: { tabs: TabInterface[] , userid: string }) => {
  const [ActiveTab, setActiveTab] = useState("personaldetails");
  const router = useRouter();

  return (
    <div className="w-full">
      {tabs.map((tab: TabInterface): ReactNode => (
        <button
          key={tab.id}
          onClick={() => {
            setActiveTab(tab.id);
            if(tab.id === "continueshopping") router.push(`/home`);
            if(tab.id === "manageusers" || tab.id === "managecategories") router.push(`/admin/${userid}/${tab.id}`);
            else router.push(`/profile/${userid}/${tab.id}`);
        }}
          className={`btn btn-ghost justify-start w-full mb-2 ${
            ActiveTab === tab.id ? "btn-active border-accent" : ""
          }`}
        >
          <span className="mr-2">{tab.icon}</span> {tab.label}
        </button>
      ))}
    </div>
  );
};

export default SidebarTabs;
