"use client"

import ConfigurationCards from "@/components/Configuration";
import { useConfigurations } from "@/hooks/useConfigurations";
import React from "react";

const Configuration = () => {
  const data = useConfigurations()
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-700">Configuration</h1>
      <p className="text-xs text-gray-400 mb-2">Configure your assets</p>
      <div>
        <ConfigurationCards data={data}/>
      </div>
    </div>
  );
};

export default Configuration;
